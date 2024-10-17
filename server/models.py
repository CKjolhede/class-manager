from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import validates
from config import bcrypt, db
from sqlalchemy.ext.hybrid import hybrid_property

#studentcourses = db.Table('student_courses', 
#    db.Column('student_id', db.Integer, db.ForeignKey('students.id'), primary_key=True),
#    db.Column('course_id', db.Integer, db.ForeignKey('courses.id'), primary_key=True)                       
#)

#studentassignments = db.Table('student_assignments',
#    db.Column('student_id', db.Integer, db.ForeignKey('students.id'), primary_key=True),
#    db.Column('assignment_id', db.Integer, db.ForeignKey('assignments.id'), primary_key=True)
#)

### STUDENT ASSIGNMENTS ##########################

class StudentAssignment(db.Model, SerializerMixin):
    __tablename__ = 'student_assignments'
    id = db.Column(db.Integer, primary_key=True)
    points_earned = db.Column(db.Integer, nullable=True)
    
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'), nullable=False)

    student = db.relationship('Student', back_populates='student_assignments')
    assignment = db.relationship('Assignment', backref ='student_assignments')
    
    serializer_rules = ('-assignments.student_assignments', '-students.student_assignments')
    
    def __repr__(self):
        return f'<StudentAssignment {self.id} {self.points_earned} {self.assignment_id}>'
    

## STUDENT COURSES ###########################

class StudentCourse(db.Model, SerializerMixin):
    __tablename__ = 'student_courses'
    id = db.Column(db.Integer, primary_key=True)

    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    
    serializer_rules = ('-students.student_courses', '-courses.student_courses')

    def __repr__(self):
        return f'<StudentCourse {self.student_id} {self.course_id}>'

## COURSE #######################################

class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(300), nullable=False)

    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)
    assignments = db.relationship('Assignment', backref='courses')
    
    students = db.relationship('Student', secondary="student_courses", back_populates='courses') 
    teachers = db.relationship('Teacher', back_populates='courses')
    
    serializer_rules = ('-teacher.courses', '-teacher.assignments', '-assignments.courses', '-assignments.teachers')

    def __repr__(self):
        return f'<Course {self.description}>'
    
## STUDENTS ###################################
class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    
    #assignments = db.relationship('Assignment', secondary='student_assignments', back_populates='students') 
    courses = db.relationship('Course', secondary="student_courses", back_populates='students')
    
    student_assignments = db.relationship('StudentAssignment', back_populates='student')

    serializer_rules = ('-student_assignments.students', '-student_courses.students')
    
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
        return f'<Student_id: {self.id} | Student {self.first_name} {self.last_name} | Email: {self.email}>'

## TEACHERS ################################## 
class Teacher(db.Model, SerializerMixin):
    __tablename__ = 'teachers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    
    courses = db.relationship('Course', back_populates='teachers', lazy=True)

    serializer_rules = ('-courses.teachers')
    
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
        return f'<Teacher_id: {self.id} | Teacher Name: {self.name} | Email: {self.email} >'

## ASSIGNMENTS ############################  
class Assignment(db.Model, SerializerMixin):
    __tablename__ = 'assignments'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    points_possible = db.Column(db.Integer, nullable=True)
    description = db.Column(db.String, nullable=True)

    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    #students = db.relationship('Student', secondary='student_assignments', back_populates='assignments')
    #student_assignments = db.relationship('StudentAssignment', back_populates='assignment')

    def __repr__(self):
        return f'<Assignment: {self.name} | Points Possible: {self.points_possible} | Description:{self.description}>'
    
    serializer_rules = ('-course.assignments', '-course.teachers', '-student_assigments.assignments', '-student_assigments.students')
