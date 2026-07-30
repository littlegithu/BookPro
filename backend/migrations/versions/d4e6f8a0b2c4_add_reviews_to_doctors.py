"""Add reviews column to doctors

Revision ID: d4e6f8a0b2c4
Revises: c9e5h1i4j3k6
Create Date: 2026-07-30 19:22:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd4e6f8a0b2c4'
down_revision = 'c9e5h1i4j3k6'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.add_column(sa.Column('reviews', sa.Integer(), nullable=True))


def downgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.drop_column('reviews')
