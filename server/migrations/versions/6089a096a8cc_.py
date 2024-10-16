"""empty message

Revision ID: 6089a096a8cc
Revises: 
Create Date: 2024-10-14 11:22:14.462327

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6089a096a8cc'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('students',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=100), nullable=False),
    sa.Column('last_name', sa.String(length=100), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('teachers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('courses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(length=300), nullable=False),
    sa.Column('teacher_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['teacher_id'], ['teachers.id'], name=op.f('fk_courses_teacher_id_teachers')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('assignments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('points_possible', sa.Integer(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('course_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['course_id'], ['courses.id'], name=op.f('fk_assignments_course_id_courses')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('student_courses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('student_id', sa.Integer(), nullable=False),
    sa.Column('course_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['course_id'], ['courses.id'], name=op.f('fk_student_courses_course_id_courses')),
    sa.ForeignKeyConstraint(['student_id'], ['students.id'], name=op.f('fk_student_courses_student_id_students')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('student_assignments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('points_earned', sa.Integer(), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=True),
    sa.Column('student_id', sa.Integer(), nullable=False),
    sa.Column('assignment_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['assignment_id'], ['assignments.id'], name=op.f('fk_student_assignments_assignment_id_assignments')),
    sa.ForeignKeyConstraint(['student_id'], ['students.id'], name=op.f('fk_student_assignments_student_id_students')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('student_assignments')
    op.drop_table('student_courses')
    op.drop_table('assignments')
    op.drop_table('courses')
    op.drop_table('teachers')
    op.drop_table('students')
    # ### end Alembic commands ###
