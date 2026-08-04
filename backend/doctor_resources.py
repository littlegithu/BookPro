from datetime import date, datetime

from admin.permissions import doctor_required
from extensions import db
from flask import request
from flask_restful import Resource
from models import (
    Appointment,
    Doctor,
    DoctorDocument,
    DoctorSchedule,
    Hospital,
    MedicalRecord,
    Notification,
    Patient,
    Prescription,
    Review,
)
from schemas import (
    Appointment_schema,
    Appointments_schema,
    DoctorDocument_schema,
    DoctorDocuments_schema,
    DoctorSchedule_schema,
    DoctorSchedules_schema,
    MedicalRecord_schema,
    MedicalRecords_schema,
    Notification_schema,
    Notifications_schema,
    Prescription_schema,
    Prescriptions_schema,
    Reviews_schema,
)
from sqlalchemy import func
from sqlalchemy.orm import joinedload


def get_today_date_filter():
    today_start = datetime.combine(date.today(), datetime.min.time())
    today_end = datetime.combine(date.today(), datetime.max.time())
    return today_start, today_end


class DoctorDashboard(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        today_start, today_end = get_today_date_filter()

        today_appointments = Appointment.query.filter(
            Appointment.doctor_id == doctor.id,
            Appointment.appointment_date >= today_start,
            Appointment.appointment_date <= today_end,
        ).count()

        upcoming_count = Appointment.query.filter(
            Appointment.doctor_id == doctor.id,
            Appointment.appointment_date > today_end,
            Appointment.status.in_(['Scheduled', 'Pending']),
        ).count()

        completed_count = Appointment.query.filter(
            Appointment.doctor_id == doctor.id,
            Appointment.status == 'Completed',
        ).count()

        cancelled_count = Appointment.query.filter(
            Appointment.doctor_id == doctor.id,
            Appointment.status == 'Cancelled',
        ).count()

        pending_count = Appointment.query.filter(
            Appointment.doctor_id == doctor.id,
            Appointment.status == 'Pending',
        ).count()

        patient_ids = db.session.query(
            Appointment.patient_id
        ).filter(
            Appointment.doctor_id == doctor.id
        ).distinct().count()

        avg_rating = doctor.rating or 0

        monthly_earnings = db.session.query(
            func.sum(Doctor.fee)
        ).join(Appointment).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.status == 'Completed',
            func.date_trunc('month', Appointment.appointment_date) ==
            func.date_trunc('month', db.func.current_timestamp()),
        ).scalar() or 0

        result = {
            'id': doctor.id,
            'first_name': doctor.first_name,
            'last_name': doctor.last_name,
            'specialty': doctor.specialty,
            'profile_image': doctor.profile_image,
            'bio': doctor.bio,
            'rating': doctor.rating,
            'reviews': doctor.reviews,
            'today_appointments': today_appointments,
            'upcoming_appointments': upcoming_count,
            'completed_appointments': completed_count,
            'cancelled_appointments': cancelled_count,
            'pending_appointments': pending_count,
            'total_patients': patient_ids,
            'average_rating': round(avg_rating, 1) if avg_rating else 0,
            'monthly_earnings': int(monthly_earnings),
        }
        return result


