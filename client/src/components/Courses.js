import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { NavLink, Routes, Route, useParams } from 'react-router-dom';


export default function Courses() {
    const { userType, user } = useAuth();
    const params = useParams();

    const [courses, setCourses] = useState([]);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                let url = "/" + userType + "/" + user.id + "/courses";
                const response = await fetch(url);
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
            <div className="courses">
                <ul>
                    {courses?.map((course) => (
                        <li key={course.id}>
                            <NavLink to={"../course/" + course.id} params={{courseId: course.id}}>
                                {course.description}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}