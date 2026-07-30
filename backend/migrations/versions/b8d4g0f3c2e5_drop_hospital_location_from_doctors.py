"""Drop hospital_location from doctors

Revision ID: b8d4g0f3c2e5
Revises: a7c3f9e2b1d4
Create Date: 2026-07-30 16:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b8d4g0f3c2e5'
down_revision = 'a7c3f9e2b1d4'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.drop_column('hospital_location')


def downgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hospital_location', sa.String(length=200), nullable=True))
