import React from 'react';
import { useAuth } from '../contexts/AuthContext';
//import { useType } from '../contexts/TypeContext';
import { Routes, Route } from "react-router-dom";

export default function Student() {
    const { isLoggedIn, userType } = useAuth();
    //const { userType } = useType();
    console.log(userType, isLoggedIn)
    return (
        <h1>Student</h1>
    );
}