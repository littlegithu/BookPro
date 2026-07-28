from dotenv import load_dotenv
from flask import Flask
from flask_restful import Api

from extensions import api, bcrypt, db, migrate
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

# app config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///demo.db"

# initialize extensions
migrate.init_app(app=app, db=db)
db.init_app(app=app)
bcrypt.init_app(app)

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