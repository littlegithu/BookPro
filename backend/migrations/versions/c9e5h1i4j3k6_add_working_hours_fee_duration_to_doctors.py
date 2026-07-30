"""Add working_hours, fee, and duration to doctors

Revision ID: c9e5h1i4j3k6
Revises: b8d4g0f3c2e5
Create Date: 2026-07-30 19:05:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c9e5h1i4j3k6'
down_revision = 'b8d4g0f3c2e5'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.add_column(sa.Column('working_hours', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('fee', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('duration', sa.Integer(), nullable=True))


def downgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.drop_column('duration')
        batch_op.drop_column('fee')
        batch_op.drop_column('working_hours')
