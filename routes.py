from flask import Blueprint, jsonify, request
from model import db, User, patient, Doctor, Review, Appointment, Hospital
from schema import (
    UserSchema,
    PatientSchema,
    DoctorSchema,
    ReviewSchema,
    AppointmentSchema,
    HospitalSchema,
)

bp = Blueprint("routes", __name__)

user_schema = UserSchema()
users_schema = UserSchema(many=True)

patient_schema = PatientSchema()
patients_schema = PatientSchema(many=True)

doctor_schema = DoctorSchema()
doctors_schema = DoctorSchema(many=True)

review_schema = ReviewSchema()
reviews_schema = ReviewSchema(many=True)

appointment_schema = AppointmentSchema()
appointments_schema = AppointmentSchema(many=True)

hospital_schema = HospitalSchema()
hospitals_schema = HospitalSchema(many=True)


def get_json_data():
    if not request.data:
        return jsonify({"error": "Invalid JSON body"}), 400
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON body"}), 400
    if not data:
        return jsonify({"error": "Invalid JSON body"}), 400
    return data


# USERS ROUTES
@bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify(users_schema.dump(users))


@bp.route("/users/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user_schema.dump(user))


@bp.route("/users", methods=["POST"])
def create_user():
    data = get_json_data()
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return jsonify(user_schema.dump(user)), 201


@bp.route("/users/<int:id>", methods=["PUT"])
def update_user(id):
    user = User.query.get_or_404(id)
    data = get_json_data()
    for key, value in data.items():
        setattr(user, key, value)
    db.session.commit()
    return jsonify(user_schema.dump(user))


@bp.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200


# PATIENTS ROUTES
@bp.route("/patients", methods=["GET"])
def get_patients():
    patients = patient.query.all()
    return jsonify(patients_schema.dump(patients))


@bp.route("/patients/<int:id>", methods=["GET"])
def get_patient(id):
    patient_instance = patient.query.get_or_404(id)
    return jsonify(patient_schema.dump(patient_instance))


@bp.route("/patients", methods=["POST"])
def create_patient():
    data = get_json_data()
    patient_instance = patient(**data)
    db.session.add(patient_instance)
    db.session.commit()
    return jsonify(patient_schema.dump(patient_instance)), 201


@bp.route("/patients/<int:id>", methods=["PUT"])
def update_patient(id):
    patient_instance = patient.query.get_or_404(id)
    data = get_json_data()
    for key, value in data.items():
        setattr(patient_instance, key, value)
    db.session.commit()
    return jsonify(patient_schema.dump(patient_instance))


@bp.route("/patients/<int:id>", methods=["DELETE"])
def delete_patient(id):
    patient_instance = patient.query.get_or_404(id)
    db.session.delete(patient_instance)
    db.session.commit()
    return jsonify({"message": "Patient deleted successfully"}), 200


# DOCTORS ROUTES
@bp.route("/doctors", methods=["GET"])
def get_doctors():
    doctors = Doctor.query.all()
    return jsonify(doctors_schema.dump(doctors))


@bp.route("/doctors/<int:id>", methods=["GET"])
def get_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    return jsonify(doctor_schema.dump(doctor))


@bp.route("/doctors", methods=["POST"])
def create_doctor():
    data = get_json_data()
    doctor = Doctor(**data)
    db.session.add(doctor)
    db.session.commit()
    return jsonify(doctor_schema.dump(doctor)), 201


@bp.route("/doctors/<int:id>", methods=["PUT"])
def update_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    data = get_json_data()
    for key, value in data.items():
        setattr(doctor, key, value)
    db.session.commit()
    return jsonify(doctor_schema.dump(doctor))


@bp.route("/doctors/<int:id>", methods=["DELETE"])
def delete_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    db.session.delete(doctor)
    db.session.commit()
    return jsonify({"message": "Doctor deleted successfully"}), 200


# REVIEWS ROUTES
@bp.route("/reviews", methods=["GET"])
def get_reviews():
    reviews = Review.query.all()
    return jsonify(reviews_schema.dump(reviews))


@bp.route("/reviews/<int:id>", methods=["GET"])
def get_review(id):
    review = Review.query.get_or_404(id)
    return jsonify(review_schema.dump(review))


@bp.route("/reviews", methods=["POST"])
def create_review():
    data = get_json_data()
    review = Review(**data)
    db.session.add(review)
    db.session.commit()
    return jsonify(review_schema.dump(review)), 201


@bp.route("/reviews/<int:id>", methods=["PUT"])
def update_review(id):
    review = Review.query.get_or_404(id)
    data = get_json_data()
    for key, value in data.items():
        setattr(review, key, value)
    db.session.commit()
    return jsonify(review_schema.dump(review))


@bp.route("/reviews/<int:id>", methods=["DELETE"])
def delete_review(id):
    review = Review.query.get_or_404(id)
    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted successfully"}), 200


# APPOINTMENTS ROUTES
@bp.route("/appointments", methods=["GET"])
def get_appointments():
    appointments = Appointment.query.all()
    return jsonify(appointments_schema.dump(appointments))


@bp.route("/appointments/<int:id>", methods=["GET"])
def get_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    return jsonify(appointment_schema.dump(appointment))


@bp.route("/appointments", methods=["POST"])
def create_appointment():
    data = get_json_data()
    appointment = Appointment(**data)
    db.session.add(appointment)
    db.session.commit()
    return jsonify(appointment_schema.dump(appointment)), 201


@bp.route("/appointments/<int:id>", methods=["PUT"])
def update_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    data = get_json_data()
    for key, value in data.items():
        setattr(appointment, key, value)
    db.session.commit()
    return jsonify(appointment_schema.dump(appointment))


@bp.route("/appointments/<int:id>", methods=["DELETE"])
def delete_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    db.session.delete(appointment)
    db.session.commit()
    return jsonify({"message": "Appointment deleted successfully"}), 200


# HOSPITALS ROUTES
@bp.route("/hospitals", methods=["GET"])
def get_hospitals():
    hospitals = Hospital.query.all()
    return jsonify(hospitals_schema.dump(hospitals))


@bp.route("/hospitals/<int:id>", methods=["GET"])
def get_hospital(id):
    hospital = Hospital.query.get_or_404(id)
    return jsonify(hospital_schema.dump(hospital))


@bp.route("/hospitals", methods=["POST"])
def create_hospital():
    data = get_json_data()
    hospital = Hospital(**data)
    db.session.add(hospital)
    db.session.commit()
    return jsonify(hospital_schema.dump(hospital)), 201


@bp.route("/hospitals/<int:id>", methods=["PUT"])
def update_hospital(id):
    hospital = Hospital.query.get_or_404(id)
    data = get_json_data()
    for key, value in data.items():
        setattr(hospital, key, value)
    db.session.commit()
    return jsonify(hospital_schema.dump(hospital))


@bp.route("/hospitals/<int:id>", methods=["DELETE"])
def delete_hospital(id):
    hospital = Hospital.query.get_or_404(id)
    db.session.delete(hospital)
    db.session.commit()
    return jsonify({"message": "Hospital deleted successfully"}), 200

