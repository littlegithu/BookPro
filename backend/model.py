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
        CheckConstraint("email LIKE '%@%'", name="ck_patient_email_format"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    dob = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(200), nullable=True)
    phone = db.Column(db.String, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='patient')
    appointments = db.relationship('Appointment', back_populates='patient')
    reviews = db.relationship('Review', back_populates='patient')


class Doctor(db.Model):
    __tablename__ = "doctors"

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_doctor_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_doctor_last_name_length"),
        CheckConstraint("email LIKE '%@%'", name="ck_doctor_email_format"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    specialty = db.Column(db.String(50), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    available = db.Column(db.Boolean, default=True, nullable=False)
    rating = db.Column(db.Float, nullable=True)
    reviews = db.Column(db.Integer, nullable=True)
    phone = db.Column(db.String(10), nullable=False, unique=True)
    years_practice = db.Column(db.Integer, nullable=False, default=0)
    working_hours = db.Column(db.String(100), nullable=True)
    fee = db.Column(db.Integer, nullable=True)
    duration = db.Column(db.Integer, nullable=True)
    hospital_name = db.Column(db.String(100), nullable=True)
    hospital_location = db.Column(db.String(200), nullable=True)
    hospital_phone = db.Column(db.String(20), nullable=True)
    specialties = db.Column(db.String(250), nullable=True)
    profile_image = db.Column(db.String(250), nullable=True)
    languages = db.Column(db.String(200), nullable=True)
    education = db.Column(db.Text, nullable=True)
    certifications = db.Column(db.Text, nullable=True)
    working_days = db.Column(db.String(100), nullable=True)
    consultation_type = db.Column(db.String(50), nullable=True)
    verification_status = db.Column(db.String(50), default='Verified', nullable=False)
    hospital_ids = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='doctor')
    appointments = db.relationship('Appointment', back_populates='doctor', lazy=True)
    review_objects = db.relationship('Review', back_populates='doctor', lazy=True)


class Review(db.Model):
    __tablename__ = "reviews"

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="ck_review_rating_range"),
    )

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    patient = db.relationship('Patient', back_populates='reviews')
    doctor = db.relationship('Doctor', back_populates='review_objects')
    appointment = db.relationship('Appointment', back_populates='reviews')

    @property
    def patient_name(self):
        if self.patient:
            return f"{self.patient.first_name} {self.patient.last_name}"
        return None


class Appointment(db.Model):
    __tablename__ = "appointments"

    __table_args__ = (
        CheckConstraint("status IN ('Scheduled', 'Completed', 'Cancelled')", name="ck_appointment_status"),
    )

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospitals.id'), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    appointment_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Scheduled')
    notes = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    patient = db.relationship('Patient', back_populates='appointments')
    doctor = db.relationship('Doctor', back_populates='appointments')
    hospital = db.relationship('Hospital', back_populates='appointments')
    reviews = db.relationship('Review', back_populates='appointment')


class Hospital(db.Model):
    __tablename__ = "hospitals"

    __table_args__ = (
        CheckConstraint("length(name) >= 1", name="ck_hospital_first_name_length"),
        CheckConstraint("email LIKE '%@%'", name="ck_hospital_email_format"),
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    website = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    appointments = db.relationship('Appointment', back_populates='hospital')
