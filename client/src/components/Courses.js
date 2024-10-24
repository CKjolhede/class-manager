import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { NavLink } from 'react-router-dom';

export default function Courses() {
    const { userType, user } = useAuth();
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
            <div class="container-fluid p-0 m-0 ">
                <div class="row  ps-1 m-0 w-100%">
                    <ul class="list-group ps-5 col-3 p-0 m-0">
                        {courses?.map((course) => (
                            <li key={course.id}>
                                <NavLink
                                    to={"../course/" + course.id}
                                    params={{ courseId: course.id }} >
                                    {course.description}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}