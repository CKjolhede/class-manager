import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useType } from "../contexts/TypeContext";

export default function Teacher() {
    const { isLoggedIn } = useAuth();
    const { userType } = useType();
    console.log(userType, isLoggedIn)
    return (
        <h1>Teachers</h1>
    );
}