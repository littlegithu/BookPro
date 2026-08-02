from flask import jsonify, request
from flask_bcrypt import check_password_hash, generate_password_hash
from model import Patient, User, db
from sqlalchemy.exc import IntegrityError


def hash_password(password):
    return generate_password_hash(password).decode("utf-8")


def register_user(data):
    if "password" in data:
        data["password"] = hash_password(data["password"])
    user = User(**data)
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Phone or email already exists"}, 409
