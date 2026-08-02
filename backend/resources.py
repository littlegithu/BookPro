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
