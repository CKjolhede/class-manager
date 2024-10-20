import React from 'react';
import { useAuth } from '../contexts/AuthContext';


export default function Student() {
    const { userType } = useAuth();
    console.log(userType)
    
    
    
    
    
    
    return (
        <h1>Student</h1>
    );
}