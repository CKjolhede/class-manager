import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useParams } from 'react-router-dom';
import EditAssignment from './EditAssignment';
import { Routes, Route } from "react-router-dom";

export default function Assignment() {
    const { userType } = useAuth();
    const { assignmentId, courseId } = useParams();
    const [assignment, setAssignment] = useState([]);
    console.log(assignment)

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await fetch(`/assignment/${assignmentId}`);
                if (response.ok) {
                    const assignment = await response.json();
                    setAssignment(assignment);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchAssignment();
    }, [assignmentId])
    
    const handleAssignmentUpdate = async (updatedAssignment) => {
        setAssignment(updatedAssignment);
    }
    
    //useEffect(() => { 
    //    const fetchStudentAssignments = async () => {
    //        try {
    //            const response = await fetch(`/assignment/${assignmentId}/students`);
    //            if (response.ok) {
    //                const studentassignments = await response.json();
    //                setStudentAssignments(studentassignments);
    //            }
    //        } catch (error) {
    //            console.error("Error:", error);
    //        }
    //    };
    //    fetchStudentAssignments();    
    //},[assignmentId])

    
    return (
        <>
            <h1>Assignment</h1>
            {assignment && (
                <h1>
                    Assignnment: {assignment.name}
                    <br /> Description: {assignment.description}
                    <br /> Points Possible: {assignment.points_possible}
                </h1>)}
            {userType === "teacher" ? (
                <div>
                    <NavLink to={`/course/${courseId}/assignment/${assignment.id}/edit`}>
                    Edit
                    </NavLink>
                    < Routes >
                        <Route path="/edit" element={<EditAssignment assignment={assignment} handleAssignmentUpdate={handleAssignmentUpdate} />} />
                    </Routes >
                </div>) : null}

            
        </>
    );
}