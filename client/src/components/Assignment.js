import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useType } from "../contexts/TypeContext";
import { useNavigate } from "react-router-dom";


export default function Assignment() {
    const { isLoggedIn } = useAuth();
    //const { userType } = useType();
    const navigate = useNavigate();
    
    return (
        <h1>Assignment</h1>
    );
}