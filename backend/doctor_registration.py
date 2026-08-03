from flask import request
from flask_restful import Resource

from extensions import db
from model import Doctor
from schema import DoctorRegistration_schema, Doctor_schema, user_schema


class DoctorRegistration(Resource):
    def post(self):
        from auth import register_doctor

        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid JSON body"}, 400
        errors = DoctorRegistration_schema.validate(data)
        if errors:
            return errors, 400
        result = register_doctor(data)
        if isinstance(result, tuple):
            user, doctor = result
            return {"message": "Doctor registered successfully", "user": user_schema.dump(user), "doctor": Doctor_schema.dump(doctor)}, 201
        return result, 400