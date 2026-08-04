"""add_password_to_hospitals

Revision ID: a1b2c3d4e5f6
Revises: 8b6cf3616bdc
Create Date: 2026-08-04 17:02:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'a1b2c3d4e5f6'
down_revision = '8b6cf3616bdc'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('hospitals', sa.Column('password', sa.String(length=255), nullable=True))


def downgrade():
    op.drop_column('hospitals', 'password')
