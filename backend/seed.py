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

    users = [
        User(
            first_name="Alice",
            last_name="Johnson",
            email="alice.johnson@example.com",
            phone="0712345678",
            password=hash_password("password123"),
        ),
        User(
            first_name="Brian",
            last_name="Mwangi",
            email="brian.mwangi@example.com",
            phone="0723456789",
            password=hash_password("password123"),
        ),
        User(
            first_name="Carol",
            last_name="Ndegwa",
            email="carol.ndegwa@example.com",
            phone="0734567890",
            password=hash_password("password123"),
        ),
        User(
            first_name="David",
            last_name="Otieno",
            email="david.otieno@example.com",
            phone="0745678901",
            password=hash_password("password123"),
        ),