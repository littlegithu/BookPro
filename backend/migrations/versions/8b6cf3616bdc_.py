"""empty message

Revision ID: 8b6cf3616bdc
Revises: 6e810c0fff24, add_missing_medical_record_columns, add_room_to_appointments, m9n0o1p2q3r4_add_magic_links_table
Create Date: 2026-08-04 15:20:12.311538

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8b6cf3616bdc'
down_revision = ('6e810c0fff24', 'add_missing_medical_record_columns', 'add_room_to_appointments', 'm9n0o1p2q3r4_add_magic_links_table')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
