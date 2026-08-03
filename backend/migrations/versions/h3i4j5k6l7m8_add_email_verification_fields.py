"""Add email verification fields to users

Revision ID: h3i4j5k6l7m8_add_email_verification_fields
Revises: e4746ebdbdb4
Create Date: 2026-08-03 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'h3i4j5k6l7m8_add_email_verification_fields'
down_revision = 'e4746ebdbdb4'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('email_verified', sa.Boolean(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('email_verification_token', sa.String(length=100), nullable=True))
        batch_op.create_unique_constraint(batch_op.f('uq_users_email_verification_token'), ['email_verification_token'])


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('uq_users_email_verification_token'), type_='unique')
        batch_op.drop_column('email_verification_token')
        batch_op.drop_column('email_verified')