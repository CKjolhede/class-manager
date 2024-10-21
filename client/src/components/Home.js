import React, {useState} from 'react';
import { Routes, Route } from "react-router-dom";
import Courses from "./Courses.js";
import Course from "./Course.js";
import CreateAssignment from "./CreateAssignment.js";
//import Header from "./Header.js";
import Students from "./Students.js";
import Sidebar from "./Sidebar.js";
import Assignments from "./Assignments.js";
import TeacherStudents from "./TeacherStudents.js";
import { useAuth } from "../contexts/AuthContext";


export default function Home() {
    const { user } = useAuth(); 
    const [studentAssignments, setStudentAssignments] = useState([]);
    const [courseAssignments, setCourseAssignments] = useState([]);
    
    const fetchStudentAssignments = async () => {
        try {
            const response = await fetch(
                `/student/${user.id}/studentassignments`
            );
            if (response.ok) {
                const data = await response.json();
                setStudentAssignments(data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }; 
    
    const fetchCourseAssignments = async (courseId) => {
        try {
            const response = await fetch(`/course/${courseId}/assignments`);
            if (response.ok) {
                const assignments = await response.json();
                setCourseAssignments(assignments);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    const totalPossiblePoints = () => {
        const totalPoints = courseAssignments?.map(
            (assignment) => assignment.points_possible
        );
        const sum = totalPoints?.reduce((acc, curr) => acc + curr, 0);
        return sum || 0;
    };
    
    const pointsEarned = (assignmentid) => {
        const studentAssignment = studentAssignments?.find(
            (studentAssignment) =>
                studentAssignment?.assignment_id === assignmentid
        );
        return studentAssignment?.points_earned || 0;
    };
    
    const totalEarnedPoints = () => {
        const earnedPoints = courseAssignments?.map((courseAssignment) => {
            const studentAssignment = studentAssignments?.find(
                (studentAssignment) =>
                    studentAssignment?.assignment_id === courseAssignment.id
            );
            return studentAssignment?.points_earned || 0;
        });
        const sum = earnedPoints?.reduce((acc, curr) => acc + curr, 0);
        return sum || 0;
    };
    
    return (
        <>
            <Sidebar />

            <Routes>
                <Route exact path="/courses/*" element={<Courses />} />
                <Route path="course/:courseId/*" element={<Course />} />
                <Route
                    path="course/:courseId/students/*"
                    element={
                        <Students
                        />
                    }
                />
                <Route
                    path="/course/:courseId/assignments/*"
                    element={
                        <Assignments
                            studentAssignments={studentAssignments}
                            fetchStudentAssignments={fetchStudentAssignments}
                            fetchCourseAssignments={fetchCourseAssignments}
                            courseAssignments={courseAssignments}
                            totalPossiblePoints={totalPossiblePoints}
                            pointsEarned={pointsEarned}
                            totalEarnedPoints={totalEarnedPoints}
                        />
                    }
                />
                <Route path="/teacherstudents" element={<TeacherStudents />} />
            </Routes>
        </>
    );
}