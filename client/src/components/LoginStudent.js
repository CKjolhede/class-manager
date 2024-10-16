import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useType } from "../contexts/TypeContext";


export default function LoginStudent() {
    const { userType } = useType();
    const { user } = useAuth();

    return (
        <h1>Student Login</h1>
    );
}