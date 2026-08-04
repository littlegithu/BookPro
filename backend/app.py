import os

from dotenv import load_dotenv
from extensions import bcrypt, db, migrate
from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api
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
from werkzeug.exceptions import HTTPException

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
from admin.resources import AdminDoctorDetail, AdminDoctorList
from doctor_resources import (
    DoctorAnalytics,
    DoctorAppointmentDetail,
    DoctorAppointmentList,
    DoctorDashboard,
    DoctorDocuments,
    DoctorHospitals,
    DoctorMedicalRecordDetail,
    DoctorMedicalRecordList,
    DoctorNotificationDetail,
    DoctorNotifications,
    DoctorOwnAvailability,
    DoctorPatientDetail,
    DoctorPatientList,
    DoctorPrescriptionDetail,
    DoctorPrescriptionList,
    DoctorProfile,
    DoctorReviewList,
    DoctorScheduleDetail,
    DoctorScheduleList,
    DoctorTodaySchedule,
)
from mpesa_resources import STKPushResource
from staff_resources import (
    AppointmentManagement,
    DepartmentDirectory,
    PatientCheckIn,
    PatientRegistration,
    PatientSearch,
    QueueAction,
    QueueManagement,
    StaffDashboard,
    StaffLogin,
    StaffNotifications,
    StaffPatientDetail,
    StaffProfile,
    StaffReports,
)
from staff_resources import (
    DoctorAvailability as StaffDoctorAvailability,
)

api.add_resource(AdminDashboard, "/api/admin/dashboard")
api.add_resource(AdminDoctorList, "/api/admin/doctors")
api.add_resource(AdminDoctorDetail, "/api/admin/doctors/<int:id>")

api.add_resource(DoctorDashboard, "/api/doctor/dashboard")
api.add_resource(DoctorTodaySchedule, "/api/doctor/schedule/today")
api.add_resource(DoctorAppointmentList, "/api/doctor/appointments")
api.add_resource(DoctorAppointmentDetail, "/api/doctor/appointments/<int:id>")
api.add_resource(DoctorPatientList, "/api/doctor/patients")
api.add_resource(DoctorPatientDetail, "/api/doctor/patients/<int:id>")
api.add_resource(DoctorMedicalRecordList, "/api/doctor/medical-records")
api.add_resource(DoctorMedicalRecordDetail, "/api/doctor/medical-records/<int:id>")
api.add_resource(DoctorPrescriptionList, "/api/doctor/prescriptions")
api.add_resource(DoctorPrescriptionDetail, "/api/doctor/prescriptions/<int:id>")
api.add_resource(DoctorScheduleList, "/api/doctor/availability/schedule")
api.add_resource(DoctorScheduleDetail, "/api/doctor/availability/schedule/<int:id>")
api.add_resource(DoctorOwnAvailability, "/api/doctor/availability/settings")
api.add_resource(DoctorReviewList, "/api/doctor/reviews")
api.add_resource(DoctorNotifications, "/api/doctor/notifications")
api.add_resource(DoctorNotificationDetail, "/api/doctor/notifications/<int:id>")
api.add_resource(DoctorDocuments, "/api/doctor/documents")
api.add_resource(DoctorProfile, "/api/doctor/profile")
api.add_resource(DoctorAnalytics, "/api/doctor/analytics")
api.add_resource(DoctorHospitals, "/api/doctor/hospitals")

api.add_resource(StaffLogin, "/api/staff/login")
api.add_resource(StaffDashboard, "/api/staff/dashboard")
api.add_resource(PatientCheckIn, "/api/staff/check-in")
api.add_resource(PatientSearch, "/api/staff/patients")
api.add_resource(QueueManagement, "/api/staff/queue")
api.add_resource(QueueAction, "/api/staff/queue/action")
api.add_resource(AppointmentManagement, "/api/staff/appointments")
api.add_resource(StaffDoctorAvailability, "/api/staff/doctors/availability")
api.add_resource(DepartmentDirectory, "/api/staff/departments")
api.add_resource(StaffNotifications, "/api/staff/notifications")
api.add_resource(StaffReports, "/api/staff/reports")
api.add_resource(StaffProfile, "/api/staff/profile")
api.add_resource(PatientRegistration, "/api/staff/patients/register")
api.add_resource(StaffPatientDetail, "/api/staff/patients/<int:id>")

api.add_resource(STKPushResource, "/api/payments/mpesa/stkpush")


@app.errorhandler(HTTPException)
def handle_http_exception(e):
    return jsonify({"error": e.description}), e.code

@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled exception: {e}")
    return jsonify({"error": "An unexpected error occurred. Please try again."}), 500


if __name__ == "__main__":
    app.run(debug=True)