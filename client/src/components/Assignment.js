import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useParams } from 'react-router-dom';
import EditAssignment from './EditAssignment';
import { Routes, Route } from "react-router-dom";

export default function Assignment() {
    const { userType } = useAuth();
    const { assignmentId, courseId } = useParams();
    const [assignment, setAssignment] = useState([]);
    const [studentAssignments, setStudentAssignments] = useState([]);
    console.log("studentassignments from assignment", studentAssignments)
    
    
    const handleAssignmentUpdate = async (updatedAssignment) => {
        setAssignment(updatedAssignment);
    }
    
    const handlePointsEarnedChange = async (
        studentAssignmentId,
        newPointsEarned
    ) => {
        try {
            const response = await fetch(
                `/studentassignment/${studentAssignmentId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ points_earned: newPointsEarned }),
                });
                if (response.ok) {
                    const updatedStudentAssignment = await response.json();
                    const updatedStudentAssignments = studentAssignments.map(
                        (studentAssignment) => {
                            if (
                                studentAssignment.id === updatedStudentAssignment.id
                            ) {
                                return updatedStudentAssignment;
                            }
                            return studentAssignment;
                        }
                    );
                    setStudentAssignments(updatedStudentAssignments);
                };

        } catch (error) {
            console.error("Error:", error);
        }
        
    }

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const assignmentresponse = await fetch(`/assignment/${assignmentId}`);
                if (assignmentresponse.ok) {
                    const assignment = await assignmentresponse.json();
                    setAssignment(assignment);
                
                    const studentAssignmentsResponse = await fetch(
                        `/assignment/${assignmentId}/studentassignments`
                    );
                    if (studentAssignmentsResponse.ok) {
                        const studentAssignmentsData =
                            await studentAssignmentsResponse.json();
                        setStudentAssignments(studentAssignmentsData);
                    }
                
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchAssignment();
    }, [assignmentId])
    
    if (!assignment || !studentAssignments) {
        return <div>Loading...</div>;
    }   
    
    return (
        <>
            <h1>Assignment</h1>
            {assignment && (
                <h1>
                    Assignnment: {assignment.name}
                    <br /> Description: {assignment.description}
                    <br /> Points Possible: {assignment.points_possible}
                </h1>
            )}
            {userType === "teacher" ? (
                <>
                    <div>
                        <h2>Student Assignments</h2>
                        <ul>
                            {studentAssignments.map((studentAssignment) => (
                                <li key={studentAssignment.id}>
                                    {studentAssignment.student_name} - Points
                                    Earned:
                                <form 
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const newPointsEarned = e.target.pointsEarned.value;
                                        await handlePointsEarnedChange(
                                            studentAssignment.id,
                                            newPointsEarned
                                        );
                                        }}    
                                    >
                                        <input
                                            type="number"
                                            name="pointsEarned"
                                            defaultValue={studentAssignment.points_earned}
                                        />
                                        <button type="submit">Submit</button>
                                    </form>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <NavLink
                            to={`/course/${courseId}/assignment/${assignment.id}/edit`}
                        >
                            Edit
                        </NavLink>
                        <Routes>
                            <Route
                                path="/edit"
                                element={
                                    <EditAssignment
                                        assignment={assignment}
                                        handleAssignmentUpdate={
                                            handleAssignmentUpdate
                                        }
                                    />
                                }
                            />
                        </Routes>
                    </div>
                </>
            ) : null}
        </>
    );
}
