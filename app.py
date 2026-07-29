import os

from dotenv import load_dotenv
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api

from extensions import db
from resources import (
    AppointmentDetail,
    AppointmentList,
    DoctorDetail,
    DoctorList,
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

bcrypt = Bcrypt(app=app)

# app config
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["SESSION_COOKIE_SAMESITE"] = os.environ.get("SESSION_COOKIE_SAMESITE")
app.config["SESSION_COOKIE_SECURE"] = os.environ.get("SESSION_COOKIE_SECURE")
app.config["SESSION_COOKIE_HTTPONLY"] = os.environ.get("SESSION_COOKIE_HTTPONLY")

# initialize extensions
migrate = Migrate(app=app, db=db)

CORS_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "").split(",")
CORS(app, supports_credentials=True, origins=[origin.strip() for origin in CORS_ORIGINS if origin.strip()])

db.init_app(app=app)

api = Api(app=app)

# register resources
api.add_resource(UserList, "/users")
api.add_resource(UserDetail, "/users/<int:id>")
api.add_resource(UserLogin, "/users/login")

api.add_resource(PatientList, "/patients")
api.add_resource(PatientDetail, "/patients/<int:id>")

api.add_resource(DoctorList, "/doctors")
api.add_resource(DoctorDetail, "/doctors/<int:id>")

api.add_resource(ReviewList, "/reviews")
api.add_resource(ReviewDetail, "/reviews/<int:id>")

api.add_resource(AppointmentList, "/appointments")
api.add_resource(AppointmentDetail, "/appointments/<int:id>")

api.add_resource(HospitalList, "/hospitals")
api.add_resource(HospitalDetail, "/hospitals/<int:id>")

# initialize api
api.init_app(app)


if __name__ == "__main__":
    app.run(debug=True)