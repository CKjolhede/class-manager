import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams, NavLink } from "react-router-dom";

export default function AssignmentsTeacher() {
    const { user, userType } = useAuth();
    const { courseId } = useParams();
    const [courseAssignments, setCourseAssignments] = useState([]);
    const [studentAssignments, setStudentAssignments] = useState([]);

    
    useEffect(() => {
        const fetchStudentAssignments = async () => {
        try {
            const response = await fetch(`/student/${user.id}/studentassignments`);
            if (response.ok) {
                const data = await response.json();
                setStudentAssignments(data);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        }; fetchStudentAssignments();
    }, [user]);


    useEffect(() => {
        const fetchCourseAssignments = async () => {
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
        fetchCourseAssignments();
    }, [courseId]);
    
    //useEffect(() => {
    //    const fetchStudentCourseAssignments = async () => {
    //        try {
    //            const response = await fetch(`/course/${courseId}/studentassignments/${user.id}`);
    //            if (response.ok) {
    //                const data = await response.json();
    //                setStudentCourseAssignments(data);
    //            }
    //        } catch (error) {
    //            console.error("Error:", error);
    //        }
    //    }
        
    //    fetchStudentCourseAssignments();
    //}, [courseId, user.id]);
    
    
    const pointsEarned = (assignmentid) => {
        const studentAssignment = studentAssignments?.find(
            (studentAssignment) => studentAssignment?.assignment_id === assignmentid
        );
        return studentAssignment?.points_earned || 0;
    };
    
    const totalPossiblePoints = () => {
        const totalPoints = courseAssignments?.map(
            (assignment) => assignment.points_possible
        );
        const sum = totalPoints?.reduce((acc, curr) => acc + curr, 0);
        return sum || 0;
    }
        
    const totalEarnedPoints = () => {
        const earnedPoints = courseAssignments?.map((courseAssignment) => {
            const studentAssignment = studentAssignments?.find(
                (studentAssignment) => studentAssignment?.assignment_id === courseAssignment.id
            );
            return studentAssignment?.points_earned || 0;
        });
        const sum = earnedPoints?.reduce((acc, curr) => acc + curr, 0);
        return sum || 0;
    };
    


    return (
        <>
            {userType === "teacher" && <NavLink to={"/course/" + courseId + "/addassignment"}>New Assignment</NavLink>}
            <ul>
                {courseAssignments?.map((assignment) => (
                    <li key={assignment.id}>
                        <NavLink
                            to={`/course/${courseId}/assignment/${assignment.id}`}
                        >
                            {assignment.name}
                        </NavLink>
                        <ul>
                            <li>
                                {assignment.points_possible} points possible{" "}
                            </li>
                            {userType === "student" && pointsEarned(assignment.id) + "points earned" }
                        </ul>
                    </li>
                ))}
                <li>{userType === "student" && "Total earned points:" + totalEarnedPoints()}</li>
                <li>Total possible points: {totalPossiblePoints()}</li>
                <li>{userType === "student" && ("Grade:" + (totalEarnedPoints() / totalPossiblePoints() * 100).toFixed(1) + "%")}</li>
            </ul>
        </>
    );
}
