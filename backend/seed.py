from datetime import date, datetime, time

from app import app
from auth import hash_password
from model import Appointment, Doctor, Hospital, Patient, Review, User, db
from sqlalchemy import text

with app.app_context():
    db.session.query(Review).delete()
    db.session.query(Appointment).delete()
    db.session.query(Doctor).delete()
    db.session.query(Patient).delete()
    db.session.query(Hospital).delete()
    db.session.query(User).delete()
    db.session.commit()

    db.session.execute(text("ALTER SEQUENCE users_id_seq RESTART WITH 1"))
    db.session.execute(text("ALTER SEQUENCE patients_id_seq RESTART WITH 1"))
    db.session.execute(text("ALTER SEQUENCE doctors_id_seq RESTART WITH 1"))
    db.session.execute(text("ALTER SEQUENCE hospitals_id_seq RESTART WITH 1"))
    db.session.execute(text("ALTER SEQUENCE appointments_id_seq RESTART WITH 1"))
    db.session.execute(text("ALTER SEQUENCE reviews_id_seq RESTART WITH 1"))
    db.session.commit()