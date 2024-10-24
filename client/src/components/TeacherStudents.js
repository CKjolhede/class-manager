import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import StudentPage from "./StudentPage";


export default function TeacherStudents() {
    const [allStudents, SetAllStudents] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const getAllStudents = async () => {
            try {
                const response = await fetch(`/teacher/${user.id}/students`);
                if (response.ok) {
                    const students = await response.json();
                    SetAllStudents(students);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        getAllStudents();
    }, [user]);

    return (
        <div>
            <h1>All Students</h1>
            <ul>
                {allStudents.map((student) => (
                    <li key={student.id}>
                        <NavLink to={`/studentpage/${student.id}`}>
                            {student.first_name} {student.last_name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}