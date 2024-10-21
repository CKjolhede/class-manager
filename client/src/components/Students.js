import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';

export default function Students() {
    const [courseStudents, setCourseStudents] = useState([]);
    const [courseAssignments, setCourseAssignments] = useState([]);
    const [studentAssignments, setStudentAssignments] = useState([]);
    console.log("students assignments", studentAssignments)
    console.log("students courseassignments", courseAssignments)
    console.log("students coursestudents", courseStudents)
    const { courseId } = useParams();

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
                    console.log("fetched assignments by course",assignments)
                    setCourseAssignments(assignments);
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
                    console.log("fetched studentassignments by course",studentassignments)
                    setStudentAssignments(studentassignments);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getStudentAssignmentsByCourse();
        getStudentsByCourse();
        getAssignmentsByCourse();
    }, [courseId]); 
    
    const totalPointsEarned = (studentAssignments, student) => {
            studentAssignments?.filter((sa) => sa.student_id === student.id).reduce((total, sa) => total + sa.points_earned, 0)}
        
    return (
        <div>
            <h1>Students</h1>
            {/*<ul>
                {courseStudents.map((student) => (
                    <li key={student.id}>
                        <NavLink to={`/student/${student.id}`}>
                            {student.first_name} {student.last_name}
                        </NavLink>
                    </li>
                ))}
            </ul>*/}

            {courseStudents.length > 0 && courseAssignments.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            {courseAssignments.map((assignment) => (
                                <th key={assignment.id}>{assignment.name}</th>
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
                                    {student.first_name} {student.last_name}
                                </td>

                                {courseAssignments.map((courseAssignment) => {
                                    const thisAssignment =
                                        studentAssignments?.find(
                                            (sa) =>
                                                sa.assignment_id ===
                                                    courseAssignment.assignment_id &&
                                                sa.student_id === student.id
                                        );
                                    return (
                                        <td key={courseAssignment.id}>
                                            {thisAssignment
                                                ? thisAssignment.points_earned
                                                : 0}{" "}
                                            / {courseAssignment.points_possible}
                                        </td>
                                    );
                                })}
                                <td>
                                    {studentAssignments
                                        ?.filter(
                                            (sa) => sa.student_id === student.id
                                        )
                                        .reduce(
                                            (total, sa) =>
                                                total + sa.points_earned,
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
                                    {((studentAssignments
                                        ?.filter((sa) => sa.student_id === student.id)
                                        .reduce((total, sa) => total + sa.points_earned, 0)
                                    /
                                    courseAssignments.reduce((total, ca) =>total + ca.points_possible,0 )) * 100).toFixed(1)} %
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
    
    //return (
    //            <ul>
    //        {courseStudents.map((student) => (
    //            <li key={student.id}>
    //                <NavLink to={`/student/${student.id}`}>
    //                    {student.first_name} {student.last_name}
    //                </NavLink>
    //            </li>
    //                ))}
    //            </ul>
    //        )
}