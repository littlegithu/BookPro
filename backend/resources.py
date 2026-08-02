from flask import abort, request
from flask_restful import Resource
from sqlalchemy.orm import joinedload

from model import Appointment, Doctor, Hospital, Review, User, db, Patient
from schema import (
    Appointment_schema,
    Appointments_schema,
    Doctor_schema,
    Doctors_schema,
    Hospital_schema,
    Hospitals_schema,
    Patient_schema,
    Patients_schema,
    Review_schema,
    Reviews_schema,
    user_schema,
    users_schema,
)


def get_json_data():
    data = request.get_json(force=True, silent=True)
    if not data:
        abort(400, description="Invalid JSON body")
    return data

# Users
class UserList(Resource):
    def get(self):
        users = User.query.all()
        return users_schema.dump(users)

    def post(self):
        from auth import register_user

        data = get_json_data()
        errors = user_schema.validate(data)
        if errors:
            return errors, 400
        result = register_user(data)
        if isinstance(result, tuple):
            return result
        return user_schema.dump(result), 201

class UserDetail(Resource):
    def get(self, id):
        user = User.query.get_or_404(id)
        return user_schema.dump(user)

    def put(self, id):
        from auth import update_user_password

        user = User.query.get_or_404(id)
        data = get_json_data()
        errors = user_schema.validate(data, partial=True)
        if errors:
            return errors, 400
        user = update_user_password(user, data)
        return user_schema.dump(user)

    def delete(self, id):
        user = User.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted successfully"}, 200


class UserLogin(Resource):
    def post(self):
        from auth import login_user

        data = get_json_data()
        user = login_user(data)
        if not user:
            return {"message": "Invalid credentials"}, 401
        return {"message": "Login successful", "user": user_schema.dump(user)}, 200

# Patients
class PatientList(Resource):
    def get(self):
        patients = Patient.query.all()
        return Patients_schema.dump(patients)

    def post(self):
        data = get_json_data()
        errors = Patient_schema.validate(data)
        if errors:
            return errors, 400
        patient_instance = Patient(**data)
        db.session.add(patient_instance)
        db.session.commit()
        return Patient_schema.dump(patient_instance), 201


class PatientDetail(Resource):
    def get(self, id):
        patient_instance = Patient.query.get_or_404(id)
        return Patients_schema.dump(patient_instance)

    def put(self, id):
        patient_instance = Patient.query.get_or_404(id)
        data = get_json_data()
        errors = Patient_schema.validate(data, partial=True)
        if errors:
            return errors, 400
        for key, value in data.items():
            setattr(patient_instance, key, value)
        db.session.commit()
        return Patient_schema.dump(patient_instance)

    def delete(self, id):
        patient_instance = Patient.query.get_or_404(id)
        db.session.delete(patient_instance)
        db.session.commit()
        return {"message": "Patient deleted successfully"}, 200


# Doctors
class DoctorList(Resource):
    def get(self):
        hospital_name = request.args.get('hospital_name', type=str)
        query = Doctor.query
        if hospital_name:
            query = query.filter(Doctor.hospital_name.ilike(f"%{hospital_name}%"))
        doctors = query.all()
        return Doctors_schema.dump(doctors)


class DoctorSearchSuggestions(Resource):
    def get(self):
        query = request.args.get('q', type=str)
        if not query:
            return []
        pattern = f"%{query}%"
        doctors = Doctor.query.filter(
            db.or_(
                Doctor.first_name.ilike(pattern),
                Doctor.last_name.ilike(pattern),
                Doctor.specialty.ilike(pattern),
                Doctor.hospital_name.ilike(pattern),
            )
        ).limit(10).all()
        hospitals = Hospital.query.filter(
            db.or_(
                Hospital.name.ilike(pattern),
                Hospital.address.ilike(pattern),
            )
        ).limit(5).all()
        results = []
        for doctor in doctors:
            label = f"{doctor.first_name} {doctor.last_name}"
            if doctor.specialty:
                label += f" — {doctor.specialty}"
            if doctor.hospital_name:
                label += f" @ {doctor.hospital_name}"
            results.append({
                'id': doctor.id,
                'label': label,
                'type': 'doctor',
            })
        for hospital in hospitals:
            results.append({
                'id': hospital.id,
                'label': hospital.name,
                'subtitle': hospital.address,
                'type': 'hospital',
            })
        return results

    def post(self):
        data = get_json_data()
        errors = Doctor_schema.validate(data)
        if errors:
            return errors, 400
        doctor = Doctor(**data)
        db.session.add(doctor)
        db.session.commit()
        return Doctor_schema.dump(doctor), 201


