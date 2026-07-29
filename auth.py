from flask import jsonify, request
from flask_bcrypt import check_password_hash, generate_password_hash
from sqlalchemy.exc import IntegrityError

from models import User, db
from schemas import user_schema, users_schema


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
    return user


def update_user_password(user, data):
    if "password" in data:
        data["password"] = hash_password(data["password"])
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return user


def login_user(data):
    email = data.get("email_address")
    password = data.get("password")
    user = User.query.filter_by(email_address=email).first()
    if not user or not check_password_hash(user.password, password):
        return None
    return user
