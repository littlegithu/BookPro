"""Replace hospital_id with hospital_name on doctors

Revision ID: a7c3f9e2b1d4
Revises: d5c27a503edc
Create Date: 2026-07-30 16:14:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a7c3f9e2b1d4'
down_revision = 'd5c27a503edc'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hospital_name', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('hospital_location', sa.String(length=200), nullable=True))

    op.execute("""
        UPDATE doctors
        SET hospital_name = hospitals.name,
            hospital_location = hospitals.address
        FROM hospitals
        WHERE doctors.hospital_id = hospitals.id
    """)

    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_doctors_hospital_id_hospitals'), type_='foreignkey')
        batch_op.drop_column('hospital_id')


def downgrade():
    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hospital_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_doctors_hospital_id_hospitals'), 'hospitals', ['hospital_id'], ['id'])

    op.execute("""
        UPDATE doctors
        SET hospital_id = hospitals.id
        FROM hospitals
        WHERE doctors.hospital_name = hospitals.name
    """)

    with op.batch_alter_table('doctors', schema=None) as batch_op:
        batch_op.drop_column('hospital_location')
        batch_op.drop_column('hospital_name')
