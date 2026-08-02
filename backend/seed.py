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
        User(
            first_name="George",
            last_name="Kamau",
            email="george.kamau@example.com",
            phone="0778901234",
            password=hash_password("password123"),
        ),
        User(
            first_name="Hannah",
            last_name="Chebet",
            email="hannah.chebet@example.com",
            phone="0789012345",
            password=hash_password("password123"),
        ),
        User(
            first_name="Ian",
            last_name="Mutua",
            email="ian.mutua@example.com",
            phone="0790123456",
            password=hash_password("password123"),
        ),
        User(
            first_name="Jane",
            last_name="Achieng",
            email="jane.achieng@example.com",
            phone="0701234567",
            password=hash_password("password123"),
        ),
        User(
            first_name="Paul",
            last_name="Ndirangu",
            email="paul.ndirangu@example.com",
            phone="0711000001",
            password=hash_password("password123"),
        ),
        User(
            first_name="Mary",
            last_name="Atieno",
            email="mary.atieno@example.com",
            phone="0711000002",
            password=hash_password("password123"),
        ),
        User(
            first_name="James",
            last_name="Kariuki",
            email="james.kariuki@example.com",
            phone="0711000003",
            password=hash_password("password123"),
        ),
        User(
            first_name="Grace",
            last_name="Muthoni",
            email="grace.muthoni@example.com",
            phone="0711000004",
            password=hash_password("password123"),
        ),
        User(
            first_name="Peter",
            last_name="Ochieng",
            email="peter.ochieng@example.com",
            phone="0711000005",
            password=hash_password("password123"),
        ),
        User(
            first_name="Susan",
            last_name="Wairimu",
            email="susan.wairimu@example.com",
            phone="0711000006",
            password=hash_password("password123"),
        ),
        User(
            first_name="John",
            last_name="Kipkoech",
            email="john.kipkoech@example.com",
            phone="0711000007",
            password=hash_password("password123"),
        ),
        User(
            first_name="rucy",
            last_name="Cherotich",
            email="lucy.cherotich@example.com",
            phone="0711000008",
            password=hash_password("password123"),
        ),
        User(
            first_name="Mark",
            last_name="Sang",
            email="mark.sang@example.com",
            phone="0711000009",
            password=hash_password("password123"),
        ),