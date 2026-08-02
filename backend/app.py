import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from extensions import bcrypt, db, migrate
from resources import (
    AppointmentDetail,
    AppointmentList,
    DoctorDetail,
    DoctorList,
    DoctorRegistration,
    DoctorReviews,
    DoctorSearchSuggestions,
    HospitalDetail,
    HospitalList,
    HospitalRegistration,
    PatientDetail,
    PatientList,
    ReviewDetail,
    ReviewList,
    StaffRegistration,
    UserDetail,
    UserList,
    UserLogin,
)

load_dotenv()

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI", "sqlite:///demo.db")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "dev-secret-key")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_COOKIE_SAMESITE"] = os.environ.get("SESSION_COOKIE_SAMESITE", "Lax")
app.config["SESSION_COOKIE_SECURE"] = os.environ.get("SESSION_COOKIE_SECURE", "False").lower() == "true"
app.config["SESSION_COOKIE_HTTPONLY"] = os.environ.get("SESSION_COOKIE_HTTPONLY", "True").lower() == "true"

CORS_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "").split(",")
CORS(app, supports_credentials=True, origins=[origin.strip() for origin in CORS_ORIGINS if origin.strip()])

migrate.init_app(app=app, db=db)
db.init_app(app=app)
bcrypt.init_app(app)

api = Api(app)

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
api.add_resource(HospitalDetail, "/api/hospitals/<int:id>")

api.add_resource(HospitalRegistration, "/api/hospitals/register")
api.add_resource(DoctorRegistration, "/api/doctors/register")
api.add_resource(StaffRegistration, "/api/staff/register")

from admin.dashboard import AdminDashboard
from admin.resources import AdminDoctorList, AdminDoctorDetail

api.add_resource(AdminDashboard, "/api/admin/dashboard")
api.add_resource(AdminDoctorList, "/api/admin/doctors")
api.add_resource(AdminDoctorDetail, "/api/admin/doctors/<int:id>")


if __name__ == "__main__":
    app.run(debug=True)

