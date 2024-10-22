import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



export default function Student({ courseAssignments, studentAssignments }) {
    const { studentId, courseId } = useParams();
    const [student, setStudent] = useState({});
    const [course, setCourse] = useState({});
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
                    console.log("student fetchcourse", data)
                    setCourse({
                        description: data[0].description,
                        courseId: data[0].id,
                        teacherId: data[0].teacher_id,
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
    
    
    return (
            <>
                <h1> {student.first_name} {student.last_name}</h1>
                <h2> {course.description}</h2>
                <table>
                    <thead>
                        <tr>
                            {courseAssignments.map((assignment) => (
                                <th key={assignment.id}>{assignment.name}</th>
                            ))}
                            <th>Total Points</th>
                            <th>Assignment Points</th>
                            <th>Grade</th>                              
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {courseAssignments?.map((courseAssignment) => {
                            const thisAssignment = studentAssignments?.find((sa) => sa.assignment_id === courseAssignment.assignment_id);
                        console.log("student thisAssignment", thisAssignment)
                            return (
                                <td key={courseAssignment.assignment_id}>
                                    {thisAssignment
                                        ? thisAssignment.points_earned : 0} / {courseAssignment.points_possible} 
                                </td>);
                        })}
                        <td>
                            {studentAssignments?.filter((sa) => sa.student_id === student.id)
                            .reduce((total, sa) => total + sa.points_earned, 0)} 
                        </td>
                        <td>
                            {courseAssignments?.reduce((total, ca) => total + ca.points_possible, 0)}
                        </td>
                        <td>
                            {(
                                (studentAssignments
                                    ?.filter((sa) => sa.student_id === student.id).reduce((total, sa) => total + sa.points_earned, 0) / courseAssignments.reduce((total, ca) => total + ca.points_possible, 0)) * 100).toFixed(1)}%</td>

                        </tr>
                    </tbody>
                </table>
            </>
            )
}