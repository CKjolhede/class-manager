import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";


export default function Students({ handleSetCourseAssignments, courseAssignments, handleSetStudentAssignments, studentAssignments }) {
    const [courseStudents, setCourseStudents] = useState([]);
    const { userType } = useAuth();
    //const [courseAssignments, setCourseAssignments] = useState([]);
    //const [studentAssignments, setStudentAssignments] = useState([]);

    const { courseId } = useParams();
    console.log("students courseAssignments", courseAssignments);
    console.log("students studentAssignments", studentAssignments);
    useEffect(() => {
        const getStudentsByCourse = async () => {
            try {
                const response = await fetch(`/course/${courseId}/students`);
                if (response.ok) {
                    const students = await response.json();
                    setCourseStudents(students);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        
        const getAssignmentsByCourse = async () => {
            try {
                const response = await fetch(`/course/${courseId}/assignments`);
                if (response.ok) {
                    const assignments = await response.json();

                    handleSetCourseAssignments(assignments);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        
        const getStudentAssignmentsByCourse = async () => {
            try {
                const response = await fetch(`/course/${courseId}/studentassignments`);
                if (response.ok) {
                    const studentassignments = await response.json();
                    handleSetStudentAssignments(studentassignments);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getStudentAssignmentsByCourse();
        getStudentsByCourse();
        getAssignmentsByCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]); 
    
    //const totalPointsEarned = (studentAssignments, student) => {
    //        studentAssignments?.filter((sa) => sa.student_id === student.id).reduce((total, sa) => total + sa.points_earned, 0)}
        
    return (
        <>
            <div>
                <div class='container-fluid ps-5 pt-2 pb-2 m-0 fw-bold bg-gray-600'>
                {userType === "teacher" ? (
                    <NavLink to={`/course/${courseId}/addassignment`}>
                        New Assignment
                    </NavLink>
                ) : null}</div>
                <h1 class="ps-5">Students</h1>

                {courseStudents.length > 0 && courseAssignments.length > 0 && (
                    <div class="table-responsive ps-5 pe-5">
                        <table class="table table-hover table-primary">
                            <thead>
                                <tr>
                                    <th class="text-center col-1">Student</th>
                                    {courseAssignments.map((assignment) => (
                                        <th class="text-center col-2" key={assignment.id}>
                                            <NavLink
                                                to={`/assignment/${assignment.assignment_id}`}
                                            >
                                                {assignment.name}
                                            </NavLink>
                                        </th>
                                    ))}
                                    <th>Total Points Earned</th>
                                    <th>Total Points Possible</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseStudents.map((student) => (
                                    <tr key={student.id}>
                                        <td>
                                            <NavLink
                                                to={`/course/${courseId}/students/student/${student.id}`}
                                            >
                                                {student.first_name}{" "}
                                                {student.last_name}
                                            </NavLink>
                                        </td>

                                        {courseAssignments.map(
                                            (courseAssignment) => {
                                                const thisAssignment =
                                                    studentAssignments?.find(
                                                        (sa) =>
                                                            sa.assignment_id ===
                                                                courseAssignment.assignment_id &&
                                                            sa.student_id ===
                                                                student.id
                                                    );
                                                return (
                                                    <td
                                                        key={
                                                            courseAssignment.id
                                                        }
                                                    >
                                                        {thisAssignment
                                                            ? thisAssignment.points_earned
                                                            : 0}{" "}
                                                        /{" "}
                                                        {
                                                            courseAssignment.points_possible
                                                        }
                                                    </td>
                                                );
                                            }
                                        )}
                                        <td>
                                            {studentAssignments
                                                ?.filter(
                                                    (sa) =>
                                                        sa.student_id ===
                                                        student.id
                                                )
                                                .reduce(
                                                    (total, sa) =>
                                                        total +
                                                        sa.points_earned,
                                                    0
                                                )}
                                        </td>

                                        <td>
                                            {courseAssignments.reduce(
                                                (total, ca) =>
                                                    total + ca.points_possible,
                                                0
                                            )}
                                        </td>
                                        <td>
                                            {(
                                                (studentAssignments
                                                    ?.filter(
                                                        (sa) =>
                                                            sa.student_id ===
                                                            student.id
                                                    )
                                                    .reduce(
                                                        (total, sa) =>
                                                            total +
                                                            sa.points_earned,
                                                        0
                                                    ) /
                                                    courseAssignments.reduce(
                                                        (total, ca) =>
                                                            total +
                                                            ca.points_possible,
                                                        0
                                                    )) *
                                                100
                                            ).toFixed(1)}{" "}
                                            %
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
    

}