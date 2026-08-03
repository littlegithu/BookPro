from flask import request
from flask_restful import Resource
from sqlalchemy import func

from extensions import db
from models import User, Doctor, Patient, Hospital, Appointment, Review
from .permissions import admin_required


class AdminDashboard(Resource):
    @admin_required
    def get(self):
        total_users = User.query.count()
        total_doctors = Doctor.query.count()
        total_patients = Patient.query.count()
        total_hospitals = Hospital.query.count()
        total_appointments = Appointment.query.count()
        total_reviews = Review.query.count()
        avg_rating = db.session.query(func.avg(Doctor.rating)).scalar() or 0

        today_appointments = Appointment.query.filter(
            func.date(Appointment.appointment_date) == func.current_date()
        ).count()

        return {
            "total_users": total_users,
            "total_doctors": total_doctors,
            "total_patients": total_patients,
            "total_hospitals": total_hospitals,
            "total_appointments": total_appointments,
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 1),
            "today_appointments": today_appointments,
        }