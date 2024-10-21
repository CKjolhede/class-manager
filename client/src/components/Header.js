import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
    const { logout, user, userType } = useAuth();

    return (
        <div className="header">
            <h1 >{userType === "teacher" ? user.name : userType === "student" ?  user.first_name + " " + user.last_name  : "Class Manager"}</h1>
            <NavLink style={{  fontSize: "30px", paddingRight: "10em" }} to="/" onClick={logout}>
                Logout
            </NavLink>
        </div>
    );
}