from marshmallow import Schema, fields, validate


class BaseSchema(Schema):
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    email_address = fields.Email(required=True)
    phone = fields.Str(required=True, validate=validate.Regexp(
        r'^(?:\+254|0)?(7|1)\d{8}$',
        error="Phone must be a valid Kenyan phone number, e.g. 0712345678 or +254712345678"
    ))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class UserSchema(BaseSchema):
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))


class PatientSchema(BaseSchema):
    id = fields.Int(dump_only=True)


class DoctorSchema(BaseSchema):
    id = fields.Int(dump_only=True)
    specialty = fields.Str(required=False)
    hospital_id = fields.Int(required=False, load_only=True)


class ReviewSchema(Schema):
    id = fields.Int(dump_only=True)
    rating = fields.Int(required=True, validate=validate.Range(min=1, max=5))
    comment = fields.Str(required=False)
    patient_id = fields.Int(required=True, load_only=True)
    doctor_id = fields.Int(required=True, load_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class AppointmentSchema(Schema):
    id = fields.Int(dump_only=True)
    appointment_date = fields.DateTime(required=True)
    status = fields.Str(required=False, validate=validate.OneOf(['scheduled', 'completed', 'cancelled']))
    patient_id = fields.Int(required=True, load_only=True)
    doctor_id = fields.Int(required=True, load_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class HospitalSchema(BaseSchema):
    id = fields.Int(dump_only=True)
    address = fields.Str(required=False)
    city = fields.Str(required=False)


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

Hospital_schema = HospitalSchema()
Hospitals_schema = HospitalSchema(many=True)
