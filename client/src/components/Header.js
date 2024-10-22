import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
    const {user, userType } = useAuth();

    return (
        <>
            <div class="row text-bg-dark">
                <div class="col-10">
                    <h1 textcolor="red">Class Manager</h1>
                </div>
                <div class="col-6" >
                    <h2 >{userType === "teacher" ? user.name : userType === "student" ?  user.first_name + " " + user.last_name : "."}</h2>
                </div>
            </div>
        </>
        );
}