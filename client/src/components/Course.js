import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, NavLink, Routes, Route } from "react-router-dom";
import Students from "./Students";
import Assignments from "./Assignments";
import Assignment from "./Assignment";
import CreateAssignment from "./CreateAssignment";

export default function Course() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const { userType } = useAuth();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const url = `/courses/${courseId}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json()
                    setCourse({
                        description: data[0].description,
                        id: data[0].id,
                        name: data[0].name,
                        teacher_id: data[0].teacher_id,
                        teacher_name: data[1]
                    });
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchCourse();
    }, [courseId]);
    
    if (!course) {
        return <div>Loading...</div>;
    }
    

    return (
        <>
            <Routes>
                <Route path="/assignments/* " element={<Assignments />} />
                <Route
                    path="/addassignment"
                    element={<CreateAssignment />}
                />
                <Route path="/assignment/:assignmentId/*" element={<Assignment />} />
            </Routes>
            <div>
                <h1>{course.id} - {course.description}</h1>
                <h2>Teacher: {course.teacher_name}</h2>
                <NavLink to={`/course/${courseId}/assignments`}>
                    Assignments </NavLink>


                {userType === "teacher" ? (
                    <>
                    <NavLink to={`/course/${courseId}/addassignment`}>
                        New Assignment </NavLink><br />
                    <NavLink to={`/course/${courseId}/students`}>
                        Students </NavLink>
                    {/*<Routes>
                        <Route path="/students/*" element={<Students />}/>
                    </Routes>*/}
                    </>
                ) : null}
            </div>
        </>
    );
}
