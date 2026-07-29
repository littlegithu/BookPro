from datetime import datetime

from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(150), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_user_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_user_last_name_length"),
        CheckConstraint("email_address LIKE '%@%'", name="ck_user_email_format"),
    )

    @validates("password")
    def validate_password(self, key, password):
        if password and len(password) < 6:
            raise ValueError("Password must be at least 6 characters")
        return password


class Patient(db.Model):
    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(150), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    appointments = db.relationship('Appointment', backref='patient', lazy=True)
    reviews = db.relationship('Review', backref='patient', lazy=True)

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_patient_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_patient_last_name_length"),
        CheckConstraint("email_address LIKE '%@%'", name="ck_patient_email_format"),
    )


class Doctor(db.Model):
    __tablename__ = "doctors"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(150), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    specialty = db.Column(db.String(100), nullable=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    appointments = db.relationship('Appointment', backref='doctor', lazy=True)
    reviews = db.relationship('Review', backref='doctor', lazy=True)
    hospital = db.relationship('Hospital', backref='doctors')

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_doctor_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_doctor_last_name_length"),
        CheckConstraint("email_address LIKE '%@%'", name="ck_doctor_email_format"),
    )


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=True)
    comment = db.Column(db.Text, nullable=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="ck_review_rating_range"),
    )


class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    appointment_date = db.Column(db.DateTime(), nullable=True)
    status = db.Column(db.String(20), nullable=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    __table_args__ = (
        CheckConstraint("status IN ('scheduled', 'completed', 'cancelled')", name="ck_appointment_status"),
    )


class Hospital(db.Model):
    __tablename__ = "hospitals"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(150), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    address = db.Column(db.String(200), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_hospital_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_hospital_last_name_length"),
        CheckConstraint("email_address LIKE '%@%'", name="ck_hospital_email_format"),
    )
