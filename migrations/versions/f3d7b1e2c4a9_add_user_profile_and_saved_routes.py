"""Add user profile fields and saved routes table

Revision ID: f3d7b1e2c4a9
Revises: b631905b88b5
Create Date: 2026-02-09 01:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f3d7b1e2c4a9"
down_revision = "b631905b88b5"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("user", schema=None) as batch_op:
        batch_op.add_column(sa.Column("name", sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column("location", sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column("avatar", sa.Text(), nullable=True))

    op.create_table(
        "saved_routes",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("route_type", sa.String(length=30), nullable=False),
        sa.Column("terrain", sa.String(length=60), nullable=True),
        sa.Column("distance_km", sa.Float(), nullable=True),
        sa.Column("duration_min", sa.Float(), nullable=True),
        sa.Column("gain_m", sa.Float(), nullable=True),
        sa.Column("preview_coords", sa.JSON(), nullable=True),
        sa.Column("bbox", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_saved_routes_user_id", "saved_routes", ["user_id"], unique=False)


def downgrade():
    op.drop_index("ix_saved_routes_user_id", table_name="saved_routes")
    op.drop_table("saved_routes")

    with op.batch_alter_table("user", schema=None) as batch_op:
        batch_op.drop_column("avatar")
        batch_op.drop_column("location")
        batch_op.drop_column("name")
