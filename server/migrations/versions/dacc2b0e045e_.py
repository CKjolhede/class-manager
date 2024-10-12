"""empty message

Revision ID: dacc2b0e045e
Revises: 
Create Date: 2024-10-12 12:03:09.395382

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dacc2b0e045e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('courses', 
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(100), nullable=False),
                    sa.Column('description', sa.String(100), nullable=False),
                    sa.PrimaryKeyConstraint('id')
                    )

    op.create_table('students',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('first_name', sa.String(100), nullable=False),
                    sa.Column('last_name', sa.String(100), nullable=False),
                    sa.Column('_password_hash', sa.String(), nullable=False),
                    sa.Column('email', sa.String(100), nullable=False),
                    sa.Column('course_id', sa.Integer(), nullable=False),
                    sa.PrimaryKeyConstraint('id'),
                    sa.ForeignKeyConstraint(['course_id'], ['courses.id'])
                    )

    op.create_table('teachers',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(100), nullable=False),
                    sa.Column('email', sa.String(100), nullable=False),
                    sa.Column('course_id', sa.Integer(), nullable=False),
                    sa.PrimaryKeyConstraint('id'),
                    sa.ForeignKeyConstraint(['course_id'], ['courses.id'])
                    )


def downgrade():
    op.drop_table('teachers')
    op.drop_table('students')
    op.drop_table('courses')