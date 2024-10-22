import React from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import Home from "./Home";

export default function Navbar() {
    const { logout, isLoggedIn, userType } = useAuth();
    return (
        <>{isLoggedIn === true && (
            <nav class="navbar navbar">
                <div class="container-fluid p-s-1 m-0 ">
                    <div class="navbar nav">
                        {/*<button
                            type="button"
                            class="btn btn-secondary text-bg-dark">
                            <NavLink to="/home">Home</NavLink>
                            </button>*/}
                        <button
                            type="button"
                            class="btn btn-secondary text-bg-warning"><NavLink to="/courses">Courses</NavLink>
                        </button>
                        {userType === "teacher" && (
                            < button
                                type="button"
                                class="btn btn-secondary text-bg-warning" >
                                <NavLink to={'/teacherstudents'}>All Students</NavLink>
                            </button>)}
                        <button
                            type="button"
                            class="btn btn-secondary text-bg-warning">
                            <NavLink to="/assignments">Assignments</NavLink>
                        </button>
                        <button
                            type="button"
                            class="btn btn-secondary text-bg-warning"
                            onClick={logout}>
                            Logout
                        </button>
        
                    </div>
                </div>
            </nav>
        )}
        </>
    );
}
