import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';



export default function Student({ courseAssignments, studentAssignments }) {
    const { studentId, courseId } = useParams();
    const [student, setStudent] = useState({});
    const [course, setCourse] = useState({});
    console.log("student", student)
    console.log("course", course)
    console.log('student courseAssignments', courseAssignments)
    console.log('student studentAssignments', studentAssignments)
    
    useEffect(() => {
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
        };
        
        const fetchCourse = async () => {
            try {
                const url = `/courses/${courseId}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json()
                    console.log(data)
                    setCourse({
                        description: data.description,
                        courseId: data.id,
                        teacherId: data.teacher_id,
                        teacherName: data[1]
                    });
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
        
        fetchCourse();
        fetchStudent();
    }, [studentId, courseId]);
    console.log(course)
    
    return (
        <>
            <div class="container-fluid p-5 m-0">
            <h3>Student:</h3>
            <NavLink to={`/studentpage/${studentId}`}>
                <h1>
                    {student.first_name} {student.last_name}
                </h1>
            </NavLink>
                <h2> {course.description}</h2>
                
            </div>

            <div class="container-fluid ps-4 m-0">
            <table class="table table-striped-columns">
                <thead>
                    <tr>
                        {courseAssignments.map((assignment) => (
                            <th key={assignment.id}>
                                {" "}
                                <NavLink
                                    to={`/assignment/${assignment.assignment_id}`}
                                    params={courseId}
                                >
                                    {assignment.name}
                                </NavLink>
                            </th>
                        ))}
                        <th>Total Points</th>
                        <th>Assignment Points</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {courseAssignments?.map((courseAssignment) => {
                            const thisAssignment = studentAssignments?.find(
                                (sa) =>
                                    sa.assignment_id ===
                                    courseAssignment.assignment_id
                            );
                            return (
                                <td key={courseAssignment.assignment_id}>
                                    {thisAssignment
                                        ? thisAssignment.points_earned
                                        : 0}{" "}
                                    / {courseAssignment.points_possible}
                                </td>
                            );
                        })}
                        <td>
                            {studentAssignments
                                ?.filter((sa) => sa.student_id === student.id)
                                .reduce(
                                    (total, sa) => total + sa.points_earned,
                                    0
                                )}
                        </td>
                        <td>
                            {courseAssignments?.reduce(
                                (total, ca) => total + ca.points_possible,
                                0
                            )}
                        </td>
                        <td>
                            {(
                                (studentAssignments
                                    ?.filter(
                                        (sa) => sa.student_id === student.id
                                    )
                                    .reduce(
                                        (total, sa) => total + sa.points_earned,
                                        0
                                    ) /
                                    courseAssignments.reduce(
                                        (total, ca) =>
                                            total + ca.points_possible,
                                        0
                                    )) *
                                100
                            ).toFixed(1)}
                            %
                        </td>
                    </tr>
                </tbody>
            </table></div>
        </>
    );
}