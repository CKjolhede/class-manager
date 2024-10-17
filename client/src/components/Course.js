import React, { useState, useEffect } from "react";
//import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";

export default function Course() {
    
    const { courseId } = useParams();
    console.log("courseId", courseId)
    const [course, setCourse] = useState(null);
    console.log("course", course)
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const url = `/courses/${courseId}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json()
                    console.log("fetched course", data)
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
    console.log('right before returning course', course.description)
    return (
        <div>
            <ul>
            <li style={{ color: "red" }}>{course.description}</li>
            {course.id }
            {course.teacher_name}
            {course.teacher_id }
        </ul></div>
    );
}
