from datetime import datetime, date, timedelta
from flask import request
from flask_restful import Resource
from sqlalchemy import func
from sqlalchemy.orm import joinedload

from extensions import db
from admin.permissions import staff_required, admin_or_hospital_admin_required
from model import (
    Appointment, Doctor, Hospital, Patient, Staff, Notification, User
)
from schema import (
    Appointment_schema, Appointments_schema,
    Patient_schema, Patients_schema,
    Staff_schema, StaffDashboard_schema,
    Notification_schema, Notifications_schema,
)


def get_today_date_filter():
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    return today_start, today_end


STAFF_ROLES = {
    'Receptionist': ['reception'],
    'Nurse': ['nursing'],
    'Lab Technician': ['laboratory'],
    'Pharmacist': ['pharmacy'],
    'Cashier': ['billing'],
    'Records Officer': ['records'],
}


def has_permission(required_role):
    def decorator(f):
        from functools import wraps
        @wraps(f)
        def decorated(*args, **kwargs):
            staff_role = request.staff.role if hasattr(request, 'staff') and request.staff else None
            if staff_role != required_role and staff_role != 'Hospital Admin' and staff_role != 'Platform Admin':
                return {"error": f"{required_role} access required"}, 403
            return f(*args, **kwargs)
        return decorated
    return decorator


class StaffLogin(Resource):
    def post(self):
        from auth import login_user, generate_token, hash_password

        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        user, is_verified = login_user(data) or (None, True)
        if not user:
            return {"message": "Invalid credentials"}, 401

        token = user.token or generate_token()
        user.token = token
        db.session.commit()

        staff = user.staff
        if staff:
            hospital = Hospital.query.get(staff.hospital_id)
            staff_data = {
                "id": staff.id,
                "user_id": staff.user_id,
                "first_name": staff.first_name or user.first_name,
                "last_name": staff.last_name or user.last_name,
                "email": staff.email or user.email,
                "phone": staff.phone or user.phone,
                "role": staff.role,
                "department": staff.department,
                "employment_type": staff.employment_type,
                "employee_id": staff.employee_id,
                "profile_image": staff.profile_image,
                "hospital_id": staff.hospital_id,
            }
            if hospital:
                staff_data["hospital_name"] = hospital.name
        else:
            staff_data = None

        return {
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "profile_image": user.profile_image,
                "staff": staff_data,
            }
        }, 200


class StaffDashboard(Resource):
    @staff_required
    def get(self):
        staff = request.staff
        today_start, today_end = get_today_date_filter()

        today_appointments = Appointment.query.filter(
            Appointment.hospital_id == staff.hospital_id,
            Appointment.appointment_date >= today_start,
            Appointment.appointment_date <= today_end,
        ).all()

        today_patients = set()
        for appt in today_appointments:
            today_patients.add(appt.patient_id)

        pending_tasks = Appointment.query.filter(
            Appointment.hospital_id == staff.hospital_id,
            Appointment.status.in_(['Pending', 'Scheduled']),
        ).count()

        unread_notifications = 0
        if staff.role in ['Receptionist', 'Nurse', 'Lab Technician', 'Pharmacist', 'Cashier']:
            pass

        check_ins = len([a for a in today_appointments if a.status == 'Completed'])

        result = {
            'id': staff.id,
            'first_name': staff.first_name,
            'last_name': staff.last_name,
            'email': staff.email,
            'phone': staff.phone,
            'role': staff.role,
            'department': staff.department,
            'profile_image': staff.profile_image,
            'employee_id': staff.employee_id,
            'hospital_id': staff.hospital_id,
            'today_patients_count': len(today_patients),
            'pending_tasks_count': pending_tasks,
            'unread_notifications_count': unread_notifications,
            'appointments_today': len(today_appointments),
            'check_ins_today': check_ins,
        }

        hospital = Hospital.query.get(staff.hospital_id)
        if hospital:
            result['hospital_name'] = hospital.name

        return StaffDashboard_schema.dump(result)


