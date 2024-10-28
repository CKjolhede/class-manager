import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { NavLink } from 'react-router-dom';
import portfolio from '../assets/img/portfolio-2.jpg'
import masthead from '../assets/img/bg-masthead.jpg'

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
                <img
                    src={portfolio}
                    class="img-fluid w-100 h-auto overflow-hidden position-absolute"
                    alt="portfolio"
                />
                <div class="row ps-1 m-5 position-relative">
                        {courses?.map((course) => (
                            <div class="col-2 p-0 m-0 ">
                            <>
                                <div class="card-group mt-3 ms-5">
                                    <div class="card">
                                        <img
                                            class="card-img"
                                            style={{ width: "100%", height: "auto" }}
                                            src={masthead}
                                            alt="Card cap"
                                        />
                                        <div class="card-img-overlay">
                                            <h4 class="card-title position-absolute translate-middle top-50 start-50">
                                                
                                                <NavLink
                                                    to={
                                                        "../course/" + course.id
                                                    }
                                                    params={{
                                                        courseId: course.id,
                                                    }}
                                                >
                                                    {course.description}
                                                </NavLink>
                                            </h4>
                                        </div>
                                    </div>
                                    
                                </div>
                    
                            </>
                    </div>
                        ))}
                </div>
            </div>
        </>
    );
}