import os

import requests


class EmailService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True

        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', 587))
        self.smtp_username = os.environ.get('SMTP_USERNAME', '')
        self.smtp_password = os.environ.get('SMTP_PASSWORD', '')
        self.default_sender = os.environ.get('EMAIL_SENDER', 'noreply@bookpro.com')
        self.api_key = os.environ.get('EMAIL_API_KEY')

    def send_email(self, to_email, subject, body, html_body=None, attachments=None):
        if not self.api_key:
            return {"success": False, "error": "Email API key not configured. Set EMAIL_API_KEY environment variable."}

        try:
            html_content = html_body if html_body else body
            data = {
                "sender": {"email": self.default_sender, "name": "BookPro"},
                "to": [{"email": to_email}],
                "subject": subject,
                "text": body,
                "html": html_content
            }

            response = requests.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={
                    "api-key": self.api_key,
                    "content-type": "application/json"
                },
                json=data
            )

            if response.status_code < 200 or response.status_code >= 300:
                try:
                    error_data = response.json()
                    return {
                        "success": False,
                        "error": error_data.get("message", response.text),
                        "code": error_data.get("code", "unknown_error"),
                        "status_code": response.status_code
                    }
                except ValueError:
                    return {"success": False, "error": response.text, "status_code": response.status_code}

            return {"success": True, "message": response.json()}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def send_appointment_reminder(self, patient_email, patient_name, doctor_name, appointment_time):
        subject = "Appointment Reminder - BookPro"
        body = f"""
Dear {patient_name},

This is a reminder of your upcoming appointment with {doctor_name} scheduled for {appointment_time}.

Please arrive 15 minutes early. If you need to reschedule, please contact us.

Thank you,
BookPro Team
"""
        html_body = self._generate_appointment_reminder_html(patient_name, doctor_name, appointment_time)
        return self.send_email(patient_email, subject, body, html_body)

    def send_appointment_confirmation(self, patient_email, patient_name, doctor_name, appointment_time, date):
        subject = "Appointment Confirmed - BookPro"
        body = f"""
Dear {patient_name},

Your appointment has been confirmed:

Doctor: {doctor_name}
Date: {date}
Time: {appointment_time}

Please arrive 15 minutes early for check-in.

Thank you,
BookPro Team
"""
        html_body = self._generate_confirmation_html(patient_name, doctor_name, appointment_time, date)
        return self.send_email(patient_email, subject, body, html_body)

    def send_prescription_notification(self, patient_email, patient_name, doctor_name, medications):
        subject = "Prescription Ready - BookPro"
        meds_str = '\n'.join([f'- {med}' for med in medications])
        body = f"""
Dear {patient_name},

Your prescription has been ready for pickup:

Dr: {doctor_name}
Medications:
{meds_str}

Please collect from the pharmacy within 24 hours.

Thank you,
BookPro Pharmacy
"""
        html_body = self._generate_prescription_html(patient_name, doctor_name, medications)
        return self.send_email(patient_email, subject, body, html_body)

    def _generate_appointment_reminder_html(self, patient_name, doctor_name, appointment_time):
        return f"""
<!DOCTYPE html>
<html>
<head><title>Appointment Reminder</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: #5CD6C4;">Appointment Reminder</h2>
        <p>Dear {patient_name},</p>
        <p>This is a reminder of your upcoming appointment:</p>
        <ul>
            <li><strong>Doctor:</strong> {doctor_name}</li>
            <li><strong>Time:</strong> {appointment_time}</li>
        </ul>
        <p style="background: #fff3cd; padding: 10px; border-radius: 4px;">
            ⚠ Please arrive 15 minutes early for check-in.
        </p>
        <p>Thank you,<br>BookPro Team</p>
    </div>
</body>
</html>
"""

    def _generate_confirmation_html(self, patient_name, doctor_name, appointment_time, date):
        return f"""
<!DOCTYPE html>
<html>
<head><title>Appointment Confirmed</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #e8f5e9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #28a745;">Appointment Confirmed</h2>
        <p>Dear {patient_name},</p>
        <p>Your appointment details:</p>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Doctor:</strong></td><td>{doctor_name}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date:</strong></td><td>{date}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Time:</strong></td><td>{appointment_time}</td></tr>
        </table>
        <p>Please arrive 15 minutes early for check-in.</p>
        <p>Thank you,<br>BookPro Team</p>
    </div>
</body>
</html>
"""

    def _generate_prescription_html(self, patient_name, doctor_name, medications):
        meds_html = ''.join([f'<li>{med}</li>' for med in medications])
        return f"""
<!DOCTYPE html>
<html>
<head><title>Prescription Ready</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #1976d2;">Prescription Ready for Pickup</h2>
        <p>Dear {patient_name},</p>
        <p>Your prescription is ready from Dr. {doctor_name}:</p>
        <ul>{meds_html}</ul>
        <p style="background: #fff3cd; padding: 10px; border-radius: 4px;">
            ⚠ Please collect within 24 hours.
        </p>
        <p>Thank you,<br>BookPro Pharmacy</p>
    </div>
</body>
</html>
"""


email_service = EmailService()