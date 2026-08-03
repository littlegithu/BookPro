from email_service import email_service
from flask import request
from flask_restful import Resource


class EmailNotification(Resource):
    def post(self):
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid request body"}, 400

        required_fields = ['to', 'subject', 'body']
        missing = [f for f in required_fields if f not in data]
        if missing:
            return {"error": f"Missing fields: {', '.join(missing)}"}, 400

        result = email_service.send_email(
            to_email=data['to'],
            subject=data['subject'],
            body=data['body'],
            html_body=data.get('html_body'),
            attachments=data.get('attachments')
        )
        return result, 200 if result.get('success') else 400


class AppointmentEmailNotification(Resource):
    def post(self):
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid request body"}, 400

        notification_type = data.get('type', 'reminder')

        if notification_type == 'reminder':
            result = email_service.send_appointment_reminder(
                patient_email=data['to'],
                patient_name=data['patient_name'],
                doctor_name=data['doctor_name'],
                appointment_time=data['appointment_time']
            )
        elif notification_type == 'confirmation':
            result = email_service.send_appointment_confirmation(
                patient_email=data['to'],
                patient_name=data['patient_name'],
                doctor_name=data['doctor_name'],
                appointment_time=data['appointment_time'],
                date=data['date']
            )
        else:
            return {"error": "Invalid notification type"}, 400

        return result, 200 if result.get('success') else 400


class PrescriptionEmailNotification(Resource):
    def post(self):
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid request body"}, 400

        result = email_service.send_prescription_notification(
            patient_email=data['to'],
            patient_name=data['patient_name'],
            doctor_name=data['doctor_name'],
            medications=data.get('medications', [])
        )
        return result, 200 if result.get('success') else 400