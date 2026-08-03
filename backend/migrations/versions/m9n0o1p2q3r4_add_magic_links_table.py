"""Add magic links table for magic link login

Revision ID: m9n0o1p2q3r4_add_magic_links_table
Revises: h3i4j5k6l7m8_add_email_verification_fields
Create Date: 2026-08-03 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = 'm9n0o1p2q3r4_add_magic_links_table'
down_revision = 'h3i4j5k6l7m8_add_email_verification_fields'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('magic_links',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('token', sa.String(length=100), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('used', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('token')
    )


def downgrade():
    op.drop_table('magic_links')