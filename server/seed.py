#!/usr/bin/env python3

# Standard library imports
from random import randint, sample, choice as rc

# Remote library imports
from faker import Faker
import ipdb

# Local imports
from app import app
from models import db, Teacher, Student, Course, Assignment, StudentAssignment, StudentCourse

def create_teachers():
    teachers = []
    for _ in range(4):
        name=fake.last_name()
        teacher = Teacher(
            name=name,
            password_hash="password",
            email=f'{name}@school.edu'
            )
        teachers.append(teacher)
    return teachers

def create_students():
    students = []
    for _ in range(30):
        last_name = fake.last_name()
        student = Student(
            first_name=fake.first_name(), 
            last_name=last_name,
            email=f'{last_name}@school.edu', 
            password_hash="password"
            )
        students.append(student)
    return students

def create_courses(teachers):
    courses = []
    teacher_ids = [teacher.id for teacher in teachers]
    descriptions = ['Science', 'History', 'English', 'Math']
    
    for _ in range(4):
        description = descriptions.pop(0)
        teacher_id= teacher_ids.pop(0)
        course = Course(
            description=description,
            teacher_id=teacher_id)
        courses.append(course)
    return courses
        
        
def create_assignments(courses):
    assignments = []
    course_ids = [course.id for course in courses]
    for _ in range(40):
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
        
def create_student_courses(students, courses):
    st_courses = []
    for student in students:
        # Get a random list of unique course IDs
        course_ids = sample([course.id for course in courses], 
                            randint(1, len(courses)))
        #ipdb.set_trace()
        for course_id in course_ids:
            student_course = StudentCourse(
                student_id=student.id,
                course_id=course_id
            )
            st_courses.append(student_course)
            
    #for student in students:
    #    student.courses = [course for course in courses if course.id in [st_course.course_id for st_course in st_courses if st_course.student_id == student.id]]


    return st_courses

def assign_student_assignments(students, courses, assignments):
    student_assignments = []

    for course in courses:
        # Get a list of assignments associated with the current course
        course_assignments = [a for a in assignments if a.course_id == course.id]

        for student in students:
            # Check if the student is enrolled in the current course
            if course in student.courses:
                for assignment in course_assignments:
                    points_earned = rc(range(assignment.points_possible + 1))  # Random value between 0 and points_possible

                    student_assignment = StudentAssignment(
                        student_id=student.id,
                        assignment_id=assignment.id,
                        points_earned=points_earned
                    )
                    student_assignments.append(student_assignment)

    return student_assignments






#def assign_student_assignments(students, courses, assignments):
#    assigned_assignments = []
#    student_assignments = []

#    for student in students:
#        for course in student.courses:
#            for _ in range(4):
#                available_assignments = [a.id for a in assignments if a.course_id == course.id and a.id not in assigned_assignments]
#                if len(available_assignments) < 4:

#                    continue                

#                assignment_ids = sample(available_assignments, 4)

#            for assignment_id in assignment_ids:
#                #points_earned = rc(range(assignments[assignment_id].points_possible + 1))  

#                student_assignment = StudentAssignment(
#                    student_id=student.id,
#                    assignment_id=assignment_id,
#                    #points_earned=points_earned
#                )
#                assigned_assignments.append(assignment_id)
#                student_assignments.append(student_assignment)

#    return student_assignments


                #assignment = next(a for a in assignments if a.id == assignment_id)
                #points_earned = rc(range(assignment.points_possible + 1))  # Random value between 0 and points_possible

                #assignment_id = rc([a.id for a in assignments if a.course_id == course.id and a.id not in assigned_assignments])





if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        
        print("Clearing Tables...")
        Teacher.query.delete()
        Course.query.delete()
        Student.query.delete()
        Assignment.query.delete()
        StudentAssignment.query.delete()
        StudentCourse.query.delete()
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

        print("Seeding Student Courses...")
        student_courses = create_student_courses(students, courses)
        db.session.add_all(student_courses)
        db.session.commit()
        
        print("Seeding Student Assignments...")
        student_assignments = assign_student_assignments(students,courses, assignments)
        db.session.add_all(student_assignments)
        db.session.commit()  
        print("Student Assignments seeded!")      

        
        print("Done!")