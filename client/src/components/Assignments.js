import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams, NavLink } from "react-router-dom";

export default function Assignments({ fetchStudentAssignments, fetchCourseAssignments, studentAssignments, courseAssignments, totalPossiblePoints, pointsEarned, totalEarnedPoints }) {
    const { user, userType } = useAuth();
    const { courseId } = useParams();

    useEffect(() => {
        fetchStudentAssignments(user);
        fetchCourseAssignments(courseId);
    }, [user, courseId]);

    return (
        <>
            {userType === "teacher" && (
                <NavLink to={"/course/" + courseId + "/addassignment"}>
                    New Assignment
                </NavLink>
            )}
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
                            {userType === "student" &&
                                pointsEarned(assignment.id) + "points earned"}
                        </ul>
                    </li>
                ))}
                <li>
                    {userType === "student" &&
                        "Total earned points:" + totalEarnedPoints()}
                </li>
                <li>Total possible points: {totalPossiblePoints()}</li>
                <li>
                    {userType === "student" &&
                        "Grade:" +
                            (
                                (totalEarnedPoints() / totalPossiblePoints()) *
                                100
                            ).toFixed(1) +
                            "%"}
                </li>
            </ul>
        </>
    );
}
