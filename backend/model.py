from datetime import datetime

from extensions import db
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import validates


class User(db.Model):
    __tablename__ = "users"

    __table_args__ = (
        CheckConstraint("length(first_name) >= 1", name="ck_user_first_name_length"),
        CheckConstraint("length(last_name) >= 1", name="ck_user_last_name_length"),
        CheckConstraint("email LIKE '%@%'", name="ck_user_email_format"),