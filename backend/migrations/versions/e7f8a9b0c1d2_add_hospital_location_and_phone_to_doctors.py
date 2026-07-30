"""Add hospital_location and hospital_phone to doctors

Revision ID: e7f8a9b0c1d2
Revises: d4e6f8a0b2c4
Create Date: 2026-07-30 19:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e7f8a9b0c1d2'
down_revision = 'd4e6f8a0b2c4'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hospital_location', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('hospital_phone', sa.String(length=20), nullable=True))


def downgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.drop_column('hospital_phone')
        batch_op.drop_column('hospital_location')
