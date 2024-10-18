import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';

export default function Students() {
    const [courseStudents, SetCourseStudents] = useState([]);
    const { courseId } = useParams();

    useEffect(() => {
        const getStudentsByCourse = async () => {
            try {
                const response = await fetch(`/course/${courseId}/students`);
                if (response.ok) {
                    const students = await response.json();
                    SetCourseStudents(students);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getStudentsByCourse();
    }, [courseId]); 
    
    return (
                <ul>
                    {courseStudents.map((student) => (
                        <li key={student.id}>
                            <NavLink to={`/student/${student.id}`}>
                                {student.first_name} {student.last_name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )
}