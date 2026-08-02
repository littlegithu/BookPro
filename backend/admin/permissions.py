from functools import wraps
from flask import jsonify, request


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authorization token required"}), 401
        token = auth_header.split(' ')[1]
        try:
            from auth import login_user
            from model import User
            user = User.query.filter_by(token=token).first()
            if not user or user.role != 'admin':
                return jsonify({"error": "Admin access required"}), 403
            request.admin_user = user
            return f(*args, **kwargs)
        except Exception:
            return jsonify({"error": "Invalid token"}), 401
    return decorated