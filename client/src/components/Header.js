import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
    const { logout, user, userType } = useAuth();

    return (
        <div className="header">
            <h1 style={{ float: "left" }}>Header</h1>
            {/*<h1 style={{ float: "left", color: "red" }}></h1>*/}
            <NavLink style={{ float: "right", fontSize: "20px", paddingRight: "10em" }} to="/" onClick={logout}>
                Logout
            </NavLink>
        </div>
    );
}