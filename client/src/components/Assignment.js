import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useParams } from 'react-router-dom';
import EditAssignment from './EditAssignment';
import { Routes, Route } from "react-router-dom";

export default function Assignment() {
    const {  user,userType } = useAuth();
    const { assignmentId, courseId } = useParams();
    const [assignment, setAssignment] = useState([]);
    const [studentAssignments, setStudentAssignments] = useState([]);
    console.log("assignment fetchedassignment", assignment)
    console.log("assignment fetchedstudentassignments", studentAssignments)
    const handleAssignmentUpdate = async (updatedAssignment) => {
        setAssignment(updatedAssignment);
    }
    
    const pointsEarned = () => {
        const studentAssignment = studentAssignments?.find(
            (studentAssignment) =>
                studentAssignment?.student_id === user.id
        );
        return studentAssignment?.points_earned || 0;
    };
    
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
                console.log("assiginment fetchassignment response:", assignment);
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
            {userType === "teacher" ? (
                
            
            <NavLink to={`/course/${assignment.course_id}/students`}>Students</NavLink>) : null}
            
            <h3>Assignment</h3>
            {assignment && (
                <>
                    <h1> {assignment.name} </h1>
                    <h3> {assignment.description}</h3>
                    <h4>{userType === "student" && `Points Earned:  ${pointsEarned()}`}</h4>
                    <h4> Points Possible: {assignment.points_possible}</h4>
            </> )}
            {userType === "teacher" ? (
                <>
                    <div>
                        <h2>Student Assignments</h2>
                        <ul>
                            {studentAssignments.map((studentAssignment) => (
                                <li key={studentAssignment.id}>
                                    <NavLink to={`/course/${courseId}/students/student/${studentAssignment.student_id}`}>
                                        {studentAssignment.student_name}
                                    </NavLink>
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const newPointsEarned =
                                                e.target.pointsEarned.value;
                                            await handlePointsEarnedChange(
                                                studentAssignment.id,
                                                newPointsEarned
                                            );
                                        }}
                                    >Points Earned:
                                        <input
                                            type="number"
                                            name="pointsEarned"
                                            defaultValue={
                                                studentAssignment.points_earned
                                            }
                                        />
                                        <button type="submit">Submit</button>
                                    </form>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <NavLink
                            to={`/assignment/${assignmentId}/edit`}
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
