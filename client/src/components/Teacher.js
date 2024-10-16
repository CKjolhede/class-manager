import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useType } from "../contexts/TypeContext";
import { useNavigate } from "react-router-dom";

export default function Teacher() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { userType } = useType();
    console.log(userType, isLoggedIn)
    
        if (userType !== "teacher") {
            return navigate("/unauthorized")
        }
    return (
        <h1>Teachers</h1>
    );
}