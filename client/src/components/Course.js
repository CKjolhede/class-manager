import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, NavLink, Routes, Route } from "react-router-dom";
import Students from "./Students";
import Assignments from "./Assignments";
import Assignment from "./Assignment";

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
    console.log ("course usertype:", userType)
    return (
        <>
        <div>
            <h1 style={{ paddingTop: "2.5em" }}>{course.id} - {course.description}</h1>
            <h2>Teacher: {course.teacher_name}</h2>

        <NavLink to={`/course/${courseId}/assignments`}>Assignments</NavLink>
            <Routes>    
                    <Route exact path="/assignments/* " element={<Assignments />} />
                    <Route exact path="/assignment/:assignmentId/*" element={<Assignment />} />
            </Routes>
            <Assignments />
                    <br />

        {userType === "teacher" ?
            <>
            <NavLink to={`/course/${courseId}/students`}>Students</NavLink>
                    <Routes>
                        <Route exact path="/students/*" element={<Students />} />
                        </Routes>
                </> : null
            }

        </div>
        </>
    );
}
