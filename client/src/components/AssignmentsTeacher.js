import React from 'react';
import { useAuth } from "../contexts/AuthContext";
//import { useType } from "../contexts/TypeContext";


export default function AssignmentsTeacher() {
    const { isLoggedIn, userType } = useAuth();
    //const { userType } = useType();

    
        //if (userType !== "teacher") {
        //    return navigate("/unauthorized")
        //}
    return (
        <h1>Assignments Teacher</h1>
    );
} 


