import React from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useAuth  } from "../contexts/AuthContext";

export default function Navbar() {
    const { logout, isLoggedIn, userType } = useAuth();
    const { courseId } = useParams();
    const navigate = useNavigate();
    return (
        <>
            {isLoggedIn === true && (
                <div class="navbar bg-grad-b2w w-100%">
                    <div class="container-fluid justify-content-start pe-5 me-5 ">
                        <div class="btn-group ">
                            <button type="button" class="btn btn-primary " onClick={() => navigate('/courses')}>Courses</button>
                            {userType === "teacher" && (
                                <button type="button" class="btn btn-primary" onClick={() => navigate("/teacherstudents")} >
                                        All Students
                                </button>
                            )}
                            <button
                                type="button"
                                class="btn btn-primary text-bg-warning "
                                onClick={logout}>
                                Logout
                                </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
