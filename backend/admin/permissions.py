from functools import wraps
from flask import request


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return {"error": "Authorization token required"}, 401
        token = auth_header.split(' ')[1]
        from auth import login_user_token
        user = login_user_token(token)
        if not user or user.role != 'admin':
            return {"error": "Admin access required"}, 403
        request.admin_user = user
        return f(*args, **kwargs)
    return decorated


def doctor_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return {"error": "Authorization token required"}, 401
        token = auth_header.split(' ')[1]
        from auth import login_user_token
        user = login_user_token(token)
        if not user:
            return {"error": "Invalid or expired token"}, 401
        if user.role != 'doctor':
            return {"error": "Doctor access required"}, 403
        if not user.doctor:
            return {"error": "Doctor profile not found"}, 404
        request.doctor_user = user
        request.doctor = user.doctor
        return f(*args, **kwargs)
    return decorated


def staff_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return {"error": "Authorization token required"}, 401
        token = auth_header.split(' ')[1]
        from auth import login_user_token
        user = login_user_token(token)
        if not user:
            return {"error": "Invalid or expired token"}, 401
        if user.role != 'staff':
            return {"error": "Staff access required"}, 403
        if not user.staff:
            return {"error": "Staff profile not found"}, 404
        request.staff_user = user
        request.staff = user.staff
        return f(*args, **kwargs)
    return decorated


def admin_or_hospital_admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return {"error": "Authorization token required"}, 401
        token = auth_header.split(' ')[1]
        from auth import login_user_token
        user = login_user_token(token)
        if not user:
            return {"error": "Invalid or expired token"}, 401
        if user.role not in ('admin', 'hospital_admin'):
            return {"error": "Admin or Hospital Admin access required"}, 403
        request.admin_user = user
        return f(*args, **kwargs)
    return decorated
