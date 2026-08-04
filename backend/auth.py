import secrets
from datetime import datetime, timedelta

from extensions import db
from flask import current_app, request
from flask_bcrypt import check_password_hash, generate_password_hash
from models import Doctor, Hospital, MagicLink, Patient, Staff, User
from sqlalchemy.exc import IntegrityError


def hash_password(password):
    return generate_password_hash(password).decode("utf-8")


def generate_token():
    return secrets.token_hex(32)


def generate_email_verification_token():
    return secrets.token_urlsafe(32)


def send_verification_email(email, verification_token):
    try:
        base_url = request.host_url.rstrip('/') if request else current_app.config.get('APP_URL', 'http://localhost:5000')
    except RuntimeError:
        base_url = current_app.config.get('APP_URL', 'http://localhost:5000')
    
    verification_url = f"{base_url}/verify-email?token={verification_token}"
    current_app.logger.info(f"Verification link generated for {email}: {verification_url}")
    return True


def register_user(data):
    data.pop("password_confirm", None)
    if "password" in data:
        data["password"] = hash_password(data["password"])
    user = User(**data)
    user.role = "user"
    if not user.token:
        user.token = generate_token()
    user.email_verification_token = None  # Not needed since verification is optional
    user.email_verified = True  # Set as verified by default
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Phone or email already exists"}, 409

    send_verification_email(user.email, user.email_verification_token)

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
    user.email_verification_token = None  # Not needed since verification is optional
    user.email_verified = True  # Set as verified by default
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Phone or email already exists"}, 409

    # Skip sending verification email since verification is optional
    # send_verification_email(user.email, user.email_verification_token)

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
    staff_fields = ["hospital_id", "role", "department", "employment_type", "employee_id", 
                    "staff_id_photo", "national_id", "profile_image", "dob", "gender", 
                    "address", "emergency_contact_name", "emergency_contact_phone"]
    
    hospital_id = data.get("hospital_id", 1)
    role = data.get("role", "Receptionist")
    department = data.get("department")
    employment_type = data.get("employment_type", "Full Time")
    employee_id = data.get("employee_id")
    staff_id_photo = data.get("staff_id_photo")
    national_id = data.get("national_id")
    profile_image = data.get("profile_image")
    dob = data.get("dob")
    gender = data.get("gender")
    address = data.get("address")
    emergency_contact_name = data.get("emergency_contact_name")
    emergency_contact_phone = data.get("emergency_contact_phone")
    
    data.pop("password_confirm", None)
    for field in staff_fields:
        data.pop(field, None)
    
    if "password" in data:
        data["password"] = hash_password(data["password"])
    user = User(**data)
    user.role = "staff"
    if not user.token:
        user.token = generate_token()
    user.email_verification_token = None  # Not needed since verification is optional
    user.email_verified = True  # Set as verified by default
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Phone or email already exists"}, 409

    # Skip sending verification email since verification is optional
    # send_verification_email(user.email, user.email_verification_token)

    staff = Staff(
        user_id=user.id,
        hospital_id=hospital_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        role=role,
        department=department,
        employment_type=employment_type,
        employee_id=employee_id,
        staff_id_photo=staff_id_photo,
        national_id=national_id,
        profile_image=profile_image,
        dob=dob,
        gender=gender,
        address=address,
        emergency_contact_name=emergency_contact_name,
        emergency_contact_phone=emergency_contact_phone,
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
        return None, False

    # Email verification is now optional - allow all verified/unverified users to login
    # If verification is required, uncomment the following lines:
    # if user.email_verified is False:
    #     return user, False

    return user, True


def login_user_token(token):
    if not token:
        return None
    user = User.query.filter_by(token=token).first()
    return user


def create_magic_link(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return None, "If an account exists with that email, a magic link has been sent"

    token = secrets.token_urlsafe(32)
    expires_at = datetime.now + timedelta(hours=1)

    MagicLink.query.filter_by(used=False).filter(MagicLink.expires_at < expires_at).delete()

    magic_link = MagicLink(user_id=user.id, token=token, expires_at=expires_at)
    db.session.add(magic_link)
    db.session.commit()

    send_magic_link_email(user.email, token)

    return user, "If an account exists with that email, a magic link has been sent"


def send_magic_link_email(email, token):
    """Magic link email disabled - email API removed"""
    current_app.logger.info(f"Magic link would be sent to {email} with token {token}")
    return True


def verify_magic_link(token):
    if not token:
        return None

    magic_link = MagicLink.query.filter_by(token=token, used=False).first()
    if not magic_link:
        return None

    if magic_link.expires_at < datetime.now:
        db.session.delete(magic_link)
        db.session.commit()
        return None

    magic_link.used = True
    db.session.commit()

    return magic_link.user
