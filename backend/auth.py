import secrets

from flask import jsonify, request
from flask_bcrypt import check_password_hash, generate_password_hash
from model import Patient, User, Doctor, Hospital, Staff
from extensions import db
from sqlalchemy.exc import IntegrityError


def hash_password(password):
    return generate_password_hash(password).decode("utf-8")


def generate_token():
    return secrets.token_hex(32)


def register_user(data):
    data.pop("password_confirm", None)
    if "password" in data:
        data["password"] = hash_password(data["password"])
    user = User(**data)
    if not user.token:
        user.token = generate_token()
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


def register_hospital(data):
    data.pop("password_confirm", None)
    hospital = Hospital(**data)
    db.session.add(hospital)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Hospital email or phone already exists"}, 409
    return hospital


def register_doctor(data):
    data.pop("password_confirm", None)
    if "password" in data:
        data["password"] = hash_password(data["password"])
    user_data = {
        "first_name": data.get("first_name"),
        "last_name": data.get("last_name"),
        "email": data.get("email"),
        "phone": data.get("phone"),
        "password": data.get("password"),
        "profile_image": data.get("profile_image"),
    }
    user = User(**user_data)
    user.role = "doctor"
    if not user.token:
        user.token = generate_token()
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Phone or email already exists"}, 409

    doctor = Doctor(
        user_id=user.id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        specialty=data.get("specialty", ""),
        hospital_id=data.get("hospital_id"),
        years_practice=data.get("years_practice", 0),
        working_hours=data.get("working_hours"),
        fee=data.get("fee"),
        duration=data.get("duration"),
        consultation_type=data.get("consultation_type"),
        languages=data.get("languages"),
        education=data.get("education"),
        certifications=data.get("certifications"),
        working_days=data.get("working_days"),
        profile_image=data.get("profile_image"),
    )
    db.session.add(doctor)
    db.session.commit()
    return user, doctor


def register_staff(data):
    data.pop("password_confirm", None)
    if "password" in data:
        data["password"] = hash_password(data["password"])
    user = User(**data)
    user.role = "staff"
    if not user.token:
        user.token = generate_token()
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Phone or email already exists"}, 409

    staff = Staff(
        user_id=user.id,
        hospital_id=data.get("hospital_id"),
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        role=data.get("role", "Receptionist"),
        department=data.get("department"),
        employment_type=data.get("employment_type", "Full Time"),
        employee_id=data.get("employee_id"),
        staff_id_photo=data.get("staff_id_photo"),
        national_id=data.get("national_id"),
        profile_image=data.get("profile_image"),
        dob=data.get("dob"),
        gender=data.get("gender"),
        address=data.get("address"),
        emergency_contact_name=data.get("emergency_contact_name"),
        emergency_contact_phone=data.get("emergency_contact_phone"),
    )
    db.session.add(staff)
    db.session.commit()
    return user, staff


def update_user_password(user, data):
    if "password" in data:
        data["password"] = hash_password(data["password"])
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return user


def login_user(data):
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return None
    return user


def login_user_token(token):
    if not token:
        return None
    user = User.query.filter_by(token=token).first()
    return user
