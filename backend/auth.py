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

    new_patient = Patient(
        user_id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        dob=data.get("dob"),
        gender=data.get("gender", ""),
        address=data.get("address", ""),
    )
    db.session.add(new_patient)
    db.session.commit()

    return user


def update_user_password(user, data):
    if "password" in data:
        data["password"] = hash_password(data["password"])
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return user
