from datetime import datetime
from app import app
from model import Appointment, Doctor, Hospital, Review, User, db, patient

with app.app_context():
    db.session.query(User).delete()
    db.session.query(Doctor).delete()
    db.session.query(patient).delete()
    db.session.query(Appointment).delete()
    db.session.query(Review).delete()
    db.session.query(Hospital).delete()

from datetime import datetime
from app import app
from model import Appointment, Doctor, Hospital, Review, User, db, patient
from auth import hash_password

with app.app_context():
    db.session.query(User).delete()
    db.session.query(Doctor).delete()
    db.session.query(patient).delete()
    db.session.query(Appointment).delete()
    db.session.query(Review).delete()
    db.session.query(Hospital).delete()

    users = [
        User(
            first_name="Alice",
            last_name="Johnson",
            email_address="alice.johnson@gmail.com",
            phone="0700000001",
            password=hash_password("password123"),
        ),
        User(
            first_name="Bob",
            last_name="Smith",
            email_address="bob.smith@gmail.com",
            phone="0700000002",
            password=hash_password("password123"),
        ),
        User(
            first_name="Carol",
            last_name="Williams",
            email_address="carol.williams@gmail.com",
            phone="0700000003",
            password=hash_password("password123"),
        ),
        User(
            first_name="David",
            last_name="Brown",
            email_address="david.brown@gmail.com",
            phone="0700000004",
            password=hash_password("password123"),
        ),
        User(
            first_name="Eva",
            last_name="Jones",
            email_address="eva.jones@gmail.com",
            phone="0700000005",
            password=hash_password("password123"),
        ),
        User(
            first_name="Frank",
            last_name="Garcia",
            email_address="frank.garcia@gmail.com",
            phone="0700000006",
            password=hash_password("password123"),
        ),
        User(
            first_name="Grace",
            last_name="Martinez",
            email_address="grace.martinez@gmail.com",
            phone="0700000007",
            password=hash_password("password123"),
        ),
        User(
            first_name="Henry",
            last_name="Davis",
            email_address="henry.davis@gmail.com",
            phone="0700000008",
            password=hash_password("password123"),
        ),
        User(
            first_name="Irene",
            last_name="Wilson",
            email_address="irene.wilson@gmail.com",
            phone="0700000009",
            password=hash_password("password123"),
        ),
        User(
            first_name="James",
            last_name="Taylor",
            email_address="james.taylor@gmail.com",
            phone="0700000010",
            password=hash_password("password123"),
        ),
        User(
            first_name="Karen",
            last_name="Anderson",
            email_address="karen.anderson@gmail.com",
            phone="0700000011",
            password=hash_password("password123"),
        ),
        User(
            first_name="Leo",
            last_name="Thomas",
            email_address="leo.thomas@gmail.com",
            phone="0700000012",
            password=hash_password("password123"),
        ),
        User(
            first_name="Mia",
            last_name="Jackson",
            email_address="mia.jackson@gmail.com",
            phone="0700000013",
            password=hash_password("password123"),
        ),
        User(
            first_name="Nathan",
            last_name="White",
            email_address="nathan.white@gmail.com",
            phone="0700000014",
            password=hash_password("password123"),
        ),
        User(
            first_name="Olivia",
            last_name="Harris",
            email_address="olivia.harris@gmail.com",
            phone="0700000015",
            password=hash_password("password123"),
        ),
        User(
            first_name="Paul",
            last_name="Martin",
            email_address="paul.martin@gmail.com",
            phone="0700000016",
            password=hash_password("password123"),
        ),
        User(
            first_name="Quinn",
            last_name="Thompson",
            email_address="quinn.thompson@gmail.com",
            phone="0700000017",
            password=hash_password("password123"),
        ),
        User(
            first_name="Rachel",
            last_name="Clark",
            email_address="rachel.clark@gmail.com",
            phone="0700000018",
            password=hash_password("password123"),
        ),
        User(
            first_name="Samuel",
            last_name="Lewis",
            email_address="samuel.lewis@gmail.com",
            phone="0700000019",
            password=hash_password("password123"),
        ),
        User(
            first_name="Tina",
            last_name="Walker",
            email_address="tina.walker@gmail.com",
            phone="0700000020",
            password=hash_password("password123"),
        ),
    ]

    db.session.add_all(users)
    db.session.commit()
    print(f"Seeded {len(users)} users.")

    doctors = [
        Doctor(
            first_name="Dr. John",
            last_name="Doe",
            email_address="dr.john.doe@gmail.com",
            phone="0700000021",
            specialty="Cardiology",
            hospital_id=1,
        ),
        Doctor(
            first_name="Dr. Mary",
            last_name="Adams",
            email_address="dr.mary.adams@gmail.com",
            phone="0700000022",
            specialty="Pediatrics",
            hospital_id=1,
        ),
        Doctor(
            first_name="Dr. Peter",
            last_name="Nguyen",
            email_address="dr.peter.nguyen@gmail.com",
            phone="0700000023",
            specialty="Dermatology",
            hospital_id=2,
        ),
    ]
    db.session.add_all(doctors)
    db.session.commit()
    print(f"Seeded {len(doctors)} doctors.")

    patients = [
        patient(
            first_name="Alice",
            last_name="Johnson",
            email_address="alice.johnson@gmail.com",
            phone="0700000001",
        ),
        patient(
            first_name="Bob",
            last_name="Smith",
            email_address="bob.smith@gmail.com",
            phone="0700000002",
        ),
        patient(
            first_name="Carol",
            last_name="Williams",
            email_address="carol.williams@gmail.com",
            phone="0700000003",
        ),
        patient(
            first_name="David",
            last_name="Brown",
            email_address="david.brown@gmail.com",
            phone="0700000004",
        ),
    ]
    db.session.add_all(patients)
    db.session.commit()
    print(f"Seeded {len(patients)} patients.")

    appointments = [
        Appointment(
            appointment_date=datetime(2026, 7, 29, 10, 0, 0),
            status='scheduled',
            patient_id=1,
            doctor_id=1,
        ),
        Appointment(
            appointment_date=datetime(2026, 7, 29, 14, 0, 0),
            status='scheduled',
            patient_id=3,
            doctor_id=2,
        ),
        Appointment(
            appointment_date=datetime(2026, 7, 30, 9, 0, 0),
            status='cancelled',
            patient_id=5,
            doctor_id=3,
        ),
    ]
    db.session.add_all(appointments)
    db.session.commit()
    print(f"Seeded {len(appointments)} appointments.")

    reviews = [
        Review(
            rating=5,
            comment='Excellent doctor, very professional',
            patient_id=1,
            doctor_id=1,
        ),
        Review(
            rating=4,
            comment='Good service but long waiting time',
            patient_id=2,
            doctor_id=1,
        ),
    ]
    db.session.add_all(reviews)
    db.session.commit()
    print(f"Seeded {len(reviews)} reviews.")

    hospitals = [
        Hospital(
            first_name="Central",
            last_name="Hospital",
            email_address="central.hospital@gmail.com",
            phone="0700000030",
            address="123 Main St, Nairobi CBD",
            city="Nairobi",
        ),
        Hospital(
            first_name="St. Mary",
            last_name="Hospital",
            email_address="stmary.hospital@gmail.com",
            phone="0700000031",
            address="456 Oak Avenue, Westlands",
            city="Nairobi",
        ),
    ]
    db.session.add_all(hospitals)
    db.session.commit()
    print(f"Seeded {len(hospitals)} hospitals.")
