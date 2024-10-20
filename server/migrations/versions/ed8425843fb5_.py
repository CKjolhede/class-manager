"""empty message

Revision ID: ed8425843fb5
Revises: 6089a096a8cc
Create Date: 2024-10-14 11:23:28.675007

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ed8425843fb5'
down_revision = '6089a096a8cc'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('student_assignments', schema=None) as batch_op:
        batch_op.drop_column('completed')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('student_assignments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('completed', sa.BOOLEAN(), nullable=True))

    # ### end Alembic commands ###