class DoctorDetail(Resource):
    def get(self, id):
        doctor = Doctor.query.get_or_404(id)
        return Doctor_schema.dump(doctor)

    def put(self, id):
        doctor = Doctor.query.get_or_404(id)
        data = get_json_data()
        errors = Doctor_schema.validate(data, partial=True)
        if errors:
            return errors, 400
        for key, value in data.items():
            setattr(doctor, key, value)
        db.session.commit()
        return Doctor_schema.dump(doctor)

    def delete(self, id):
        doctor = Doctor.query.get_or_404(id)
        db.session.delete(doctor)
        db.session.commit()
        return {"message": "Doctor deleted successfully"}, 200


# Reviews
class ReviewList(Resource):
    def get(self):
        reviews = Review.query.all()
        return Reviews_schema.dump(reviews)

    def post(self):
        data = get_json_data()
        errors = Review_schema.validate(data)
        if errors:
            return errors, 400
        review = Review(**data)
        db.session.add(review)
        db.session.commit()
        return Review_schema.dump(review), 201


class ReviewDetail(Resource):
    def get(self, id):
        review = Review.query.get_or_404(id)
        return Reviews_schema.dump(review)

    def put(self, id):
        review = Review.query.get_or_404(id)
        data = get_json_data()
        errors = Review_schema.validate(data, partial=True)
        if errors:
            return errors, 400
        for key, value in data.items():
            setattr(review, key, value)
        db.session.commit()
        return Review_schema.dump(review)

    def delete(self, id):
        review = Review.query.get_or_404(id)
        db.session.delete(review)
        db.session.commit()
        return {"message": "Review deleted successfully"}, 200


class DoctorReviews(Resource):
    def get(self, doctor_id):
        doctor = Doctor.query.get_or_404(doctor_id)
        reviews = Review.query.filter_by(doctor_id=doctor_id).all()
        return Reviews_schema.dump(reviews)


# Appointments
class AppointmentList(Resource):
    def get(self):
        appointments = Appointment.query.options(db.joinedload(Appointment.medical_record)).all()
        return Appointments_schema.dump(appointments)

    def post(self):
        from datetime import datetime

        data = get_json_data()
        errors = Appointment_schema.validate(data)
        if errors:
            return errors, 400
        if 'appointment_date' in data and isinstance(data['appointment_date'], str):
            data['appointment_date'] = datetime.fromisoformat(data['appointment_date'])
        appointment = Appointment(**data)
        db.session.add(appointment)
        db.session.commit()
        return Appointment_schema.dump(appointment), 201


class AppointmentDetail(Resource):
    def get(self, id):
        appointment = Appointment.query.options(db.joinedload(Appointment.medical_record)).get_or_404(id)
        return Appointments_schema.dump(appointment)

    def put(self, id):
        from datetime import datetime

        appointment = Appointment.query.get_or_404(id)
        data = get_json_data()
        errors = Appointment_schema.validate(data, partial=True)
        if errors:
            return errors, 400
        if 'appointment_date' in data and isinstance(data['appointment_date'], str):
            data['appointment_date'] = datetime.fromisoformat(data['appointment_date'])
        for key, value in data.items():
            setattr(appointment, key, value)
        db.session.commit()
        return Appointment_schema.dump(appointment)

    def delete(self, id):
        appointment = Appointment.query.get_or_404(id)
        db.session.delete(appointment)
        db.session.commit()
        return {"message": "Appointment deleted successfully"}, 200


# Hospitals
class HospitalList(Resource):
    def get(self):
        hospitals = Hospital.query.all()
        return Hospitals_schema.dump(hospitals)

    def post(self):
        data = get_json_data()
        errors = Hospital_schema.validate(data)
        if errors:
            return errors, 400
        hospital = Hospital(**data)
        db.session.add(hospital)
        db.session.commit()
        return Hospital_schema.dump(hospital), 201


class HospitalDetail(Resource):
    def get(self, id):
        hospital = Hospital.query.get_or_404(id)
        return Hospitals_schema.dump(hospital)

    def put(self, id):
        hospital = Hospital.query.get_or_404(id)
        data = get_json_data()
        errors = Hospital_schema.validate(data, partial=True)
        if errors:
            return errors, 400
        for key, value in data.items():
            setattr(hospital, key, value)
        db.session.commit()
        return Hospital_schema.dump(hospital)

    def delete(self, id):
        hospital = Hospital.query.get_or_404(id)
        db.session.delete(hospital)
        db.session.commit()
        return {"message": "Hospital deleted successfully"}, 200
