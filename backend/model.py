from datetime import datetime

from extensions import db
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates


class User(db.Model):
    __tablename__ = "users"

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_user_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_user_last_name_length"),
        CheckConstraint("email LIKE '%@%'", name="ck_user_email_format"),
    )

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String, nullable=True, unique=True)
    password = db.Column(db.String, nullable=False)
    profile_image = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    doctor = db.relationship('Doctor', uselist=False, back_populates='user')
    patient = db.relationship('Patient', back_populates='user', uselist=False)

    @validates("password")
    def validate_password(self, key, password):
        if password and len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return password


class Patient(db.Model):
    __tablename__ = "patients"

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_patient_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_patient_last_name_length"),
        CheckConstraint("email LIKE '%@%'", name="ck_patient_email_format"),
    )