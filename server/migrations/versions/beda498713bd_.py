"""empty message

Revision ID: beda498713bd
Revises: 89b239a8ad00
Create Date: 2024-10-29 15:43:02.928342

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'beda498713bd'
down_revision = '89b239a8ad00'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('student_courses', schema=None) as batch_op:
        batch_op.create_unique_constraint('_student_course_uc', ['student_id', 'course_id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('student_courses', schema=None) as batch_op:
        batch_op.drop_constraint('_student_course_uc', type_='unique')

    # ### end Alembic commands ###