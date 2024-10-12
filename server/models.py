from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import validates
from config import bcrypt, db
from sqlalchemy.ext.hybrid import hybrid_property

# Models go here!
class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    assignments = db.relationship('Assignment', backref='courses', lazy=True)
    
    serializer_rules = ('-teacher.courses', '-teacher.assignments', '-assignments.courses', '-assignments.teachers')

    def __repr__(self):
        return f'<Course {self.name}>'
    

class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    student_assignments = db.relationship('StudentAssignment', back_populates='students', lazy=True)
    student_courses = db.relationship('Course', secondary='students_courses', back_populates='students', lazy=True)

    serializer_rules = ('-student_assignments.students', '-student_assignments.assignments', '-student_courses.students', '-student_courses.courses')
    @validates('password')
    def validate_password(self, key, password):
        if not password:
            raise ValueError('Password cannot be left blank')
        return password
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf8"))
        self._password_hash = password_hash.decode("utf8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf8"))
    def __repr__(self):
        return f'<Student {self.first_name} {self.last_name}>'

    
class Teacher(db.Model, SerializerMixin):
    __tablename__ = 'teachers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    courses = db.relationship('Course', back_populates='teachers', lazy=True)
    assignments = db.relationship('Assignment', back_populates='teachers', lazy=True)
    
    serializer_rules = ('-courses.teachers', '-courses.assignments', '-assignments.courses', '-assignments.teachers')
    

    @validates('password')
    def validate_password(self, key, password):
        if not password:
            raise ValueError('Password cannot be left blank')
        return password
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode("utf8"))
        self._password_hash = password_hash.decode("utf8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf8"))
    def __repr__(self):
        return f'<Teacher {self.name}>'
    
class Assignment(db.Model, SerializerMixin):
    __tablename__ = 'assignments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    points_possible = db.Column(db.Integer, nullable=True)
    description = db.Column(db.String(100), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    student_assigments = db.relationship('StudentAssignment', back_populates='assignments', lazy=True)
    def __repr__(self):
        return f'<Assignment {self.name}>'
    
class StudentAssignment(db.Model, SerializerMixin):
    __tablename__ = 'student_assignments'
    id = db.Column(db.Integer, primary_key=True)
    points_earned = db.Column(db.Integer, nullable=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    UniqueConstraint('student_id', 'assignment_id', name='student_assignments')
    
    def __repr__(self):
        return f'<StudentAssignment {self.id} {self.points_earned} {self.assignment_id}>'
    
class StudentCourse(db.Model, SerializerMixin):
    __tablename__ = 'student_courses'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    UniqueConstraint('student_id', 'course_id', name='student_courses')
    
    def __repr__(self):
        return f'<StudentCourse {self.student_id} {self.course_id}>'
    
