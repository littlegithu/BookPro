import secrets

from flask import jsonify, request, current_app
from flask_bcrypt import check_password_hash, generate_password_hash
from model import Patient, User, Doctor, Hospital, Staff
from extensions import db
from sqlalchemy.exc import IntegrityError


def hash_password(password):
    return generate_password_hash(password).decode("utf-8")


def generate_token():
    return secrets.token_hex(32)


def generate_email_verification_token():
    return secrets.token_urlsafe(32)


def send_verification_email(email, verification_token):
    try:
        from email_service import email_service
        verification_url = f"{request.host_url}api/auth/verify-email?token={verification_token}"
        subject = "Verify your email - BookPro"
        body = f"""Dear BookPro User,

Please verify your email address by clicking the link below:
{verification_url}

If you didn't register for BookPro, please ignore this email.

Thank you,
BookPro Team
"""
        result = email_service.send_email(
            to_email=email,
            subject=subject,
            body=body
        )
        return result.get("success", False)
    except Exception as e:
        current_app.logger.error(f"Failed to send verification email: {e}")
        return False


def register_user(data):
    data.pop("password_confirm", None)
    if "password" in data:
        data["password"] = hash_password(data["password"])
    user = User(**data)
    if not user.token:
        user.token = generate_token()
    user.email_verification_token = generate_email_verification_token()
    user.email_verified = False
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
    user.email_verification_token = generate_email_verification_token()
    user.email_verified = False
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Phone or email already exists"}, 409

    send_verification_email(user.email, user.email_verification_token)

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
    user.email_verification_token = generate_email_verification_token()
    user.email_verified = False
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"error": "Phone or email already exists"}, 409

    send_verification_email(user.email, user.email_verification_token)

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
        return None, False

    if user.email_verified is False:
        return user, False

    return user, True


def login_user_token(token):
    if not token:
        return None
    user = User.query.filter_by(token=token).first()
    return user


def create_magic_link(email):
    from model import MagicLink

    user = User.query.filter_by(email=email).first()
    if not user:
        return None, "If an account exists with that email, a magic link has been sent"

    token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(hours=1)

    MagicLink.query.filter_by(used=False).filter(MagicLink.expires_at < expires_at).delete()

    magic_link = MagicLink(user_id=user.id, token=token, expires_at=expires_at)
    db.session.add(magic_link)
    db.session.commit()

    send_magic_link_email(user.email, token)

    return user, "If an account exists with that email, a magic link has been sent"


def send_magic_link_email(email, token):
    try:
        from email_service import email_service
        login_url = f"{request.host_url}magic-link?token={token}"
        subject = "Your Magic Login Link - BookPro"
        body = f"""
Dear BookPro User,

Click the link below to log in to your account:
{login_url}

This link will expire in 1 hour.

If you didn't request this login, you can ignore this email.

Thank you,
BookPro Team
"""
        result = email_service.send_email(
            to_email=email,
            subject=subject,
            body=body
        )
        return result.get("success", False)
    except Exception as e:
        current_app.logger.error(f"Failed to send magic link email: {e}")
        return False


def verify_magic_link(token):
    if not token:
        return None

    magic_link = MagicLink.query.filter_by(token=token, used=False).first()
    if not magic_link:
        return None

    if magic_link.expires_at < datetime.now():
        db.session.delete(magic_link)
        db.session.commit()
        return None

    magic_link.used = True
    db.session.commit()

    return magic_link.user
