from flask import request
from flask_restful import Resource

from extensions import db
from model import Doctor, Hospital
from schema import Doctor_schema, Doctors_schema


class DoctorList(Resource):
    def get(self):
        hospital_name = request.args.get('hospital_name', type=str)
        query = Doctor.query
        if hospital_name:
            query = query.filter(Doctor.hospital_name.ilike(f"%{hospital_name}%"))
        doctors = query.all()
        return Doctors_schema.dump(doctors)

    def post(self):
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400
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
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400
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