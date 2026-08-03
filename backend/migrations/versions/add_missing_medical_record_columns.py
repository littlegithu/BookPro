"""Add missing columns to medical_records table

Revision ID: add_missing_medical_record_columns
Revises: 7c89dcd24d14
Create Date: 2026-08-03 13:56:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_missing_medical_record_columns'
down_revision = '7c89dcd24d14'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('medical_records', schema=None) as batch_op:
        batch_op.add_column(sa.Column('doctor_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('patient_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('symptoms', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('treatment_plan', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('lab_requests', sa.Text(), nullable=True))


def downgrade():
    with op.batch_alter_table('medical_records', schema=None) as batch_op:
        batch_op.drop_column('lab_requests')
        batch_op.drop_column('treatment_plan')
        batch_op.drop_column('symptoms')
        batch_op.drop_column('patient_id')
        batch_op.drop_column('doctor_id')