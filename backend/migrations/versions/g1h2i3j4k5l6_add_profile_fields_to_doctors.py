"""Add profile fields to doctors

Revision ID: g1h2i3j4k5l6
Revises: f8a9b0c1d2e3
Create Date: 2026-07-30 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'g1h2i3j4k5l6'
down_revision = 'f8a9b0c1d2e3'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.add_column(sa.Column('profile_image', sa.String(length=250), nullable=True))
        batch_op.add_column(sa.Column('languages', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('education', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('certifications', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('working_days', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('consultation_type', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('verification_status', sa.String(length=50), server_default='Verified', nullable=False))
        batch_op.add_column(sa.Column('hospital_ids', sa.String(length=200), nullable=True))


def downgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.drop_column('hospital_ids')
        batch_op.drop_column('verification_status')
        batch_op.drop_column('consultation_type')
        batch_op.drop_column('working_days')
        batch_op.drop_column('certifications')
        batch_op.drop_column('education')
        batch_op.drop_column('languages')
        batch_op.drop_column('profile_image')
