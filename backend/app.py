import os

from dotenv import load_dotenv
from extensions import api, bcrypt, db, migrate
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from resources import (
    AppointmentDetail,
    AppointmentList,
    DoctorDetail,
    DoctorList,
    DoctorReviews,
    DoctorSearchSuggestions,
    HospitalDetail,
    HospitalList,
    PatientDetail,
    PatientList,
    ReviewDetail,
    ReviewList,
    UserDetail,
    UserList,
    UserLogin,
)

# load env vars
load_dotenv()

# create an instance of the flask app
app = Flask(__name__)

# app config
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI", "sqlite:///demo.db")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_COOKIE_SAMESITE"] = os.environ.get("SESSION_COOKIE_SAMESITE", "Lax")
app.config["SESSION_COOKIE_SECURE"] = os.environ.get("SESSION_COOKIE_SECURE", "False").lower() == "true"
app.config["SESSION_COOKIE_HTTPONLY"] = os.environ.get("SESSION_COOKIE_HTTPONLY", "True").lower() == "true"

CORS_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "").split(",")
CORS(app, supports_credentials=True, origins=[origin.strip() for origin in CORS_ORIGINS if origin.strip()])

# initialize extensions
migrate.init_app(app=app, db=db)
db.init_app(app=app)
bcrypt.init_app(app)

# register resources
api.add_resource(UserList, "/api/users")
api.add_resource(UserDetail, "/api/users/<int:id>")
api.add_resource(UserLogin, "/api/users/login")

api.add_resource(PatientList, "/api/patients")
api.add_resource(PatientDetail, "/api/patients/<int:id>")

api.add_resource(DoctorList, "/api/doctors")
api.add_resource(DoctorDetail, "/api/doctors/<int:id>")
api.add_resource(DoctorReviews, "/api/doctors/<int:doctor_id>/reviews")
api.add_resource(DoctorSearchSuggestions, "/api/doctors/search/suggestions")

api.add_resource(ReviewList, "/api/reviews")
api.add_resource(ReviewDetail, "/api/reviews/<int:id>")

api.add_resource(AppointmentList, "/api/appointments")
api.add_resource(AppointmentDetail, "/api/appointments/<int:id>")

api.add_resource(HospitalList, "/api/hospitals")