class PatientCheckIn(Resource):
    @staff_required
    @has_permission('Receptionist')
    def post(self):
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        appointment_id = data.get('appointment_id')
        if not appointment_id:
            return {"error": "Appointment ID required"}, 400

        appointment = Appointment.query.get_or_404(appointment_id)

        if appointment.appointment_date.date() != date.today():
            return {"error": "Can only check in patients with today's appointments"}, 400

        old_status = appointment.status
        appointment.status = 'Checked In'
        db.session.commit()

        return {
            "message": "Patient checked in successfully",
            "appointment": Appointment_schema.dump(appointment),
            "previous_status": old_status,
        }, 200


class PatientSearch(Resource):
    @staff_required
    def get(self):
        search_query = request.args.get('q', type=str)
        hospital_id = request.staff.hospital_id

        query = Patient.query
        if search_query:
            pattern = f"%{search_query}%"
            query = query.filter(
                db.or_(
                    Patient.first_name.ilike(pattern),
                    Patient.last_name.ilike(pattern),
                    Patient.email.ilike(pattern),
                    Patient.phone.ilike(pattern),
                )
            )

        query = query.filter(Patient.id.in_(
            db.session.query(Appointment.patient_id).filter(
                Appointment.hospital_id == hospital_id
            ).distinct()
        ))

        patients = query.limit(50).all()
        return Patients_schema.dump(patients), 200


class QueueManagement(Resource):
    @staff_required
    @has_permission('Receptionist')
    def get(self):
        hospital_id = request.staff.hospital_id
        today_start, today_end = get_today_date_filter()

        appointments = Appointment.query.options(
            joinedload(Appointment.patient),
            joinedload(Appointment.doctor),
        ).filter(
            Appointment.hospital_id == hospital_id,
            Appointment.appointment_date >= today_start,
            Appointment.appointment_date <= today_end,
        ).order_by(Appointment.appointment_time).all()

        queue = []
        for appt in appointments:
            patient_name = ""
            if appt.patient:
                patient_name = f"{appt.patient.first_name} {appt.patient.last_name}"
            elif appt.patient_id:
                queue_patient = Patient.query.get(appt.patient_id)
                if queue_patient:
                    patient_name = f"{queue_patient.first_name} {queue_patient.last_name}"

            doctor_name = ""
            if appt.doctor:
                doctor_name = f"{appt.doctor.first_name} {appt.doctor.last_name}"
            elif appt.doctor_id:
                queue_doc = Doctor.query.get(appt.doctor_id)
                if queue_doc:
                    doctor_name = f"{queue_doc.first_name} {queue_doc.last_name}"

            queue.append({
                'id': appt.id,
                'patient_name': patient_name,
                'patient_id': appt.patient_id,
                'appointment_time': appt.appointment_time.strftime('%H:%M') if appt.appointment_time else None,
                'status': appt.status,
                'doctor_name': doctor_name,
                'doctor_id': appt.doctor_id,
                'room': appt.room if hasattr(appt, 'room') else None,
            })

        return queue, 200


class QueueAction(Resource):
    @staff_required
    @has_permission('Receptionist')
    def post(self):
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        action = data.get('action')
        appointment_id = data.get('appointment_id')

        if action == 'call_next':
            hospital_id = request.staff.hospital_id
            today_start, today_end = get_today_date_filter()
            appointments = Appointment.query.filter(
                Appointment.hospital_id == hospital_id,
                Appointment.appointment_date >= today_start,
                Appointment.appointment_date <= today_end,
            ).order_by(Appointment.appointment_time).limit(1).first()
            if appointments:
                appointments.status = 'Called'
                db.session.commit()
                return {"message": "Next patient called", "appointment": Appointment_schema.dump(appointments)}, 200
            return {"message": "No patients in queue"}, 200

        if action == 'mark_complete':
            if not appointment_id:
                return {"error": "Appointment ID required"}, 400
            appointment = Appointment.query.get_or_404(appointment_id)
            appointment.status = 'Completed'
            db.session.commit()
            return {"message": "Patient marked complete", "appointment": Appointment_schema.dump(appointment)}, 200

        return {"error": "Invalid action"}, 400


