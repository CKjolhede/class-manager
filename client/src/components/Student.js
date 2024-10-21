import React from 'react';
import { useAuth } from '../contexts/AuthContext';


export default function Student({courseAssignments, studentAssignments}) {
    const { userType } = useAuth();
    console.log('student courseAssignments', courseAssignments)
    console.log('student studentAssignments', studentAssignments)
    
    
    
    
    
    
    return (
        <h1 style={{float: "right"}}>Student</h1>
    );
}