import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams, NavLink } from 'react-router-dom';

export default function StudentPage() {
    const { user } = useAuth();
    const { studentId } = useParams();
    const [studentCourses, setStudentCourses] = useState([]);
    const [student, setStudent] = useState({});
    
    useEffect(() => {
        const fetchStudentCourses = async () => {
            try {
                const response = await fetch(`/student/${studentId}/courses`);
                if (response.ok) {
                    const courses = await response.json();
                    setStudentCourses(courses);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        
        const fetchStudent = async () => {
            try {
                const response = await fetch(`/student/${studentId}`);
                if (response.ok) {
                    const student = await response.json();
                    setStudent(student);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fetchStudent();
        fetchStudentCourses();
    }, [studentId]);
    
    
    return (
        <div>
            <h1>{student.first_name} {student.last_name}</h1>
            <ul>
                {studentCourses.filter((course) => course.teacher_id === user.id).map((course) => (
                    <li key={course.id}>
                        <NavLink
                            to={"/course/" + course.id + "/students/student/" + studentId}>
                            {course.description}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}