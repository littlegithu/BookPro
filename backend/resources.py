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