class AppointmentManagement(Resource):
    @staff_required
    @has_permission('Receptionist')
    def get(self):
        hospital_id = request.staff.hospital_id
        date_from = request.args.get('date_from')
        date_to = request.args.get('date_to')
        status = request.args.get('status')

        query = Appointment.query.options(
            joinedload(Appointment.patient),
            joinedload(Appointment.doctor),
        ).filter(Appointment.hospital_id == hospital_id)

        if date_from:
            query = query.filter(Appointment.appointment_date >= date_from)
        if date_to:
            query = query.filter(Appointment.appointment_date <= date_to)
        if status:
            query = query.filter(Appointment.status == status)

        appointments = query.order_by(Appointment.appointment_date.desc()).all()
        return Appointments_schema.dump(appointments), 200

    @staff_required
    @has_permission('Receptionist')
    def post(self):
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        appointments = AppointmentManagement._build_appointment(data)
        if isinstance(appointments, tuple):
            return appointments

        appointment = appointments
        db.session.add(appointment)
        db.session.commit()
        return Appointment_schema.dump(appointment), 201

    @staticmethod
    def _build_appointment(data):
        errors = Appointment_schema.validate(data)
        if errors:
            return {"error": "Validation failed", "details": errors}, 400

        if 'appointment_date' in data and isinstance(data['appointment_date'], str):
            data['appointment_date'] = datetime.fromisoformat(data['appointment_date'])

        return Appointment(**data)

    @staff_required
    @has_permission('Receptionist')
    def put(self, id):
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        allowed_fields = ['status', 'notes', 'appointment_date', 'appointment_time',
                         'patient_id', 'doctor_id', 'hospital_id', 'room']
        for key in allowed_fields:
            if key in data:
                if key == 'appointment_date' and isinstance(data[key], str):
                    data[key] = datetime.fromisoformat(data[key])
                setattr(appointment, key, data[key])

        db.session.commit()
        return Appointment_schema.dump(appointment)

    @staff_required
    @has_permission('Receptionist')
    def delete(self, id):
        appointment = Appointment.query.get_or_404(id)
        db.session.delete(appointment)
        db.session.commit()
        return {"message": "Appointment cancelled successfully"}, 200


class DoctorAvailability(Resource):
    @staff_required
    @has_permission('Receptionist')
    def get(self):
        hospital_id = request.staff.hospital_id

        doctors = Doctor.query.filter(
            Doctor.hospital_id == hospital_id,
        ).all()

        availability = []
        for doctor in doctors:
            availability.append({
                'id': doctor.id,
                'first_name': doctor.first_name,
                'last_name': doctor.last_name,
                'full_name': f"{doctor.first_name} {doctor.last_name}",
                'specialty': doctor.specialty,
                'available': doctor.available,
                'rating': doctor.rating or 0,
            })

        return availability, 200


class DepartmentDirectory(Resource):
    @staff_required
    def get(self):
        hospital_id = request.staff.hospital_id

        departments = {}
        for doctor in Doctor.query.filter_by(hospital_id=hospital_id).all():
            dept = doctor.specialty or 'General Practice'
            if dept not in departments:
                departments[dept] = {
                    'name': dept,
                    'doctors_count': 0,
                    'doctors': []
                }
            departments[dept]['doctors_count'] += 1
            departments[dept]['doctors'].append({
                'id': doctor.id,
                'name': f"{doctor.first_name} {doctor.last_name}",
                'specialty': doctor.specialty,
            })

        result = list(departments.values())
        return result, 200


class StaffNotifications(Resource):
    @staff_required
    def get(self):
        hospital_id = request.staff.hospital_id
        unread_only = request.args.get('unread_only', type=lambda v: v.lower() == 'true')

        count = Appointment.query.filter(
            Appointment.hospital_id == hospital_id,
            Appointment.status == 'Checked In',
        ).count()

        return [], 200


