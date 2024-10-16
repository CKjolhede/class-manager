import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useType } from "../contexts/TypeContext";
import { Routes, Route } from "react-router-dom";

export default function LoginTeacher() {
    const { userType } = useType();
    const { user } = useAuth();
    return (
        <h1>Teacher Login</h1>
    );
}