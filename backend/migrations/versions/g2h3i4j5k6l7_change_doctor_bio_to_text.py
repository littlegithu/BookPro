"""Change doctors.bio from String to Text

Revision ID: g2h3i4j5k6l7
Revises: g1h2i3j4k5l6
Create Date: 2026-07-30 20:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'g2h3i4j5k6l7'
down_revision = 'g1h2i3j4k5l6'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.alter_column('bio',
               existing_type=sa.String(length=250),
               type_=sa.Text(),
               existing_nullable=True)


def downgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.alter_column('bio',
               existing_type=sa.Text(),
               type_=sa.String(length=250),
               existing_nullable=True)
