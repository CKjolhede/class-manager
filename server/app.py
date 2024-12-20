
from flask import request, make_response, jsonify, session, abort
from flask_restful import Resource
from models import db, Teacher, Student, Course, Assignment, StudentAssignment, StudentCourse
from werkzeug.exceptions import NotFound, Unauthorized
from sqlalchemy.exc import MultipleResultsFound
from sqlalchemy_serializer import SerializerMixin
from config import app, db, api, bcrypt
import os
import requests
import ipdb
from itertools import chain

@app.route('/')
def index():
    return 'Class Manager'

@app.route("/login-teacher", methods=["POST"])
def login_teacher():
    email = request.get_json()["email"]
    password = request.get_json()["password"]

    teacher = Teacher.query.filter(Teacher.email == email).first()
    
    if teacher and teacher.authenticate(password):
        session["user_id"] = teacher.id
        teacher.userType = "teacher"
        return make_response(teacher.to_dict(only=["id", "name", "email", "userType"]), 200)
    else:
        return make_response("Invalid teacher email or password", 401)
    
@app.route("/login-student", methods=["POST"])
def login_student():
    email = request.get_json()["email"]
    password = request.get_json()["password"]

    student = Student.query.filter(Student.email == email).first()

    if student and student.authenticate(password):
        session["user_id"] = student.id
        #session["user_type"] = "student"
        student.userType = "student"
        return make_response(student.to_dict(only=["id", "first_name", "last_name", "email", "userType"]), 200)
    else:
        raise Unauthorized


@app.route("/authorized")
def authorized():
    user_id = session.get("user_id")
    if not user_id:
        raise Unauthorized

    for UserModel in [Student, Teacher]:
            if user := UserModel.query.filter(UserModel.id == user_id).first():
                return make_response({"user_info": user.to_dict()}, 200)

    raise Unauthorized

    
@app.route("/logout", methods=["DELETE"])
def logout():
    session.clear()
    return make_response("Logged out", 204)

## TEACHERS ###########################################################

class Teachers(Resource):
    def get(self):
        teachers = Teacher.query.all()
        return [teacher.to_dict(only=["id", "name", "email"]) for teacher in teachers]

    def post(self):
        teacher = Teacher(**request.get_json())
        db.session.add(teacher)
        db.session.commit()
        return teacher.to_dict(only=["id", "name", "email"]), 201
    
class TeacherbyId(Resource):
    def get(self, teacher_id):
        if teacher := Teacher.query.filter(Teacher.id == teacher_id).first():
            return teacher.to_dict(only=["id", "name", "email"])
        else:
            raise NotFound
        
    def delete(self, teacher_id):
        if teacher := Teacher.query.filter(Teacher.id == teacher_id).first():
            db.session.delete(teacher)
            db.session.commit()
            return make_response(f"Teacher {teacher_id} deleted", 200)
        else:
            raise NotFound
        
    def patch(self, teacher_id):
        if not (teacher := Teacher.query.filter(Teacher.id == teacher_id).first()):
            raise NotFound    
        for key, value in request.get_json().items():
                setattr(teacher, key, value)
                db.session.commit()
        return make_response(teacher.to_dict(only=["id", "name", "email"]), 200)
    
## STUDENTS ###########################################################

class Students(Resource):
    def get(self):
        students = Student.query.all()
        return [student.to_dict(only=["id", "first_name", "last_name", "email"]) for student in students]

    def post(self):
        student = Student(**request.get_json())
        db.session.add(student)
        db.session.commit()
        return student.to_dict(only=["id", "first_name", "last_name", "email", "password_hash"]), 201   
    
class StudentbyId(Resource):
    def get(self, student_id):
        if student := Student.query.filter(Student.id == student_id).first():
            return student.to_dict(only=["id", "first_name", "last_name", "email"])
        else:
            raise NotFound
        
    def delete(self, student_id):
        if student := Student.query.filter(Student.id == student_id).first():
            db.session.delete(student)
            db.session.commit()
            return make_response(f"Student {student_id} deleted", 200)
        else:
            raise NotFound
        
    def patch(self, student_id):
        if not (student := Student.query.filter(Student.id == student_id).first()):
            raise NotFound    
        for key, value in request.get_json().items():
                setattr(student, key, value)
                db.session.commit()
        return make_response(student.to_dict(only=["id", "first_name", "last_name", "email"]), 200)
    
class StudentsbyTeacherId(Resource):
    def get(self, teacher_id):
        students = Student.query.join(StudentCourse).join(Course).join(Teacher).filter(Teacher.id == teacher_id).all()
        return [student.to_dict(only=["id", "first_name", "last_name", "email"]) for student in students]
    
