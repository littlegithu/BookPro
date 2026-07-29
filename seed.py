from datetime import date, datetime, time

from app import app
from auth import hash_password
from models import Appointment, Doctor, Hospital, Patient, Review, User, db

with app.app_context():
    db.session.query(Review).delete()
    db.session.query(Appointment).delete()
    db.session.query(Doctor).delete()
    db.session.query(Patient).delete()
    db.session.query(Hospital).delete()
    db.session.query(User).delete()
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
            first_name="Eva",
            last_name="Kipchoge",
            email="eva.kipchoge@example.com",
            phone="0756789012",
            password=hash_password("password123"),
        ),
        User(
            first_name="Faith",
            last_name="Wanjiku",
            email="faith.wanjiku@example.com",
            phone="0767890123",
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
    ]
    db.session.add_all(users)
    db.session.commit()
    print(f"Seeded {len(users)} users.")

    patients = [
        Patient(
            user_id=users[0].id,
            first_name="Alice",
            last_name="Johnson",
            email="alice.johnson@example.com",
            dob=date(1992, 4, 15),
            gender="Female",
            address="14 Kijabe Street, Nairobi",
            phone="0712345678",
        ),
        Patient(
            user_id=users[1].id,
            first_name="Brian",
            last_name="Mwangi",
            email="brian.mwangi@example.com",
            dob=date(1988, 11, 2),
            gender="Male",
            address="22 Mombasa Road, Nairobi",
            phone="0723456789",
        ),
        Patient(
            user_id=users[2].id,
            first_name="Carol",
            last_name="Ndegwa",
            email="carol.ndegwa@example.com",
            dob=date(1995, 7, 21),
            gender="Female",
            address="9 Kiambu Lane, Kiambu",
            phone="0734567890",
        ),
        Patient(
            user_id=users[3].id,
            first_name="David",
            last_name="Otieno",
            email="david.otieno@example.com",
            dob=date(1985, 1, 30),
            gender="Male",
            address="5 Kisumu Avenue, Kisumu",
            phone="0745678901",
        ),
        Patient(
            user_id=users[4].id,
            first_name="Eva",
            last_name="Kipchoge",
            email="eva.kipchoge@example.com",
            dob=date(2000, 9, 10),
            gender="Female",
            address="31 Eldoret Road, Eldoret",
            phone="0756789012",
        ),
    ]
    db.session.add_all(patients)
    db.session.commit()
    print(f"Seeded {len(patients)} patients.")

    doctors = [
        Doctor(
            user_id=users[5].id,
            first_name="Faith",
            last_name="Wanjiku",
            email="faith.wanjiku@example.com",
            specialty="Cardiology",
            bio="Experienced cardiologist with over 10 years in clinical practice.",
            available=True,
            rating=4.8,
            phone="0767890123",
            years_practice=12,
        ),
        Doctor(
            user_id=users[6].id,
            first_name="George",
            last_name="Kamau",
            email="george.kamau@example.com",
            specialty="Pediatrics",
            bio="Dedicated pediatrician passionate about child wellness.",
            available=True,
            rating=4.5,
            phone="0778901234",
            years_practice=8,
        ),
        Doctor(
            user_id=users[7].id,
            first_name="Hannah",
            last_name="Chebet",
            email="hannah.chebet@example.com",
            specialty="Dermatology",
            bio="Board-certified dermatologist specializing in skin care.",
            available=False,
            rating=4.6,
            phone="0789012345",
            years_practice=6,
        ),
    ]
    db.session.add_all(doctors)
    db.session.commit()
    print(f"Seeded {len(doctors)} doctors.")

    hospitals = [
        Hospital(
            name="Nairobi General Hospital",
            address="001 Hospital Hill, Nairobi",
            phone="0201234567",
            email="info@nairobigenhospital.co.ke",
            website="https://nairobigenhospital.co.ke",
        ),
        Hospital(
            name="Mombasa Medical Centre",
            address="78 Nyali Bridge Road, Mombasa",
            phone="0412345678",
            email="info@mombasamedical.co.ke",
            website="https://mombasamedical.co.ke",
        ),
        Hospital(
            name="Kisumu County Referral",
            address="12 Lake Basin Road, Kisumu",
            phone="0571234567",
            email="info@kisumuhospital.co.ke",
            website="https://kisumuhospital.co.ke",
        ),
    ]
    db.session.add_all(hospitals)
    db.session.commit()
    print(f"Seeded {len(hospitals)} hospitals.")

    appointments = [
        Appointment(
            patient_id=patients[0].id,
            doctor_id=doctors[0].id,
            hospital_id=hospitals[0].id,
            appointment_date=datetime(2026, 7, 29, 10, 0, 0),
            appointment_time=time(10, 0),
            status="Scheduled",
            notes="Follow-up visit for hypertension check.",
        ),
        Appointment(
            patient_id=patients[1].id,
            doctor_id=doctors[1].id,
            hospital_id=hospitals[0].id,
            appointment_date=datetime(2026, 7, 30, 9, 0, 0),
            appointment_time=time(9, 0),
            status="Scheduled",
            notes="Child vaccination appointment.",
        ),
        Appointment(
            patient_id=patients[2].id,
            doctor_id=doctors[2].id,
            hospital_id=hospitals[1].id,
            appointment_date=datetime(2026, 7, 29, 14, 0, 0),
            appointment_time=time(14, 0),
            status="Scheduled",
            notes="Skin rash consultation.",
        ),
        Appointment(
            patient_id=patients[3].id,
            doctor_id=doctors[0].id,
            hospital_id=hospitals[2].id,
            appointment_date=datetime(2026, 7, 28, 11, 0, 0),
            appointment_time=time(11, 0),
            status="Completed",
            notes="Routine cardiac screening.",
        ),
        Appointment(
            patient_id=patients[4].id,
            doctor_id=doctors[1].id,
            hospital_id=hospitals[1].id,
            appointment_date=datetime(2026, 7, 31, 8, 30, 0),
            appointment_time=time(8, 30),
            status="Cancelled",
            notes="Annual pediatric check-up.",
        ),
    ]
    db.session.add_all(appointments)
    db.session.commit()
    print(f"Seeded {len(appointments)} appointments.")

    reviews = [
        Review(
            appointment_id=appointments[0].id,
            patient_id=patients[0].id,
            doctor_id=doctors[0].id,
            rating=5,
            comment="Dr. Wanjiku was thorough and very attentive during my check-up.",
        ),
        Review(
            appointment_id=appointments[1].id,
            patient_id=patients[1].id,
            doctor_id=doctors[1].id,
            rating=4,
            comment="Good service but the waiting time was longer than expected.",
        ),
        Review(
            appointment_id=appointments[2].id,
            patient_id=patients[2].id,
            doctor_id=doctors[2].id,
            rating=5,
            comment="Excellent diagnosis and treatment plan for my skin condition.",
        ),
        Review(
            appointment_id=appointments[3].id,
            patient_id=patients[3].id,
            doctor_id=doctors[0].id,
            rating=4,
            comment="The cardiac screening was well explained and professional.",
        ),
    ]
    db.session.add_all(reviews)
    db.session.commit()
    print(f"Seeded {len(reviews)} reviews.")
