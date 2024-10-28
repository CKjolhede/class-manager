import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams, NavLink, useNavigate} from "react-router-dom";

export default function Assignments() {
    const navigate = useNavigate();
    const { user, userType } = useAuth();
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [studentAssignments, setStudentAssignments] = useState([]);
    const [courseAssignments, setCourseAssignments] = useState([]);
    console.log("courseassignments", courseAssignments)
    console.log("studentassignments", studentAssignments)

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`/course/${courseId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCourse(data)
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
        
        fetchCourse();
    }, [courseId]);
    
    useEffect(() => {

        const fetchStudentAssignments = async () => {
            try {
                const response = await fetch(
                    `/student/${user.id}/studentassignments`
                );
                if (response.ok) {
                    const data = await response.json();
                    setStudentAssignments(data);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }; 
        
        const fetchCourseAssignments = async (courseId) => {
            try {
                const response = await fetch(
                    `/course/${courseId}/assignments`
                );
                if (response.ok) {
                    const assignments = await response.json();
                    setCourseAssignments(assignments);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        

        fetchStudentAssignments(user);
        fetchCourseAssignments(courseId);
    }, [user, courseId]);
    
    const totalPossiblePoints = () => {
        const totalPoints = courseAssignments?.map(
            (assignment) => assignment.points_possible
        );
        const sum = totalPoints?.reduce((acc, curr) => acc + curr, 0);
        return sum || 0;
    };
    
    const pointsEarned = (assignmentId) => {
        const studentAssignment = studentAssignments?.find(
            (studentAssignment) =>
                studentAssignment?.assignment_id === assignmentId
        );
        return studentAssignment?.points_earned || 0;
    };

    const totalEarnedPoints = () => {
        const earnedPoints = courseAssignments?.map((courseAssignment) => {
            const studentAssignment = studentAssignments?.find(
                (studentAssignment) =>
                    studentAssignment?.assignment_id === courseAssignment.assignment_id
            );
            return studentAssignment?.points_earned || 0;
        });
        const sum = earnedPoints?.reduce((acc, curr) => acc + curr, 0);
        return sum || 0;
    };
    
    return (
        <>
            <div class="container-fluid bg-dark ps-5 m-0">
                <div class="btn-group col-4 d-grid-gap-2 d-md-flex">
                    <button
                        class="btn btn-dark"
                        type="button"
                        onClick={() => navigate(`/course/${courseId}/`)}
                    >
                        Course
                    </button>
                    {userType === "teacher" && (
                        <button
                            class="btn btn-dark"
                            type="button"
                            onClick={() =>
                                navigate(`/course/${courseId}/students`)
                            }
                        >
                            Students
                        </button>
                    )}
                    {userType === "teacher" && (
                        <button
                            class="btn btn-dark"
                            type="button"
                            onClick={() =>
                                navigate(`/course/${courseId}/addassignment`)
                            }
                        >
                            New Assignment
                        </button>
                    )}
                </div>
                
            </div>
            <div class="container-fluid bg-gray-600 ps-5 m-0">
                <h3>{course?.description}</h3></div>
            <div class="container-fluid bg-gray-500 ps-5 m-0"><h2>Assignments</h2></div>
            <div class="table-responsive ps-4">
                <table class="table table-hover table-primary" >
                    <thead>
                        <tr>
                            <th>Assignment</th>
                            <th>Description</th>
                            <th>Points Possible</th>
                            {userType === "student" && <th>Points Earned</th>}
                        </tr>
                    </thead>
                    <tbody>
                            {courseAssignments?.map((assignment) => (
                        <tr>
                            <>
                            <td class="text-left" key={assignment.id}>
                                    <NavLink to={`/assignment/${assignment.assignment_id}`} params={courseId} >
                                        {assignment.name}</NavLink></td>
                            <td>{assignment.description}</td>
                                        <td>{assignment.points_possible} </td>
                            <td>{userType === "student" && pointsEarned(assignment.assignment_id)}</td>
                            </>
                                </tr>))}
                        <tr>
                            <td></td>
                            <td class="text-end fw-bold">Total Points Possible:</td>
                            <td>{totalPossiblePoints()}</td>
                            {userType === "student" && <td class="text-s fw-bold">Total Points Earned :
                                {totalEarnedPoints()}</td>}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="container-fluid bg-gray-500 ps-5 col-4"><h2>{userType === "student" &&
                    "Grade:" +
                        (
                            (totalEarnedPoints() / totalPossiblePoints()) *
                            100
                        ).toFixed(1) +
                        "%"}</h2></div>
                

        </>

    );
}
