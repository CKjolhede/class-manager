import React from 'react';
import { useAuth } from "../contexts/AuthContext";
//import { useType } from "../contexts/TypeContext";


export default function CoursesTeacher() {
    const { isLoggedIn, userType } = useAuth();
    //const { userType } = useType();


    return (
        <h1>Course</h1>
    );
}