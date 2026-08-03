"""Add room column to appointments table

Revision ID: add_room_to_appointments
Revises: e4746ebdbdb4
Create Date: 2026-08-03 13:55:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_room_to_appointments'
down_revision = 'e4746ebdbdb4'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('appointments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('room', sa.String(length=50), nullable=True))


def downgrade():
    with op.batch_alter_table('appointments', schema=None) as batch_op:
        batch_op.drop_column('room')