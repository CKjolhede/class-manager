import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
    const {user,isLoggedIn,logout, userType } = useAuth();
    const navigate = useNavigate();
    
    return (
        <>
            <div class="row text-white bg-grad-db2b">
                <div class="col-12 ps-5">
                    <h1 class="text-white">Class Manager</h1>
                </div>
                <div class="row">
                        <h2 class="col-5 ps-5 ms-5">
                            {userType === "teacher"
                                ? user.name
                                : userType === "student"
                                ? user.first_name + " " + user.last_name
                                : "."}
                        </h2>

                    {isLoggedIn === true && (
                        <> <div class="col-4"></div>
                                <div class="btn-group col-2 pe-0 me-0">
                                    <button
                                        type="button"
                                        class="btn  btn-primary btn-bg-darkblue"
                                        onClick={() => navigate("/courses")}
                                    >
                                        Courses
                                    </button>
                                    {userType === "teacher" && (
                                        <button
                                            type="button"
                                            class="btn btn-primary"
                                            onClick={() =>
                                                navigate("/teacherstudents")
                                            }
                                        >
                                            All Students
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        class="btn btn-primary btn-warning "
                                        onClick={logout}
                                    >
                                        Logout
                                </button>
                                </div>
                            
                    </>
                )}
                </div>
            </div>
        </>
    );
}