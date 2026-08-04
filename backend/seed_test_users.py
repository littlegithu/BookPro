from app import app
from auth import generate_token, hash_password
from models import User, Patient, Staff, Doctor, Hospital, db

with app.app_context():
    # Create hospital if not exists
    hospital = Hospital.query.first()
    if not hospital:
        hospital = Hospital(
            name="Nairobi General Hospital",
            address="001 Hospital Hill, Nairobi",
            phone="0201234567",
            email="info@nairobigenhospital.co.ke",
            website="https://nairobigenhospital.co.ke",
        )
        db.session.add(hospital)
        db.session.commit()

    # --- PATIENT USER ---
    patient_user = User.query.filter_by(email="patient@example.com").first()
    if not patient_user:
        patient_user = User(
            first_name="John",
            last_name="Mwangi",
            email="patient@example.com",
            phone="0723456789",
            password=hash_password("patient123"),
            role="user",
            token=generate_token(),
        )
        db.session.add(patient_user)
        db.session.commit()
        patient = Patient(
            user_id=patient_user.id,
            first_name="John",
            last_name="Mwangi",
            email="patient@example.com",
            phone="0723456789",
            dob=None,
            gender="Male",
            address="301 Nairobi, Kenya",
        )
        db.session.add(patient)
        db.session.commit()
        print(f"Created patient user: {patient_user.email} / patient123")
    else:
        print(f"Patient user already exists: {patient_user.email}")

    # --- STAFF USER ---
    staff_email = "staff@example.com"
    staff_user = User.query.filter_by(email=staff_email).first()
    if not staff_user:
        staff_user = User(
            first_name="Jane",
            last_name="Smith",
            email=staff_email,
            phone="0700000022",
            password=hash_password("staff123"),
            role="staff",
            token=generate_token(),
        )
        db.session.add(staff_user)
        db.session.commit()
        staff = Staff(
            user_id=staff_user.id,
            hospital_id=hospital.id,
            first_name="Jane",
            last_name="Smith",
            email=staff_email,
            phone="0700000022",
            role="Receptionist",
            department="Front Office",
            employment_type="Full Time",
            employee_id="EMP001",
        )
        db.session.add(staff)
        db.session.commit()
        print(f"Created staff user: {staff_user.email} / staff123")
    else:
        print(f"Staff user already exists: {staff_user.email}")

    # --- DOCTOR USER ---
    doctor_email = "doctor@example.com"
    doctor_user = User.query.filter_by(email=doctor_email).first()
    if not doctor_user:
        doctor_user = User(
            first_name="Faith",
            last_name="Wanjiku",
            email=doctor_email,
            phone="0767890123",
            password=hash_password("doctor123"),
            role="doctor",
            token=generate_token(),
        )
        db.session.add(doctor_user)
        db.session.commit()
        doctor = Doctor(
            user_id=doctor_user.id,
            first_name="Faith",
            last_name="Wanjiku",
            email=doctor_email,
            specialty="Cardiology",
            profile_image="https://placehold.co/150x150/0F7B6C/FFFFFF?text=FW",
            languages="English, Swahili, French",
            education="MD from University of Nairobi",
            certifications="FCP- Cardiology",
            working_days="Mon-Fri",
            consultation_type="Both",
            verification_status="Verified",
            hospital_ids=str(hospital.id),
            bio="Experienced cardiologist.",
            available=True,
            rating=4.8,
            reviews=0,
            phone="0767890123",
            years_practice=12,
            working_hours="Mon-Fri 8AM-4PM",
            fee=2500,
            duration=30,
            hospital_name=hospital.name,
            hospital_location=hospital.address,
            hospital_phone=hospital.phone,
        )
        db.session.add(doctor)
        db.session.commit()
        print(f"Created doctor user: {doctor_user.email} / doctor123")
    else:
        print(f"Doctor user already exists: {doctor_user.email}")

    print("\nDone! You can now login with:")
    print("Patient:     patient@example.com / patient123")
    print("Staff:       staff@example.com / staff123")
    print("Doctor:      doctor@example.com / doctor123")

    # --- HOSPITAL ADMIN USER ---
    hospital_admin_email = hospital.email  # use hospital email for matching
    hospital_admin_user = User.query.filter_by(email=hospital_admin_email).first()
    if not hospital_admin_user:
        hospital_admin_user = User(
            first_name="Hospital",
            last_name="Admin",
            email=hospital_admin_email,
            phone="0700000033",
            password=hash_password("hospital123"),
            role="hospital_admin",
            token=generate_token(),
        )
        db.session.add(hospital_admin_user)
        db.session.commit()
        print(f"Created hospital admin user: {hospital_admin_user.email} / hospital123")
    else:
        print(f"Hospital admin user already exists: {hospital_admin_user.email}")

    print("\nDone! You can now login with:")
    print("Patient:     patient@example.com / patient123")
    print("Staff:       staff@example.com / staff123")
    print("Doctor:      doctor@example.com / doctor123")
    print(f"Hospital:    {hospital.email} / hospital123  -> login via /staff/login with 'Hospital login' checked")