class StudentsbyCourseId(Resource):
    def get(self, course_id):
        students = Student.query.join(StudentCourse).filter(StudentCourse.course_id == course_id).all()
        return [student.to_dict(only=["id", "first_name", "last_name", "email"]) for student in students]
    
    def post(self, course_id):
        data = request.get_json()
        student_ids = data.get("student_ids", [])

        for student_id in student_ids:
            enrollment = StudentCourse(course_id=course_id, student_id=student_id)
            db.session.add(enrollment)
            db.session.commit()

        return {"message": "Students enrolled successfully"}, 201
    
class StudentCourses(Resource):
    def get(self, student_id):
        courses = Course.query.join(StudentCourse).filter(StudentCourse.student_id == student_id).all()
        return [course.to_dict(only=["id", "description", "teacher_id"]) for course in courses]
    
    def post(self, course_id, student_id):
        studentcourse = StudentCourse( course_id=course_id, student_id=student_id)
        db.session.add(studentcourse)
        db.session.commit()
        return studentcourse.to_dict(only=["student_id", "course_id"]), 201
api.add_resource(StudentCourses, '/course/<int:course_id>/student/<int:student_id>')


    
class StudentsbyAssignmentId(Resource):
    def get(self, assignment_id):
        studentassignments = StudentAssignment.query.join(Student).filter(StudentAssignment.assignment_id == assignment_id).all()
        
        return [[
            {
                "student_id": studentassignment.student_id,
                "student_name": f"{studentassignment.student.first_name} {studentassignment.student.last_name}",
                "points_earned": {studentassignment.points_earned},
                "total_points_possible": {studentassignment.assignment.points_possible}
            }
            for studentassignment in studentassignments]
        ]

    
## COURSES ###########################################################

class Courses(Resource):
    def get(self):
        courses = Course.query.all()
        return [course.to_dict(only=["id", "description", "teacher_id"]) for course in courses]

    def post(self):
        course = Course(**request.get_json())
        db.session.add(course)
        db.session.commit()
        return course.to_dict(only=["id", "description", "teacher_id"]), 201
    
class CoursebyId(Resource):
    def get(self, course_id):
        if course := Course.query.filter(Course.id == course_id).first():
            teacher = Teacher.query.filter(Teacher.id == course.teacher_id).first()
            teacher_name = f"{teacher.name}"
            return (({
                "id": course.id,
                "description": f"{course.description}",
                "teacher_id": course.teacher_id,
                "teacher_name": teacher_name
            }
                    ), 200) 
        else:
            raise NotFound
        
    def delete(self, course_id):
        if course := Course.query.filter(Course.id == course_id).first():
            db.session.delete(course)
            db.session.commit()
            return make_response(f"Course {course_id} deleted", 200)
        else:
            raise NotFound
        
    def patch(self, course_id):
        if not (course := Course.query.filter(Course.id == course_id).first()):
            raise NotFound    
        for key, value in request.get_json().items():
                setattr(course, key, value)
                db.session.commit()
        return make_response(course.to_dict(only=["id", "description", "teacher_id"]), 200)
    
class CoursesbyTeacherId(Resource):
    def get(self, teacher_id):
        courses = Course.query.filter(Course.teacher_id == teacher_id).all()
        return [course.to_dict(only=["id", "description", "teacher_id"]) for course in courses]

class CoursesbyStudentId(Resource):
    def get(self, student_id):
        courses = Course.query.join(StudentCourse).filter(StudentCourse.student_id == student_id).all()
        return [course.to_dict(only=["id", "description", "teacher_id"]) for course in courses]
    
## ASSIGNMENTS #########################################################

class Assignments(Resource):
    def get(self):
        assignments = Assignment.query.all()
        return [assignment.to_dict(only=["id", "name", "points_possible", "description", "course_id"]) for assignment in assignments]

    def post(self):
        assignment = Assignment(**request.get_json())
        db.session.add(assignment)
        db.session.commit()
        return assignment.to_dict(only=["id", "name", "points_possible", "description", "course_id"]), 201

