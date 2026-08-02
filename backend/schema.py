from marshmallow import Schema, fields, validate


class BaseSchema(Schema):
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email = fields.Email(required=True)
    phone = fields.Str(required=False, allow_none=True, validate=validate.Regexp(
        r'^(?:\+254|0)?(7|1)\d{8}$',
        error="Phone must be a valid Kenyan phone number, e.g. 0712345678 or +254712345678"
    ))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class UserSchema(BaseSchema):
    id = fields.Int(dump_only=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))
    profile_image = fields.Str(required=False, allow_none=True)
    role = fields.Str(dump_only=True)
    token = fields.Str(load_only=True, allow_none=True)

    doctor = fields.Nested("DoctorSchema", dump_only=True)
    patient = fields.Nested("PatientSchema", dump_only=True)


class PatientSchema(BaseSchema):
    id = fields.Int(dump_only=True)
    dob = fields.Date(required=False)
    gender = fields.Str(required=False)
    address = fields.Str(required=False)


class DoctorSchema(BaseSchema):
    id = fields.Int(dump_only=True)
    specialty = fields.Str(required=True)
    specialties = fields.Str(required=False, dump_only=True)
    profile_image = fields.Str(required=False, dump_only=True)
    languages = fields.Str(required=False, dump_only=True)
    education = fields.Str(required=False, dump_only=True)
    certifications = fields.Str(required=False, dump_only=True)
    working_days = fields.Str(required=False, dump_only=True)
    consultation_type = fields.Str(required=False, dump_only=True)
    verification_status = fields.Str(required=False, dump_only=True)
    hospital_ids = fields.Str(required=False, dump_only=True)
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
    status = fields.Str(required=False, validate=validate.OneOf(['Scheduled', 'Completed', 'Cancelled']))
    patient_id = fields.Int(required=True)
    doctor_id = fields.Int(required=True)
    hospital_id = fields.Int(required=False)
    notes = fields.Str(required=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    doctor = fields.Nested("DoctorSchema", dump_only=True)
    record = fields.Nested("MedicalRecordSchema", dump_only=True, attribute='medical_record')


class MedicalRecordSchema(Schema):
    id = fields.Int(dump_only=True)
    appointment_id = fields.Int(dump_only=True)
    diagnosis = fields.Str(required=False)
    prescription = fields.Str(required=False)
    follow_up_date = fields.DateTime(dump_only=True)
    additional_notes = fields.Str(required=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class HospitalSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    address = fields.Str(required=False)
    city = fields.Str(required=False)
    website = fields.Str(required=False)
    email = fields.Email(required=True)
    phone = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


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

Hospital_schema = HospitalSchema()
Hospitals_schema = HospitalSchema(many=True)
