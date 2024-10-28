import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { NavLink, useParams, useNavigate} from 'react-router-dom';
//import EditAssignment from './EditAssignment';


export default function Assignment({ handleAssignmentUpdate, assignment }) {
    const {  user,userType } = useAuth();
    const { assignmentId, courseId } = useParams();

    const navigate = useNavigate();
    //const [assignment, setAssignment] = useState([]);
    const [studentAssignments, setStudentAssignments] = useState([]);
    
    
    //const handleAssignmentUpdate = async (updatedAssignment) => {
    //    setAssignment(updatedAssignment);
    //}
    
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
            
                    handleAssignmentUpdate(assignment);
                    
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
        
        //const fetchCourse = async () => {
        //    try {
        //        const response = await fetch(`/course/${courseId}`);
        //        if (response.ok) {
        //            const data = await response.json();
        //            setCourse(data);
        //        }
        //    } catch (error) {
        //        console.error("Error:", error);
        //    }
        //};

        //fetchCourse();
        fetchAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignmentId])
    
    if (!assignment || !studentAssignments) {
        return <div>Loading...</div>;
    }   
    
    return (
        <>
            <div class="container-fluid ps-5 m-0">
                <div class="btn-group col-3 d-md-flex">
            {userType === "student" ? (<>
                    <button class="btn btn-primary" onClick={() => navigate(-1)}>Assignments</button></>): null}
            {userType === "teacher" ? (<>
                    <button class="btn btn-primary" onClick={() => navigate(-1)}>Assignments </button>
                    <button class="btn btn-primary" onClick={() => navigate(`/editassignment/${assignmentId}`)}>Edit</button>
                    <button class="btn btn-primary" onClick={() => navigate(`/course/${assignment.course_id}/students`)}>Students</button></>) : null}
            </div>
                {/*<h2>{course.description}</h2>*/}
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
                
                        {/*<Routes>
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
                        </Routes>*/}
                    </div>
                </>
                ) : null}
            </div>
        </>
    );
}
