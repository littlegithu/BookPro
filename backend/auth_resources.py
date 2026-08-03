from auth import (
    create_magic_link,
    generate_email_verification_token,
    generate_token,
    send_verification_email,
    verify_magic_link,
)
from extensions import db
from flask import request
from flask_restful import Resource
from models import User


class EmailVerification(Resource):
    def get(self):
        token = request.args.get('token')
        if not token:
            return {"error": "Verification token is required"}, 400

        user = User.query.filter_by(email_verification_token=token).first()
        if not user:
            return {"error": "Invalid or expired verification token"}, 400

        if user.email_verified:
            return {"message": "Email already verified"}, 200

        user.email_verified = True
        user.email_verification_token = None
        db.session.commit()

        return {"message": "Email verified successfully. You can now login."}, 200


class ResendVerification(Resource):
    def post(self):
        data = request.get_json(force=True, silent=True) or {}
        email = data.get('email')
        if not email:
            return {"error": "Email is required"}, 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return {"message": "If the email exists, a verification email has been sent"}, 200

        if user.email_verified:
            return {"message": "Email already verified"}, 200

        user.email_verification_token = generate_email_verification_token()
        db.session.commit()

        send_verification_email(user.email, user.email_verification_token)

        return {"message": "If the email exists, a verification email has been sent"}, 200


class MagicLinkLogin(Resource):
    def post(self):
        data = request.get_json(force=True, silent=True) or {}
        email = data.get('email')
        if not email:
            return {"error": "Email is required"}, 400

        user, message = create_magic_link(email)

        return {"message": message}, 200


class MagicLinkVerify(Resource):
    def get(self):
        token = request.args.get('token')
        if not token:
            return {"error": "Token is required"}, 400

        user = verify_magic_link(token)
        if not user:
            return {"error": "Invalid or expired magic link"}, 400

        if not user.token:
            user.token = generate_token()
            db.session.commit()

        return {
            "message": "Login successful",
            "token": user.token,
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "profile_image": user.profile_image,
            }
        }, 200