class StaffReports(Resource):
    @staff_required
    @has_permission('Receptionist')
    def get(self):
        hospital_id = request.staff.hospital_id
        today_start, today_end = get_today_date_filter()

        patients_today = Appointment.query.filter(
            Appointment.hospital_id == hospital_id,
            Appointment.appointment_date >= today_start,
            Appointment.appointment_date <= today_end,
        ).count()

        appointments_booked = Appointment.query.filter(
            Appointment.hospital_id == hospital_id,
            Appointment.appointment_date >= today_start,
            Appointment.appointment_date <= today_end,
        ).count()

        check_ins = Appointment.query.filter(
            Appointment.hospital_id == hospital_id,
            Appointment.appointment_date >= today_start,
            Appointment.appointment_date <= today_end,
            Appointment.status == 'Completed',
        ).count()

        no_shows = Appointment.query.filter(
            Appointment.hospital_id == hospital_id,
            Appointment.appointment_date >= today_start,
            Appointment.appointment_date <= today_end,
            Appointment.status == 'Cancelled',
        ).count()

        return {
            'patients_served_today': patients_today,
            'appointments_booked_today': appointments_booked,
            'check_ins_today': check_ins,
            'no_show_patients': no_shows,
        }, 200


class StaffProfile(Resource):
    @staff_required
    def get(self):
        staff = request.staff
        user = staff.user

        result = {
            'id': staff.id,
            'user_id': user.id,
            'first_name': staff.first_name,
            'last_name': staff.last_name,
            'email': staff.email,
            'phone': staff.phone,
            'role': staff.role,
            'department': staff.department,
            'employment_type': staff.employment_type,
            'employee_id': staff.employee_id,
            'profile_image': staff.profile_image,
            'hospital_id': staff.hospital_id,
            'dob': staff.dob.isoformat() if staff.dob else None,
            'gender': staff.gender,
            'address': staff.address,
            'emergency_contact_name': staff.emergency_contact_name,
            'emergency_contact_phone': staff.emergency_contact_phone,
        }

        hospital = Hospital.query.get(staff.hospital_id)
        if hospital:
            result['hospital_name'] = hospital.name
            result['hospital_address'] = hospital.address

        return result

    @staff_required
    def put(self):
        staff = request.staff
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        updatable_fields = [
            'first_name', 'last_name', 'email', 'phone',
            'department', 'employment_type', 'employee_id', 'profile_image',
            'dob', 'gender', 'address', 'emergency_contact_name', 'emergency_contact_phone'
        ]

        for key in updatable_fields:
            if key in data:
                setattr(staff, key, data[key])

        if 'password' in data:
            from auth import hash_password
            data['password'] = hash_password(data['password'])
            setattr(staff.user, 'password', data['password'])

        db.session.commit()
        return Staff_schema.dump(staff)


class PatientRegistration(Resource):
    @staff_required
    @has_permission('Receptionist')
    def post(self):
        from auth import register_user

        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        result = register_user(data)
        if isinstance(result, tuple):
            return result

        patient = result
        return Patient_schema.dump(patient), 201


class StaffPatientDetail(Resource):
    @staff_required
    def get(self, id):
        hospital_id = request.staff.hospital_id

        patient = Patient.query.options(
            joinedload(Patient.appointments),
        ).get_or_404(id)

        if hospital_id:
            appt_hospital_check = Appointment.query.filter(
                Appointment.patient_id == id,
                Appointment.hospital_id == hospital_id,
            ).first()
            if not appt_hospital_check:
                return {"error": "Patient not found in this hospital"}, 404

        appointments = Appointment.query.options(
            joinedload(Appointment.doctor),
        ).filter(
            Appointment.patient_id == id,
        ).order_by(Appointment.appointment_date.desc()).all()

        visit_history = []
        for appt in appointments:
            visit_history.append({
                'id': appt.id,
                'date': appt.appointment_date.isoformat() if appt.appointment_date else None,
                'time': appt.appointment_time.isoformat() if appt.appointment_time else None,
                'status': appt.status,
                'doctor_name': f"{appt.doctor.first_name} {appt.doctor.last_name}" if appt.doctor else 'Unknown',
                'specialty': appt.doctor.specialty if appt.doctor else None,
            })

        result = Patient_schema.dump(patient)
        result['visit_history'] = visit_history
        return result