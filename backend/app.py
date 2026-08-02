import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from extensions import api, bcrypt, db, migrate
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

