"""Add bike models catalog

Revision ID: d826c705a53c
Revises: 53f847ae4366
Create Date: 2026-01-22 12:53:59.037115

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd826c705a53c'
down_revision = '53f847ae4366'
branch_labels = None
depends_on = None


def upgrade():
    # Crear tabla bike_models primero
    op.create_table('bike_models',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('brand', sa.String(length=120), nullable=False),
    sa.Column('model_name', sa.String(length=150), nullable=False),
    sa.Column('model_year', sa.Integer(), nullable=True),
    sa.Column('bike_type', sa.String(length=50), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    
    # Agregar columna a bikes sin foreign key constraint (problema con SQLite)
    with op.batch_alter_table('bikes', schema=None) as batch_op:
        batch_op.add_column(sa.Column('bike_model_id', sa.Integer(), nullable=True))


def downgrade():
    with op.batch_alter_table('bikes', schema=None) as batch_op:
        batch_op.drop_column('bike_model_id')
    
    op.drop_table('bike_models')