class AssignmentbyId(Resource):
    def get(self, assignment_id):
        if assignment := Assignment.query.filter(Assignment.id == assignment_id).first():
            #ipdb.set_trace()   
            return {
                "id": assignment.id,
                "name": f"{assignment.name}",
                "points_possible": f"{assignment.points_possible}", 
                "description": f"{assignment.description}",
                "course_id": f"{assignment.course_id}"}
        else:
            raise NotFound
        
    def delete(self, assignment_id):
        if assignment := Assignment.query.filter(Assignment.id == assignment_id).first():
            db.session.delete(assignment)
            db.session.commit()
            return make_response(f"Assignment {assignment_id} deleted", 200)
        else:
            raise NotFound
        
    def patch(self, assignment_id):
        if not (assignment := Assignment.query.filter(Assignment.id == assignment_id).first()):
            raise NotFound    
        for key, value in request.get_json().items():
                setattr(assignment, key, value)
                db.session.commit()
        return make_response(assignment.to_dict(only=["id", "name", "points_possible", "description"]), 200)
    
class AssignmentsbyStudentId(Resource):
    def get(self, student_id):
        assignments = Assignment.query.join(StudentAssignment).filter(StudentAssignment.student_id == student_id).all()
        return [
            {
                "id": assignment.id,
                "name": f"{assignment.name}",
                "points_possible": int(f"{assignment.points_possible}"),   
                "description": f"{assignment.description}",
                "course_id": assignment.course_id,
                
            }
            for assignment in assignments
        ]          
#assignment.to_dict(only=["id", "name", "points_possible", "description"]) for assignment in assignments]
class AssignmentbyCourseId(Resource):
    def get(self, course_Id):
        assignments = Assignment.query.filter(Assignment.course_id == course_Id).all()
        return [assignment.to_dict(only=["id", "name", "points_possible", "description", "course_id"]) for assignment in assignments]
    
class AssignmentsbyCourseId(Resource):
    def get(self, course_id):
        assignments = Assignment.query.filter(Assignment.course_id == course_id).all()
        studentassignments = list(chain(*[StudentAssignment.query.filter(StudentAssignment.assignment_id == assignment.id).all() for assignment in assignments]))
        #studentassignments = [StudentAssignment.query.filter(StudentAssignment.assignment_id == assignment.id).all() for assignment in assignments]  

        return [
            {
                "assignment_id": assignment.id,
                "name": f"{assignment.name}",
                "points_possible": int(f"{assignment.points_possible}"), 
                "description": f"{assignment.description}",
                "course_id": f"{assignment.course_id}",

                "studentassignments": [
                    {
                        "sa_id": studentassignment.id,
                        "assignment_id": studentassignment.assignment_id,
                        "points_earned": studentassignment.points_earned,
                        "student_id": studentassignment.student_id,
                        "student_name": f"{studentassignment.student.first_name} {studentassignment.student.last_name}"
                    }
                    for studentassignment in studentassignments
                ]
            }
            for assignment in assignments
        ]
    
class AssignmentsbyTeacherId(Resource):
    def get(self, teacher_id):
        assignments = Assignment.query.join(Course).filter(Course.teacher_id == teacher_id).all()

        return [
            {
                "id": assignment.id,
                "name": f"{assignment.name}",
                "points_possible": int(f"{assignment.points_possible}"), 
                "description": f"{assignment.description}",
                "course_id": assignment.course_id
            }
            for assignment in assignments
        
            ] 
    
class StudentAssignments(Resource):
    def get(self):
        assignments = StudentAssignment.query.all()
        return [assignment.to_dict(only=["points_earned", "assignment_id", "student_id"]) for assignment in assignments]

class CreateStudentAssignments(Resource):
    def post(self, assignment_id, student_id):
        assignment = StudentAssignment( assignment_id=assignment_id, student_id=student_id, points_earned=0  )
        db.session.add(assignment)
        db.session.commit()
        return assignment.to_dict(only=["points_earned", "assignment_id", "student_id"]), 201
api.add_resource(CreateStudentAssignments, '/assignment/<int:assignment_id>/student/<int:student_id>')

class StudentAssignmentsbyCourseId(Resource):
    def get(self, course_id):
        studentassignments = StudentAssignment.query.join(Assignment).filter(Assignment.course_id == course_id).all()
        return [
            {
                "student_id": studentassignment.student_id,
                "assignment_id": studentassignment.assignment_id,
                "points_earned": studentassignment.points_earned,
                "course_id": studentassignment.assignment.course_id
                } for studentassignment in studentassignments]
    
