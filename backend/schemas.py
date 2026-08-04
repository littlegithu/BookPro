from marshmallow import Schema, ValidationError, fields, validate, validates_schema


class BaseSchema(Schema):
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True)
    phone = fields.Str(required=False, allow_none=True, validate=validate.Regexp(
        r'^(?:\+254|0)?(7|1)\d{8}$',
        error="Phone must be a valid Kenyan phone number, e.g. 0712345678 or +254712345678"
    ))
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
    password_confirm = fields.Str(required=True, load_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    @validates_schema
    def validate_password_match(self, data, **kwargs):
        if "password" in data and "password_confirm" in data:
            if data["password"] != data["password_confirm"]:
                raise ValidationError("Passwords do not match", field_name="password_confirm")


class UserSchema(BaseSchema):
    id = fields.Int(dump_only=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
    profile_image = fields.Str(required=False, allow_none=True)
    role = fields.Str(dump_only=True)
    token = fields.Str(load_only=True, allow_none=True)

    doctor = fields.Nested("DoctorSchema", dump_only=True)
    patient = fields.Nested("PatientSchema", dump_only=True)
    staff = fields.Nested("StaffSchema", dump_only=True)
    name = fields.Method("get_name", dump_only=True)

    def get_name(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        return None


class PatientSchema(BaseSchema):
    id = fields.Int(dump_only=True)
    dob = fields.Date(required=False)
    gender = fields.Str(required=False)
    address = fields.Str(required=False)


class DoctorSchema(BaseSchema):
    id = fields.Int(dump_only=True)
    specialty = fields.Str(required=False)
    specialties = fields.Str(required=False, dump_only=True)
    profile_image = fields.Str(required=False, dump_only=True)
    languages = fields.Str(required=False, dump_only=True)
    education = fields.Str(required=False, dump_only=True)
    certifications = fields.Str(required=False, dump_only=True)
    working_days = fields.Str(required=False, dump_only=True)
    consultation_type = fields.Str(required=False, dump_only=True)
    verification_status = fields.Str(required=False, dump_only=True)
    hospital_id = fields.Int(required=False)
    hospital_name = fields.Str(required=False, dump_only=True)
    hospital_location = fields.Str(required=False, dump_only=True)
    hospital_phone = fields.Str(required=False, dump_only=True)
    working_hours = fields.Str(required=False, dump_only=True)
    fee = fields.Int(required=False, dump_only=True)
    duration = fields.Int(required=False, dump_only=True)
    years_practice = fields.Int(required=False, dump_only=True)
    available = fields.Boolean(required=False, dump_only=True)
    rating = fields.Float(required=False, dump_only=True)
    reviews = fields.Int(required=False, dump_only=True)
    accepting_patients = fields.Boolean(required=False)
    appointment_duration = fields.Int(required=False)
    consultation_fee = fields.Int(required=False)
    hospital_ids = fields.Str(required=False)


class HospitalRegistrationSchema(Schema):
    name = fields.Str(required=True)
    address = fields.Str(required=True)
    phone = fields.Str(required=True)
    email = fields.Email(required=True)
    website = fields.Str(required=False, allow_none=True)
    city = fields.Str(required=False)


class DoctorRegistrationSchema(BaseSchema):
    specialty = fields.Str(required=True)
    hospital_id = fields.Int(required=False, allow_none=True)
    years_practice = fields.Int(required=False, load_default=0)
    working_hours = fields.Str(required=False, allow_none=True)
    fee = fields.Int(required=False, allow_none=True)
    duration = fields.Int(required=False, allow_none=True)
    consultation_type = fields.Str(required=False, allow_none=True)
    languages = fields.Str(required=False, allow_none=True)
    education = fields.Str(required=False, allow_none=True)
    certifications = fields.Str(required=False, allow_none=True)
    working_days = fields.Str(required=False, allow_none=True)
    profile_image = fields.Str(required=False, allow_none=True)


class StaffRegistrationSchema(BaseSchema):
    hospital_id = fields.Int(required=True)
    employee_id = fields.Str(required=False, allow_none=True)
    role = fields.Str(required=False, load_default='Receptionist')
    department = fields.Str(required=False, allow_none=True)
    employment_type = fields.Str(required=False, load_default='Full Time')
    staff_id_photo = fields.Str(required=False, allow_none=True)
    national_id = fields.Str(required=False, allow_none=True)
    profile_image = fields.Str(required=False, allow_none=True)
    dob = fields.Date(required=False, allow_none=True)
    gender = fields.Str(required=False, allow_none=True)
    address = fields.Str(required=False, allow_none=True)
    emergency_contact_name = fields.Str(required=False, allow_none=True)
    emergency_contact_phone = fields.Str(required=False, allow_none=True)


class StaffSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str()
    last_name = fields.Str()
    email = fields.Str()
    phone = fields.Str()
    role = fields.Str()
    department = fields.Str()
    employment_type = fields.Str()
    profile_image = fields.Str()
    employee_id = fields.Str()
    dob = fields.Date()
    gender = fields.Str()
    address = fields.Str()
    emergency_contact_name = fields.Str()
    emergency_contact_phone = fields.Str()
    hospital_id = fields.Int()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class StaffDashboardSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(dump_only=True)
    last_name = fields.Str(dump_only=True)
    email = fields.Str(dump_only=True)
    phone = fields.Str(dump_only=True)
    role = fields.Str(dump_only=True)
    department = fields.Str(dump_only=True)
    profile_image = fields.Str(dump_only=True)
    employee_id = fields.Str(dump_only=True)
    hospital_id = fields.Int(dump_only=True)
    today_patients_count = fields.Int(dump_only=True)
    pending_tasks_count = fields.Int(dump_only=True)
    unread_notifications_count = fields.Int(dump_only=True)
    appointments_today = fields.Int(dump_only=True)
    check_ins_today = fields.Int(dump_only=True)
    hospital_name = fields.Str(dump_only=True)


class ReviewSchema(Schema):
    id = fields.Int(dump_only=True)
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    comment = fields.Str(required=False)
    patient_id = fields.Int(required=True, load_only=True)
    doctor_id = fields.Int(required=True, load_only=True)
    appointment_id = fields.Int(required=False, load_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    patient_name = fields.Str(dump_only=True)


class AppointmentSchema(Schema):
    id = fields.Int(dump_only=True)
    appointment_date = fields.DateTime(required=True)
    appointment_time = fields.Str(required=True)
    status = fields.Str(required=False, validate=validate.OneOf(['Pending', 'Scheduled', 'Completed', 'Cancelled', 'Checked In', 'Called']))
    patient_id = fields.Int(required=True)
    doctor_id = fields.Int(required=True)
    hospital_id = fields.Int(required=False)
    notes = fields.Str(required=False)
    room = fields.Str(required=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    doctor = fields.Nested("DoctorSchema", dump_only=True)
    patient = fields.Nested("PatientSchema", dump_only=True)
    hospital = fields.Nested("HospitalSchema", dump_only=True)
    record = fields.Nested("MedicalRecordSchema", dump_only=True, attribute='medical_record')


class MedicalRecordSchema(Schema):
    id = fields.Int(dump_only=True)
    appointment_id = fields.Int(dump_only=True)
    doctor_id = fields.Int(required=False)
    patient_id = fields.Int(required=False)
    diagnosis = fields.Str(required=False)
    symptoms = fields.Str(required=False)
    prescription = fields.Str(required=False)
    treatment_plan = fields.Str(required=False)
    lab_requests = fields.Str(required=False)
    follow_up_date = fields.DateTime(required=False)
    additional_notes = fields.Str(required=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    prescriptions = fields.Nested("PrescriptionSchema", many=True, dump_only=True)


class PrescriptionSchema(Schema):
    id = fields.Int(dump_only=True)
    medical_record_id = fields.Int(required=False, allow_none=True)
    appointment_id = fields.Int(required=False, allow_none=True)
    doctor_id = fields.Int(required=True)
    patient_id = fields.Int(required=True)
    medicine = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    dosage = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    frequency = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    duration = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    instructions = fields.Str(required=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class DoctorDashboardSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(dump_only=True)
    last_name = fields.Str(dump_only=True)
    specialty = fields.Str(dump_only=True)
    profile_image = fields.Str(dump_only=True)
    bio = fields.Str(dump_only=True)
    rating = fields.Float(dump_only=True)
    reviews = fields.Int(dump_only=True)
    today_appointments = fields.Int(dump_only=True)
    upcoming_appointments = fields.Int(dump_only=True)
    completed_appointments = fields.Int(dump_only=True)
    cancelled_appointments = fields.Int(dump_only=True)
    pending_appointments = fields.Int(dump_only=True)
    total_patients = fields.Int(dump_only=True)
    average_rating = fields.Float(dump_only=True)
    monthly_earnings = fields.Int(dump_only=True)


class DoctorScheduleSchema(Schema):
    id = fields.Int(dump_only=True)
    doctor_id = fields.Int(required=True)
    day_of_week = fields.Int(required=True, validate=validate.Range(min=0, max=6))
    start_time = fields.Str(required=True)
    end_time = fields.Str(required=True)
    is_break = fields.Boolean(required=False, load_default=False)
    is_vacation = fields.Boolean(required=False, load_default=False)
    is_emergency_available = fields.Boolean(required=False, load_default=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class NotificationSchema(Schema):
    id = fields.Int(dump_only=True)
    doctor_id = fields.Int(required=True, load_only=True)
    type = fields.Str(required=True, validate=validate.OneOf([
        'appointment_booked', 'appointment_cancelled', 'documents_uploaded',
        'followup_reminder', 'admin_announcement'
    ]))
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    message = fields.Str(required=False)
    is_read = fields.Boolean(dump_only=True)
    related_appointment_id = fields.Int(required=False, allow_none=True)
    related_patient_id = fields.Int(required=False, allow_none=True)
    created_at = fields.DateTime(dump_only=True)


class DoctorDocumentSchema(Schema):
    id = fields.Int(dump_only=True)
    doctor_id = fields.Int(required=True, load_only=True)
    doc_type = fields.Str(required=True, validate=validate.OneOf([
        'medical_license', 'certificate', 'cv', 'insurance', 'verification', 'other'
    ]))
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    file_url = fields.Str(required=False, allow_none=True)
    file_name = fields.Str(required=False, allow_none=True)
    verified = fields.Boolean(dump_only=True)
    uploaded_at = fields.DateTime(dump_only=True)


class HospitalSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    address = fields.Str(required=False)
    location = fields.Method("get_location", dump_only=True)
    city = fields.Str(required=False)
    website = fields.Str(required=False)
    email = fields.Email(required=True)
    phone = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    def get_location(self, obj):
        if obj.address:
            return obj.address
        if obj.city:
            return obj.city
        return ''


user_schema = UserSchema()
users_schema = UserSchema(many=True)

Patient_schema = PatientSchema()
Patients_schema = PatientSchema(many=True)

Doctor_schema = DoctorSchema()
Doctors_schema = DoctorSchema(many=True)

Review_schema = ReviewSchema()
Reviews_schema = ReviewSchema(many=True)

Appointment_schema = AppointmentSchema()
Appointments_schema = AppointmentSchema(many=True)

MedicalRecord_schema = MedicalRecordSchema()
MedicalRecords_schema = MedicalRecordSchema(many=True)

Prescription_schema = PrescriptionSchema()
Prescriptions_schema = PrescriptionSchema(many=True)

DoctorDashboard_schema = DoctorDashboardSchema()

DoctorSchedule_schema = DoctorScheduleSchema()
DoctorSchedules_schema = DoctorScheduleSchema(many=True)

Notification_schema = NotificationSchema()
Notifications_schema = NotificationSchema(many=True)

DoctorDocument_schema = DoctorDocumentSchema()
DoctorDocuments_schema = DoctorDocumentSchema(many=True)

Hospital_schema = HospitalSchema()
Hospitals_schema = HospitalSchema(many=True)

HospitalRegistration_schema = HospitalRegistrationSchema()
DoctorRegistration_schema = DoctorRegistrationSchema()
StaffRegistration_schema = StaffRegistrationSchema()

Staff_schema = StaffSchema()
Staffs_schema = StaffSchema(many=True)
StaffDashboard_schema = StaffDashboardSchema()
