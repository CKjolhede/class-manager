import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams, NavLink } from "react-router-dom";

export default function AssignmentsTeacher() {
    const { userType } = useAuth();
    const { courseId } = useParams();
    const [courseAssignments, setCourseAssignments] = useState([]);

    useEffect(() => {
        const fetchAssignments = async () => {
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
        fetchAssignments();
    },[courseId])
    
    return (

        <ul>
            {courseAssignments?.map((assignment) => (
            <li key={assignment.id}>
                <NavLink to={`/course/${courseId}/assignment/${assignment.id}`}>
                    {assignment.name}
                    </NavLink>
                <ul>
                    {/*<li>{assignment.points_possible} points possible </li>*/}

                </ul>   
                
            </li>))}
        </ul>    
        );
}



