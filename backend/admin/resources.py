from flask import request
from flask_restful import Resource

from extensions import db
from model import Doctor
from schema import Doctor_schema, Doctors_schema
from .permissions import admin_required


class AdminDoctorList(Resource):
    @admin_required
    def get(self):
        doctors = Doctor.query.all()
        return Doctors_schema.dump(doctors)

    @admin_required
    def post(self):
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400
        doctor = Doctor(**data)
        db.session.add(doctor)
        db.session.commit()
        return Doctor_schema.dump(doctor), 201


class AdminDoctorDetail(Resource):
    @admin_required
    def get(self, id):
        doctor = Doctor.query.get_or_404(id)
        return Doctor_schema.dump(doctor)

    @admin_required
    def put(self, id):
        doctor = Doctor.query.get_or_404(id)
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400
        for key, value in data.items():
            setattr(doctor, key, value)
        db.session.commit()
        return Doctor_schema.dump(doctor)

    @admin_required
    def delete(self, id):
        doctor = Doctor.query.get_or_404(id)
        db.session.delete(doctor)
        db.session.commit()
        return {"message": "Doctor deleted successfully"}, 200