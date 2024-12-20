import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";


export default function Sidebar() {
    const { courseId} = useParams();
    const { userType } = useAuth();
    return (
        <div className="sidebar">
            {courseId && userType === "teacher" ? <NavLink to={`/course/${courseId}/students`}>Students</NavLink> : null}<br />
            {courseId && <NavLink to={`/course/${courseId}`}>Course</NavLink>}<br />
            {courseId && <NavLink to={`/course/${courseId}/students`}>Students</NavLink>}<br />
            {courseId && <NavLink to={`/course/${courseId}/assignments`}>Assignments</NavLink>}<br />
        </div>
    );
}