from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Int(dump_only=True) #output only
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email_address = fields.Email(required=True)
    phone = fields.Str(required=True)
   # password = fields.Str(required=True, load_only=True) #input only
    created_at = fields.DateTime(dump_only=True)
    #updated_at = fields.DateTime(dump_only=True)


class PatientSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email_address = fields.Email(required=True)
    phone = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class DoctorSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email_address = fields.Email(required=True)
    phone = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class ReviewSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email_address = fields.Email(required=True)
    phone = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class AppointmentSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email_address = fields.Email(required=True)
    phone = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class HospitalSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    email_address = fields.Email(required=True)
    phone = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


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
