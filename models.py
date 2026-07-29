from datetime import datetime

from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_user_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_user_last_name_length"),
        CheckConstraint("email_address LIKE '%@%'", name="ck_user_email_format"),
    )

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    doctor = db.relationship('Doctor', uselist=False, back_populates='user')
    patient = db.relationship('Patient', uselist=False, back_populates='user')

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
        CheckConstraint("email_address LIKE '%@%'", name="ck_patient_email_format"),
    )

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(150), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='patient')
    appointments = db.relationship('Appointment', back_populates='patient')
    reviews = db.relationship('Review', back_populates='patient')


class Doctor(db.Model):
    __tablename__ = "doctors"

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_doctor_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_doctor_last_name_length"),
        CheckConstraint("email_address LIKE '%@%'", name="ck_doctor_email_format"),
    )

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(150), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    specialty = db.Column(db.String(100), nullable=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospitals.id'), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='doctor')
    appointments = db.relationship('Appointment', back_populates='doctor', lazy=True)
    reviews = db.relationship('Review', back_populates='doctor', lazy=True)
    hospital = db.relationship('Hospital', back_populates='doctors')


class Review(db.Model):
    __tablename__ = "reviews"

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="ck_review_rating_range"),
    )

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=True)
    comment = db.Column(db.Text, nullable=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    patient = db.relationship('Patient', back_populates='reviews')
    doctor = db.relationship('Doctor', back_populates='reviews')
    appointment = db.relationship('Appointment', back_populates='reviews')


class Appointment(db.Model):
    __tablename__ = "appointments"

    __table_args__ = (
        CheckConstraint("status IN ('scheduled', 'completed', 'cancelled')", name="ck_appointment_status"),
    )

    id = db.Column(db.Integer, primary_key=True)
    appointment_date = db.Column(db.DateTime(), nullable=True)
    status = db.Column(db.String(20), nullable=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospitals.id'), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    patient = db.relationship('Patient', back_populates='appointments')
    doctor = db.relationship('Doctor', back_populates='appointments')
    hospital = db.relationship('Hospital', back_populates='appointments')
    reviews = db.relationship('Review', back_populates='appointment')


class Hospital(db.Model):
    __tablename__ = "hospitals"

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_hospital_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_hospital_last_name_length"),
        CheckConstraint("email_address LIKE '%@%'", name="ck_hospital_email_format"),
    )

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email_address = db.Column(db.String(150), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False, unique=True)
    address = db.Column(db.String(200), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    updated_at = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)

    appointments = db.relationship('Appointment', back_populates='hospital')
