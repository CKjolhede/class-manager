import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
    const { logout, user, userType } = useAuth();

    return (
        <div className="header">
            {/*<h1 style={{ float: "left" }}>Class Manager</h1>*/}
            <h1 style={{ float: "left" }}>{userType === "teacher" ? user.name : userType === "student" ?  user.first_name + " " + user.last_name  : "Class Manager"}</h1>
            <NavLink style={{ float: "right", fontSize: "20px", paddingRight: "10em" }} to="/" onClick={logout}>
                Logout
            </NavLink>
        </div>
    );
}