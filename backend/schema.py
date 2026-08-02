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