class StudentAssignmentbyId(Resource):
    def get(self, studentassignment_id):
        if studentassignment := StudentAssignment.query.join(Student).filter(StudentAssignment.id == studentassignment_id).first():
            return studentassignment.to_dict(
                {
                    "id": studentassignment.id,
                    "points_earned": studentassignment.points_earned,
                    "assignment_id": studentassignment.assignment_id,
                    "student_id": studentassignment.student_id,
                    "student_name": f"{studentassignment.student.first_name} {studentassignment.student.last_name}"
                }
            )
        else:
            raise NotFound
        
    def patch(self, studentassignment_id):
        if not (studentassignment := StudentAssignment.query.join(Student).filter(StudentAssignment.id == studentassignment_id).first()):
            raise NotFound   

        for key, value in request.get_json().items():
                setattr(studentassignment, key, value)
                db.session.commit()
        #ipdb.set_trace()
        return make_response({
                    "id": studentassignment.id,
                    "points_earned": studentassignment.points_earned,
                    "assignment_id": studentassignment.assignment_id,
                    "student_id": studentassignment.student_id,
                    "student_name": f"{studentassignment.student.first_name} {studentassignment.student.last_name}"
            }, 200)
    
class StudentAssignmentsbyAssignmentId(Resource):
    def get(self, assignment_id):
        studentassignments = StudentAssignment.query.join(Student).filter(StudentAssignment.assignment_id == assignment_id).all()
        return [{
            "id": studentassignment.id,
            "points_earned": studentassignment.points_earned,
            "student_id": studentassignment.student_id,
            "assignment_id": studentassignment.assignment_id,
            "student_name": f"{studentassignment.student.first_name} {studentassignment.student.last_name}"
            } for studentassignment in studentassignments]
    
class StudentAssignmentsbyTeacherId(Resource):
    def get(self, teacher_id):
        assignments = StudentAssignment.query.join(Student).join(StudentCourse).join(Course).join(Teacher).filter(Course.teacher_id == teacher_id).all()
        points_earned = [assignment.points_earned for assignment in assignments]

        return [
            {
                "student_id": assignment.student_id,
                "assignment_name": f"{assignment.assignment.name}",
                "points_earned": assignment.points_earned,
                "points_possible": int(f"{assignment.assignment.points_possible}"), 
                "student_name": f"{assignment.student.first_name} {assignment.student.last_name}"
            }
            for assignment in assignments
        ]
    
class StudentAssignmentsbyStudentId(Resource):
    def get(self, student_id):
        student_assignments = StudentAssignment.query.filter(StudentAssignment.student_id == student_id).all()
        return [assignment.to_dict(only=["points_earned", "assignment_id", "student_id"]) for assignment in student_assignments]

api.add_resource(Teachers, '/teachers')
api.add_resource(TeacherbyId, '/teacher/<int:teacher_id>')
api.add_resource(Students, '/students')
api.add_resource(StudentbyId, '/student/<int:student_id>')
api.add_resource(StudentsbyCourseId, '/course/<int:course_id>/students')
api.add_resource(StudentsbyAssignmentId, '/assignment/<int:assignment_id>/students')
api.add_resource(StudentsbyTeacherId, '/teacher/<int:teacher_id>/students')
api.add_resource(Courses, '/courses')
api.add_resource(CoursebyId, '/course/<int:course_id>')

api.add_resource(CoursesbyTeacherId, '/teacher/<int:teacher_id>/courses')
api.add_resource(CoursesbyStudentId, '/student/<int:student_id>/courses')
api.add_resource(Assignments, '/assignments')
api.add_resource(AssignmentbyId, '/assignment/<int:assignment_id>')
api.add_resource(AssignmentsbyStudentId, '/student/<int:student_id>/assignments')
api.add_resource(AssignmentsbyCourseId, '/course/<int:course_id>/assignments')
api.add_resource(AssignmentbyCourseId, "/course/<int:course_id>/assignment/<int:assignment_id>")
api.add_resource(AssignmentsbyTeacherId, '/teacher/<int:teacher_id>/assignments')
api.add_resource(StudentAssignmentsbyTeacherId, '/teacher/<int:teacher_id>/studentassignments')
api.add_resource(StudentAssignmentsbyAssignmentId, '/assignment/<int:assignment_id>/studentassignments')
api.add_resource(StudentAssignmentsbyStudentId, '/student/<int:student_id>/studentassignments')
api.add_resource(StudentAssignments, '/studentassignments')
api.add_resource(StudentAssignmentbyId, '/studentassignment/<int:studentassignment_id>')
api.add_resource(StudentAssignmentsbyCourseId, '/course/<int:course_id>/studentassignments')

#api.add_resource(StudentAssignmentsbyCourseId, '/course/<int:course_id>/studentassignments/<int:student_id>')





if __name__ == '__main__':
    app.run(port=5555, debug=True)



