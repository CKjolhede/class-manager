import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";

export default function CoursesTeacher() {
    const { isLoggedIn, userType , user} = useAuth();
    //const { userType } = useType();
    console.log(userType, isLoggedIn)
    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("/" + userType + "/" + user.id + "/courses");
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
            fetchCourses();
        }, [user.id, userType]);
        
        
    return (
        <>
        <h1>Courses</h1>
        <div classname="courses">
            <ul>
                {courses?.map((course) => (
                    <li key={course.id}>{course.name}</li>
                ))}
                </ul>
        </div>
        </>
    );
}