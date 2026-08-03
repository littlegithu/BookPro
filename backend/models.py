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
    role = db.Column(db.String(20), nullable=True, default='user')
    token = db.Column(db.String(100), nullable=True, unique=True)
    email_verified = db.Column(db.Boolean, default=False, nullable=False)
    email_verification_token = db.Column(db.String(100), nullable=True, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    doctor = db.relationship('Doctor', uselist=False, back_populates='user')
    patient = db.relationship('Patient', back_populates='user', uselist=False)
    staff = db.relationship('Staff', back_populates='user', uselist=False)
    magic_links = db.relationship('MagicLink', back_populates='user', cascade='all, delete-orphan')

    @validates("password")
    def validate_password(self, key, password):
        if password and len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return password


class MagicLink(db.Model):
    __tablename__ = "magic_links"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(100), nullable=False, unique=True)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship('User', back_populates='magic_links')

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
    phone = db.Column(db.String, nullable=True, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='patient', uselist=False)
    appointments = db.relationship('Appointment', back_populates='patient')
    reviews = db.relationship('Review', back_populates='patient')
    medical_records = db.relationship('MedicalRecord', back_populates='patient')
    prescriptions = db.relationship('Prescription', back_populates='patient')


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
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospitals.id'), nullable=True)
    specialties = db.Column(db.String(250), nullable=True)
    profile_image = db.Column(db.String(250), nullable=True)
    languages = db.Column(db.String(200), nullable=True)
    education = db.Column(db.Text, nullable=True)
    certifications = db.Column(db.Text, nullable=True)
    working_days = db.Column(db.String(100), nullable=True)
    consultation_type = db.Column(db.String(50), nullable=True)
    verification_status = db.Column(db.String(50), default='Verified', nullable=False)
    hospital_ids = db.Column(db.String(200), nullable=True)
    accepting_patients = db.Column(db.Boolean, default=True, nullable=False)
    appointment_duration = db.Column(db.Integer, nullable=True, default=30)
    consultation_fee = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='doctor')
    hospital = db.relationship('Hospital', back_populates='doctors')
    appointments = db.relationship('Appointment', back_populates='doctor', lazy=True)
    review_objects = db.relationship('Review', back_populates='doctor', lazy=True)
    prescriptions = db.relationship('Prescription', back_populates='doctor', lazy=True)
    medical_records = db.relationship('MedicalRecord', back_populates='doctor', lazy=True)
    schedules = db.relationship('DoctorSchedule', back_populates='doctor', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', back_populates='doctor', lazy=True, cascade='all, delete-orphan')
    documents = db.relationship('DoctorDocument', back_populates='doctor', lazy=True, cascade='all, delete-orphan')


class Staff(db.Model):
    __tablename__ = "staff"

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_staff_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_staff_last_name_length"),
        CheckConstraint("email LIKE '%@%'", name="ck_staff_email_format"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospitals.id'), nullable=False)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String, nullable=True, unique=True)
    dob = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(300), nullable=True)
    employee_id = db.Column(db.String(50), nullable=True, unique=True)
    role = db.Column(db.String(50), nullable=False, default='Receptionist')
    department = db.Column(db.String(100), nullable=True)
    employment_type = db.Column(db.String(20), nullable=True, default='Full Time')
    staff_id_photo = db.Column(db.String(500), nullable=True)
    national_id = db.Column(db.String(500), nullable=True)
    profile_image = db.Column(db.String(250), nullable=True)
    emergency_contact_name = db.Column(db.String(100), nullable=True)
    emergency_contact_phone = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    user = db.relationship('User', back_populates='staff')
    hospital = db.relationship('Hospital', back_populates='staff')


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
        CheckConstraint("status IN ('Pending', 'Scheduled', 'Completed', 'Cancelled', 'Checked In', 'Called')", name="ck_appointment_status"),
    )

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospitals.id'), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    appointment_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Scheduled')
    notes = db.Column(db.String(500), nullable=True)
    room = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    patient = db.relationship('Patient', back_populates='appointments')
    doctor = db.relationship('Doctor', back_populates='appointments')
    hospital = db.relationship('Hospital', back_populates='appointments')
    reviews = db.relationship('Review', back_populates='appointment', cascade='all, delete-orphan')
    medical_record = db.relationship('MedicalRecord', back_populates='appointment', uselist=False, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', back_populates='related_appointment', cascade='all, delete-orphan')


class MedicalRecord(db.Model):
    __tablename__ = "medical_records"

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False, unique=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    diagnosis = db.Column(db.Text, nullable=True)
    symptoms = db.Column(db.Text, nullable=True)
    prescription = db.Column(db.Text, nullable=True)
    treatment_plan = db.Column(db.Text, nullable=True)
    lab_requests = db.Column(db.Text, nullable=True)
    follow_up_date = db.Column(db.DateTime, nullable=True)
    additional_notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    appointment = db.relationship('Appointment', back_populates='medical_record')
    doctor = db.relationship('Doctor', back_populates='medical_records')
    patient = db.relationship('Patient', back_populates='medical_records')
    prescription_objects = db.relationship('Prescription', back_populates='medical_record', lazy=True, cascade='all, delete-orphan')


class Prescription(db.Model):
    __tablename__ = "prescriptions"

    id = db.Column(db.Integer, primary_key=True)
    medical_record_id = db.Column(db.Integer, db.ForeignKey('medical_records.id'), nullable=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    medicine = db.Column(db.String(200), nullable=False)
    dosage = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.String(100), nullable=False)
    instructions = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    medical_record = db.relationship('MedicalRecord', back_populates='prescription_objects')
    doctor = db.relationship('Doctor', back_populates='prescriptions')
    patient = db.relationship('Patient', back_populates='prescriptions')


class DoctorSchedule(db.Model):
    __tablename__ = "doctor_schedules"

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    day_of_week = db.Column(db.Integer, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    is_break = db.Column(db.Boolean, default=False, nullable=False)
    is_vacation = db.Column(db.Boolean, default=False, nullable=False)
    is_emergency_available = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    doctor = db.relationship('Doctor', back_populates='schedules')


class Notification(db.Model):
    __tablename__ = "notifications"

    __table_args__ = (
        CheckConstraint("type IN ('appointment_booked', 'appointment_cancelled', 'documents_uploaded', 'followup_reminder', 'admin_announcement')", name="ck_notification_type"),
    )

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=True)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    related_appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True)
    related_patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)

    doctor = db.relationship('Doctor', back_populates='notifications')
    related_appointment = db.relationship('Appointment')
    related_patient = db.relationship('Patient')


class DoctorDocument(db.Model):
    __tablename__ = "doctor_documents"

    __table_args__ = (
        CheckConstraint("doc_type IN ('medical_license', 'certificate', 'cv', 'insurance', 'verification', 'other')", name="ck_document_type"),
    )

    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    doc_type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    file_url = db.Column(db.String(500), nullable=False)
    file_name = db.Column(db.String(200), nullable=True)
    verified = db.Column(db.Boolean, default=False, nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.now)

    doctor = db.relationship('Doctor', back_populates='documents')


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
    doctors = db.relationship('Doctor', back_populates='hospital')
    staff = db.relationship('Staff', back_populates='hospital')