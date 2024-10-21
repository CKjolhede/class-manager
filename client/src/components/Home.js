import React, {useState} from 'react';
import { Routes, Route } from "react-router-dom";
import Courses from "./Courses.js";
import Course from "./Course.js";
import Student from "./Student.js";
//import Header from "./Header.js";
import Students from "./Students.js";
import Sidebar from "./Sidebar.js";
import Assignments from "./Assignments.js";
import TeacherStudents from "./TeacherStudents.js";



export default function Home() {
    const [studentAssignments, setStudentAssignments] = useState([]);
    const [courseAssignments, setCourseAssignments] = useState([]);
    
    const handleSetCourseAssignments = (assignments) =>        setCourseAssignments( assignments );
    
    
    const handleSetStudentAssignments = (sa) =>
        setStudentAssignments( sa );
    
    
    
    return (
        <>
            <Sidebar />

            <Routes>
                <Route path="/courses/*" element={<Courses />} />
                <Route path="course/:courseId/*" element={<Course />} />
                <Route
                    path="course/:courseId/students/*"
                    element={
                        <Students
                            handleSetCourseAssignments={
                                handleSetCourseAssignments
                            }
                            courseAssignments={courseAssignments}
                            handleSetStudentAssignments={
                                handleSetStudentAssignments
                            }
                            studentAssignments={studentAssignments}
                        />
                    }
                />
                <Route
                    path="/course/:courseId/assignments/*"
                    element={<Assignments />}
                />
                <Route path="/teacherstudents" element={<TeacherStudents />} />
                <Route
                    path="/student/:studentId"
                    element={
                        <Student
                            courseAssignments={courseAssignments}
                            studentAssignments={studentAssignments}
                        />
                    }
                />
            </Routes>
        </>
    );
}