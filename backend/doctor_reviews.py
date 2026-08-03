from flask import request
from flask_restful import Resource

from extensions import db
from model import Doctor, Review
from schema import Reviews_schema


class DoctorReviews(Resource):
    def get(self, doctor_id):
        doctor = Doctor.query.get_or_404(doctor_id)
        reviews = Review.query.filter_by(doctor_id=doctor_id).all()
        return Reviews_schema.dump(reviews)