#!/usr/bin/env python3

# Standard library imports
from random import randint, sample, choice as rc

# Remote library imports
from faker import Faker
import ipdb

# Local imports
from app import app
from models import db, Teacher, Student, Course, Assignment, studentassignments, studentcourses

def create_teachers():
    teachers = []
    for _ in range(3):
        teacher = Teacher(
            name=fake.last_name(),
            email=fake.email(), 
            _password_hash="password",
            )
        teachers.append(teacher)
    return teachers

def create_courses(teachers):
    courses = []
    for _ in range(4):
        teacher_id = rc([teacher.id for teacher in teachers])
        description = rc(['Biology', 'Chemistry', 'A&P', 'Physics'])
        course = Course(
            description=description,
            teacher_id=teacher_id)
        courses.append(course)
    return courses
        
def create_students():
    students = []
    for _ in range(30):
        student = Student(
            first_name=fake.first_name(), last_name=fake.last_name(),
            email=fake.email(), 
            _password_hash="password",
            )
        students.append(student)
    return students
        
def create_assignments(courses):
    assignments = []
    course_ids = [course.id for course in courses]
    for _ in range(100):
        #ipdb.set_trace()
        course_id = rc(course_ids)
        points_possible = rc([20, 50, 100])
        description = rc(['fill in the blanks with the correct word', 'write a brief summary of the article', 'select the correct answer for each questions'])
        assignment = Assignment(
            name=fake.company(),
            description=description,
            points_possible=points_possible,
            course_id=course_id,
        )
        assignments.append(assignment)
    return assignments
        
def create_student_assignments(students, assignments):
    st_assignments = []
    for _ in range(100):
        student_id = rc([student.id for student in students])
        assignment_id = rc([assignment.id for assignment in assignments])
        student_assignment = studentassignments(
            student_id=student_id,
            assignment_id=assignment_id,
        )
        st_assignments.append(student_assignment)
    return st_assignments

def create_student_courses(students, courses):
    st_courses = []
    for _ in range(90):
        student_id = rc([student.id for student in students])
        course_id = rc([course.id for course in courses])
        student_course = studentcourses(
            student_id=student_id,
            course_id=course_id
        )
        st_courses.append(student_course)
    return st_courses

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        
        print("Clearing Tables...")
        Teacher.query.delete()
        Course.query.delete()
        Student.query.delete()
        Assignment.query.delete()
        print("Tables cleared!")
        
        print("Starting seed...")
        # Seed code goes here!
        print("Seeding Teachers...")
        teachers = create_teachers()
        db.session.add_all(teachers)
        db.session.commit()  
        print("Teachers seeded!")  
            
        print("Seeding Courses...")
        courses = create_courses(teachers)
        db.session.add_all(courses)
        db.session.commit()   
        print("Courses seeded!")
        
        print("Seeding Students...")
        students = create_students()
        db.session.add_all(students)
        db.session.commit()
        print("Students seeded!")


        

        print("Seeding Assignments...")
        assignments = create_assignments(courses)
        db.session.add_all(assignments)
        db.session.commit()  
        print("Assignments seeded!")      

        print("Seeding Student Assignments...")
        student_assignments = create_student_assignments(students, assignments)
        db.session.add_all(student_assignments)
        db.session.commit()  
        print("Student Assignments seeded!")      

        print("Seeding Student Courses...")
        student_courses = create_student_courses(students, courses)
        db.session.add_all(student_courses)
        db.session.commit()
        
        print("Done!")