class DoctorAppointmentList(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        tab = request.args.get('tab', 'today')
        search_query = request.args.get('q', type=str)
        hospital_id = request.args.get('hospital_id', type=int)
        ct = request.args.get('consultation_type', type=str)
        status_filter = request.args.get('status', type=str)
        today_start, today_end = get_today_date_filter()

        query = Appointment.query.options(
            joinedload(Appointment.patient),
            joinedload(Appointment.hospital),
            joinedload(Appointment.medical_record),
            joinedload(Appointment.doctor),
        ).filter(Appointment.doctor_id == doctor.id)

        if tab == 'today':
            query = query.filter(
                Appointment.appointment_date >= today_start,
                Appointment.appointment_date <= today_end,
            )
        elif tab == 'upcoming':
            query = query.filter(
                Appointment.appointment_date > today_end,
                Appointment.status.in_(['Scheduled', 'Pending']),
            )
        elif tab == 'completed':
            query = query.filter(Appointment.status == 'Completed')
        elif tab == 'cancelled':
            query = query.filter(Appointment.status == 'Cancelled')
        elif tab == 'pending':
            query = query.filter(Appointment.status == 'Pending')

        if search_query:
            pattern = f"%{search_query}%"
            query = query.join(Patient).filter(
                db.or_(
                    Patient.first_name.ilike(pattern),
                    Patient.last_name.ilike(pattern),
                )
            )

        if hospital_id:
            query = query.filter(Appointment.hospital_id == hospital_id)

        if ct:
            query = query.join(Doctor).filter(
                Doctor.consultation_type.ilike(f"%{ct}%")
            )

        if status_filter and tab == 'all':
            query = query.filter(Appointment.status == status_filter)

        appointments = query.order_by(Appointment.appointment_date).all()
        return Appointments_schema.dump(appointments)


class DoctorAppointmentDetail(Resource):
    @doctor_required
    def get(self, id):
        doctor = request.doctor
        appointment = Appointment.query.options(
            joinedload(Appointment.patient),
            joinedload(Appointment.hospital),
            joinedload(Appointment.medical_record),
            joinedload(Appointment.doctor),
        ).filter(
            Appointment.id == id,
            Appointment.doctor_id == doctor.id,
        ).first_or_404()
        return Appointment_schema.dump(appointment)

    @doctor_required
    def put(self, id):
        doctor = request.doctor
        appointment = Appointment.query.filter(
            Appointment.id == id,
            Appointment.doctor_id == doctor.id,
        ).first_or_404()

        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        allowed_fields = ['status', 'notes', 'appointment_date', 'appointment_time', 'hospital_id']
        for key in allowed_fields:
            if key in data:
                if key == 'appointment_date' and isinstance(data[key], str):
                    data[key] = datetime.fromisoformat(data[key])
                setattr(appointment, key, data[key])

        db.session.commit()
        return Appointment_schema.dump(appointment)

    @doctor_required
    def delete(self, id):
        doctor = request.doctor
        appointment = Appointment.query.filter(
            Appointment.id == id,
            Appointment.doctor_id == doctor.id,
        ).first_or_404()
        appointment.status = 'Cancelled'
        db.session.commit()
        return {"message": "Appointment cancelled successfully"}, 200


class DoctorPatientList(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        search_query = request.args.get('q', type=str)

        patient_ids = db.session.query(Appointment.patient_id).filter(
            Appointment.doctor_id == doctor.id
        ).distinct().all()
        patient_ids = [pid for (pid,) in patient_ids]

        query = Patient.query.filter(Patient.id.in_(patient_ids))

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

        patients = query.all()
        result = []
        for patient in patients:
            last_visit = Appointment.query.filter(
                Appointment.doctor_id == doctor.id,
                Appointment.patient_id == patient.id,
                Appointment.status == 'Completed',
            ).order_by(Appointment.appointment_date.desc()).first()

            upcoming = Appointment.query.filter(
                Appointment.doctor_id == doctor.id,
                Appointment.patient_id == patient.id,
                Appointment.appointment_date > datetime.now,
                Appointment.status.in_(['Scheduled', 'Pending']),
            ).order_by(Appointment.appointment_date.asc()).first()

            dob = patient.dob
            age = None
            if dob:
                age = (date.today - dob).days // 365

            result.append({
                'id': patient.id,
                'first_name': patient.first_name,
                'last_name': patient.last_name,
                'email': patient.email,
                'phone': patient.phone,
                'gender': patient.gender,
                'dob': patient.dob.isoformat() if patient.dob else None,
                'age': age,
                'address': patient.address,
                'last_visit': last_visit.appointment_date.isoformat() if last_visit else None,
                'upcoming_appointment': upcoming.appointment_date.isoformat() if upcoming else None,
            })
        return result


class DoctorPatientDetail(Resource):
    @doctor_required
    def get(self, id):
        doctor = request.doctor
        patient = Patient.query.get_or_404(id)

        appointments = Appointment.query.options(
            joinedload(Appointment.medical_record),
        ).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.patient_id == patient.id,
        ).order_by(Appointment.appointment_date.desc()).all()

        medical_records = MedicalRecord.query.filter(
            MedicalRecord.doctor_id == doctor.id,
            MedicalRecord.patient_id == patient.id,
        ).order_by(MedicalRecord.created_at.desc()).all()

        prescriptions = Prescription.query.filter(
            Prescription.doctor_id == doctor.id,
            Prescription.patient_id == patient.id,
        ).order_by(Prescription.created_at.desc()).all()

        dob = patient.dob
        age = (date.today - dob).days // 365 if dob else None

        appointment_history = []
        for appt in appointments:
            record = MedicalRecord_schema.dump(appt.medical_record) if appt.medical_record else None
            appointment_history.append({
                'id': appt.id,
                'appointment_date': appt.appointment_date.isoformat(),
                'appointment_time': appt.appointment_time.isoformat() if appt.appointment_time else None,
                'status': appt.status,
                'notes': appt.notes,
                'consultation_type': doctor.consultation_type,
                'hospital_name': appt.hospital.name if appt.hospital else doctor.hospital_name,
                'medical_record': record,
            })

        return {
            'id': patient.id,
            'first_name': patient.first_name,
            'last_name': patient.last_name,
            'email': patient.email,
            'phone': patient.phone,
            'gender': patient.gender,
            'dob': patient.dob.isoformat() if patient.dob else None,
            'age': age,
            'address': patient.address,
            'appointment_history': appointment_history,
            'medical_records': MedicalRecords_schema.dump(medical_records),
            'prescriptions': Prescriptions_schema.dump(prescriptions),
        }


class DoctorMedicalRecordList(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        search_query = request.args.get('q', type=str)

        query = MedicalRecord.query.filter(MedicalRecord.doctor_id == doctor.id)

        if search_query:
            pattern = f"%{search_query}%"
            query = query.join(Patient).filter(
                db.or_(
                    Patient.first_name.ilike(pattern),
                    Patient.last_name.ilike(pattern),
                    Patient.email.ilike(pattern),
                )
            )

        records = query.order_by(MedicalRecord.created_at.desc()).all()
        return MedicalRecords_schema.dump(records)

    @doctor_required
    def post(self):
        doctor = request.doctor
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        data['doctor_id'] = doctor.id

        appointment_id = data.get('appointment_id')
        if appointment_id:
            appointment = Appointment.query.filter(
                Appointment.id == appointment_id,
                Appointment.doctor_id == doctor.id,
            ).first_or_404()
            data['patient_id'] = appointment.patient_id

        errors = MedicalRecord_schema.validate(data)
        if errors:
            return {"error": "Validation failed", "details": errors}, 400

        record = MedicalRecord(**data)
        db.session.add(record)
        db.session.commit()
        return MedicalRecord_schema.dump(record), 201


class DoctorMedicalRecordDetail(Resource):
    @doctor_required
    def get(self, id):
        doctor = request.doctor
        record = MedicalRecord.query.filter(
            MedicalRecord.id == id,
            MedicalRecord.doctor_id == doctor.id,
        ).first_or_404()
        return MedicalRecord_schema.dump(record)

    @doctor_required
    def put(self, id):
        doctor = request.doctor
        record = MedicalRecord.query.filter(
            MedicalRecord.id == id,
            MedicalRecord.doctor_id == doctor.id,
        ).first_or_404()

        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        updatable_fields = [
            'diagnosis', 'symptoms', 'prescription', 'treatment_plan',
            'lab_requests', 'follow_up_date', 'additional_notes'
        ]
        for key in updatable_fields:
            if key in data:
                if key == 'follow_up_date' and data[key] and isinstance(data[key], str):
                    data[key] = datetime.fromisoformat(data[key])
                setattr(record, key, data[key])

        db.session.commit()
        return MedicalRecord_schema.dump(record)

    @doctor_required
    def delete(self, id):
        doctor = request.doctor
        record = MedicalRecord.query.filter(
            MedicalRecord.id == id,
            MedicalRecord.doctor_id == doctor.id,
        ).first_or_404()
        db.session.delete(record)
        db.session.commit()
        return {"message": "Medical record deleted successfully"}, 200


class DoctorPrescriptionList(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        search_query = request.args.get('q', type=str)

        query = Prescription.query.filter(Prescription.doctor_id == doctor.id)

        if search_query:
            pattern = f"%{search_query}%"
            query = query.join(Patient).filter(
                db.or_(
                    Patient.first_name.ilike(pattern),
                    Patient.last_name.ilike(pattern),
                    Patient.email.ilike(pattern),
                )
            )

        prescriptions = query.order_by(Prescription.created_at.desc()).all()
        return Prescriptions_schema.dump(prescriptions)

    @doctor_required
    def post(self):
        doctor = request.doctor
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        data['doctor_id'] = doctor.id

        appointment_id = data.get('appointment_id')
        if appointment_id:
            appointment = Appointment.query.filter(
                Appointment.id == appointment_id,
                Appointment.doctor_id == doctor.id,
            ).first_or_404()
            data['patient_id'] = appointment.patient_id

        if 'patient_id' not in data:
            return {"error": "patient_id is required"}, 400

        errors = Prescription_schema.validate(data)
        if errors:
            return {"error": "Validation failed", "details": errors}, 400

        prescription = Prescription(**data)
        db.session.add(prescription)
        db.session.commit()
        return Prescription_schema.dump(prescription), 201


class DoctorPrescriptionDetail(Resource):
    @doctor_required
    def get(self, id):
        doctor = request.doctor
        prescription = Prescription.query.filter(
            Prescription.id == id,
            Prescription.doctor_id == doctor.id,
        ).first_or_404()
        return Prescription_schema.dump(prescription)

    @doctor_required
    def put(self, id):
        doctor = request.doctor
        prescription = Prescription.query.filter(
            Prescription.id == id,
            Prescription.doctor_id == doctor.id,
        ).first_or_404()

        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        updatable_fields = [
            'medicine', 'dosage', 'frequency', 'duration',
            'instructions', 'medical_record_id', 'appointment_id'
        ]
        for key in updatable_fields:
            if key in data:
                setattr(prescription, key, data[key])

        db.session.commit()
        return Prescription_schema.dump(prescription)

    @doctor_required
    def delete(self, id):
        doctor = request.doctor
        prescription = Prescription.query.filter(
            Prescription.id == id,
            Prescription.doctor_id == doctor.id,
        ).first_or_404()
        db.session.delete(prescription)
        db.session.commit()
        return {"message": "Prescription deleted successfully"}, 200


class DoctorScheduleList(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        schedules = DoctorSchedule.query.filter(
            DoctorSchedule.doctor_id == doctor.id
        ).order_by(DoctorSchedule.day_of_week).all()
        return DoctorSchedules_schema.dump(schedules)

    @doctor_required
    def post(self):
        doctor = request.doctor
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        data['doctor_id'] = doctor.id

        errors = DoctorSchedule_schema.validate(data)
        if errors:
            return {"error": "Validation failed", "details": errors}, 400

        existing = DoctorSchedule.query.filter(
            DoctorSchedule.doctor_id == doctor.id,
            DoctorSchedule.day_of_week == data['day_of_week'],
            DoctorSchedule.is_vacation is False,
            DoctorSchedule.is_break is False,
        ).first()

        if existing:
            db.session.delete(existing)

        schedule = DoctorSchedule(**data)
        db.session.add(schedule)
        db.session.commit()
        return DoctorSchedule_schema.dump(schedule), 201


class DoctorScheduleDetail(Resource):
    @doctor_required
    def put(self, id):
        doctor = request.doctor
        schedule = DoctorSchedule.query.filter(
            DoctorSchedule.id == id,
            DoctorSchedule.doctor_id == doctor.id,
        ).first_or_404()

        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        for key, value in data.items():
            setattr(schedule, key, value)

        db.session.commit()
        return DoctorSchedule_schema.dump(schedule)

    @doctor_required
    def delete(self, id):
        doctor = request.doctor
        schedule = DoctorSchedule.query.filter(
            DoctorSchedule.id == id,
            DoctorSchedule.doctor_id == doctor.id,
        ).first_or_404()
        db.session.delete(schedule)
        db.session.commit()
        return {"message": "Schedule deleted successfully"}, 200


class DoctorOwnAvailability(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        return {
            'accepting_patients': doctor.accepting_patients,
            'consultation_type': doctor.consultation_type,
            'appointment_duration': doctor.appointment_duration,
            'consultation_fee': doctor.consultation_fee or doctor.fee,
            'working_days': doctor.working_days,
            'working_hours': doctor.working_hours,
        }

    @doctor_required
    def put(self):
        doctor = request.doctor
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        updatable = ['accepting_patients', 'consultation_type',
                     'appointment_duration', 'consultation_fee', 'fee']
        for key in updatable:
            if key in data:
                setattr(doctor, key, data[key])

        db.session.commit()
        return {
            "message": "Availability updated successfully",
            "accepting_patients": doctor.accepting_patients,
            "consultation_type": doctor.consultation_type,
            "appointment_duration": doctor.appointment_duration,
            "consultation_fee": doctor.consultation_fee or doctor.fee,
        }, 200


class DoctorReviewList(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        reviews = Review.query.filter(
            Review.doctor_id == doctor.id
        ).order_by(Review.created_at.desc()).all()
        avg_rating = doctor.rating or 0
        return {
            'average_rating': round(avg_rating, 1) if avg_rating else 0,
            'total_reviews': doctor.reviews or 0,
            'reviews': Reviews_schema.dump(reviews),
        }


class DoctorNotifications(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        unread_only = request.args.get('unread_only', type=lambda v: v.lower() == 'true')

        query = Notification.query.filter(Notification.doctor_id == doctor.id)
        if unread_only:
            query = query.filter(Notification.is_read is False)

        notifications = query.order_by(Notification.created_at.desc()).all()
        return Notifications_schema.dump(notifications)


class DoctorNotificationDetail(Resource):
    @doctor_required
    def put(self, id):
        doctor = request.doctor
        notification = Notification.query.filter(
            Notification.id == id,
            Notification.doctor_id == doctor.id,
        ).first_or_404()

        data = request.get_json(force=True, silent=True)
        if 'is_read' in data:
            notification.is_read = data['is_read']

        db.session.commit()
        return Notification_schema.dump(notification)


class DoctorDocuments(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        doc_type = request.args.get('doc_type', type=str)

        query = DoctorDocument.query.filter(DoctorDocument.doctor_id == doctor.id)
        if doc_type:
            query = query.filter(DoctorDocument.doc_type == doc_type)

        documents = query.order_by(DoctorDocument.uploaded_at.desc()).all()
        return DoctorDocuments_schema.dump(documents)

    @doctor_required
    def post(self):
        doctor = request.doctor
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        data['doctor_id'] = doctor.id

        errors = DoctorDocument_schema.validate(data)
        if errors:
            return {"error": "Validation failed", "details": errors}, 400

        document = DoctorDocument(**data)
        db.session.add(document)
        db.session.commit()
        return DoctorDocument_schema.dump(document), 201


class DoctorProfile(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        hosp_ids = [
            int(h) for h in (doctor.hospital_ids or '0').split(',') if h
        ]
        hospitals = Hospital.query.filter(
            Hospital.id.in_(hosp_ids)
        ).all()

        schedules = DoctorSchedule.query.filter(
            DoctorSchedule.doctor_id == doctor.id,
            DoctorSchedule.is_vacation is False,
            DoctorSchedule.is_break is False,
        ).order_by(DoctorSchedule.day_of_week).all()

        days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
                        'Friday', 'Saturday', 'Sunday']

        schedule_list = []
        for sched in schedules:
            day_num = sched.day_of_week
            day_name = days_of_week[day_num] if 0 <= day_num < 7 else f'Day {day_num}'
            schedule_list.append({
                'id': sched.id,
                'day_of_week': day_num,
                'day_name': day_name,
                'start_time': sched.start_time.strftime('%H:%M') if sched.start_time else None,
                'end_time': sched.end_time.strftime('%H:%M') if sched.end_time else None,
                'is_break': sched.is_break,
                'is_vacation': sched.is_vacation,
                'is_emergency_available': sched.is_emergency_available,
            })

        return {
            'id': doctor.id,
            'first_name': doctor.first_name,
            'last_name': doctor.last_name,
            'email': doctor.email,
            'phone': doctor.phone,
            'specialty': doctor.specialty,
            'specialties': doctor.specialties,
            'bio': doctor.bio,
            'profile_image': doctor.profile_image,
            'languages': doctor.languages,
            'education': doctor.education,
            'certifications': doctor.certifications,
            'years_practice': doctor.years_practice,
            'working_days': doctor.working_days,
            'working_hours': doctor.working_hours,
            'fee': doctor.fee,
            'consultation_fee': doctor.consultation_fee or doctor.fee,
            'duration': doctor.duration,
            'appointment_duration': doctor.appointment_duration,
            'consultation_type': doctor.consultation_type,
            'accepting_patients': doctor.accepting_patients,
            'hospital_name': doctor.hospital_name,
            'hospital_location': doctor.hospital_location,
            'hospital_phone': doctor.hospital_phone,
            'hospital_ids': doctor.hospital_ids,
            'hospitals': [
                {'id': h.id, 'name': h.name, 'address': h.address}
                for h in hospitals
            ],
            'schedule': schedule_list,
            'rating': doctor.rating,
            'reviews': doctor.reviews,
            'verification_status': doctor.verification_status,
        }

    @doctor_required
    def put(self):
        doctor = request.doctor
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400

        fields = [
            'first_name', 'last_name', 'email', 'phone', 'specialty',
            'specialties', 'bio', 'profile_image', 'languages',
            'education', 'certifications', 'years_practice',
            'working_days', 'working_hours', 'fee', 'duration',
            'consultation_type', 'accepting_patients',
            'hospital_name', 'hospital_location', 'hospital_phone',
            'hospital_ids', 'available', 'consultation_fee',
            'appointment_duration'
        ]

        for key in fields:
            if key in data:
                setattr(doctor, key, data[key])

        db.session.commit()
        return {"message": "Profile updated successfully"}, 200


class DoctorAnalytics(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        from collections import defaultdict
        from datetime import timedelta

        today = date.today()
        seven_months_ago = today - timedelta(days=210)

        appts_q = Appointment.query.filter(
            Appointment.doctor_id == doctor.id,
            Appointment.appointment_date >= seven_months_ago,
            Appointment.appointment_date <= today,
        )

        appts_per_month = defaultdict(int)
        appts_per_week = defaultdict(int)

        for appt in appts_q:
            m = appt.appointment_date.strftime('%Y-%m')
            appts_per_month[m] += 1
            w = int(appt.appointment_date.strftime('%U'))
            y = appt.appointment_date.year
            appts_per_week[f"{y}-W{w}"] += 1

        revs_data = Review.query.filter(
            Review.doctor_id == doctor.id,
            Review.created_at >= seven_months_ago,
        )
        avg_ratings = defaultdict(list)
        for rev in revs_data:
            m = rev.created_at.strftime('%Y-%m')
            avg_ratings[m].append(rev.rating)

        avg_per_month = {}
        for m, ratings in avg_ratings.items():
            avg_per_month[m] = round(sum(ratings) / len(ratings), 1)

        completed = Appointment.query.filter(
            Appointment.doctor_id == doctor.id,
            Appointment.status == 'Completed',
            Appointment.appointment_date >= seven_months_ago,
        )

        income = defaultdict(int)
        for appt in completed:
            m = appt.appointment_date.strftime('%Y-%m')
            income[m] += doctor.fee or 0

        ct_counts = defaultdict(int)
        for appt in appts_q:
            ct = doctor.consultation_type or 'Unknown'
            ct_counts[ct] += 1

        unique_patients = Appointment.query.filter(
            Appointment.doctor_id == doctor.id,
            Appointment.appointment_date >= seven_months_ago,
            Appointment.status == 'Completed',
        ).distinct(Appointment.patient_id).count()

        return {
            'patients_per_month': dict(appts_per_month),
            'appointments_per_week': dict(appts_per_week),
            'average_ratings_per_month': avg_per_month,
            'monthly_income': dict(income),
            'cancelled_appointments_per_month': dict(appts_per_month),
            'popular_consultation_types': dict(ct_counts),
            'total_patients': unique_patients,
            'total_completed': completed.count(),
        }


class DoctorHospitals(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        hosp_ids = [int(h) for h in (doctor.hospital_ids or '0').split(',') if h]
        hospitals = Hospital.query.filter(Hospital.id.in_(hosp_ids)).all()

        days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday',
                        'Friday', 'Saturday', 'Sunday']

        result = []
        for hospital in hospitals:
            schedules = DoctorSchedule.query.filter(
                DoctorSchedule.doctor_id == doctor.id,
            ).all()

            working_days = []
            for sched in schedules:
                if sched.is_vacation is not True and sched.is_break is not True:
                    d = sched.day_of_week
                    day_name = days_of_week[d] if 0 <= d < 7 else f'Day {d}'
                    st = sched.start_time.strftime('%H:%M') if sched.start_time else None
                    et = sched.end_time.strftime('%H:%M') if sched.end_time else None
                    working_days.append({
                        'day': day_name,
                        'start_time': st,
                        'end_time': et,
                    })

            result.append({
                'hospital': {
                    'id': hospital.id,
                    'name': hospital.name,
                    'address': hospital.address,
                    'phone': hospital.phone,
                    'email': hospital.email,
                    'website': hospital.website,
                },
                'department': doctor.specialty,
                'working_days': working_days,
                'contact': {
                    'phone': hospital.phone,
                    'email': hospital.email,
                },
            })
        return result


class DoctorTodaySchedule(Resource):
    @doctor_required
    def get(self):
        doctor = request.doctor
        ts, te = get_today_date_filter()

        appts = Appointment.query.options(
            joinedload(Appointment.patient),
            joinedload(Appointment.hospital),
            joinedload(Appointment.medical_record),
        ).filter(
            Appointment.doctor_id == doctor.id,
            Appointment.appointment_date >= ts,
            Appointment.appointment_date <= te,
        ).order_by(Appointment.appointment_time).all()

        result = []
        for appt in appts:
            has_record = appt.medical_record is not None
            pname = (
                f"{appt.patient.first_name} {appt.patient.last_name}"
                if appt.patient else 'Unknown'
            )
            result.append({
                'id': appt.id,
                'patient_name': pname,
                'patient_id': appt.patient_id,
                'appointment_date': appt.appointment_date.isoformat(),
                'appointment_time': (
                    appt.appointment_time.strftime('%H:%M')
                    if appt.appointment_time else None
                ),
                'consultation_type': doctor.consultation_type,
                'hospital_name': (
                    appt.hospital.name if appt.hospital else doctor.hospital_name
                ),
                'hospital_location': (
                    appt.hospital.address if appt.hospital else doctor.hospital_location
                ),
                'status': appt.status,
                'record_exists': has_record,
                'notes': appt.notes,
            })
        return result
