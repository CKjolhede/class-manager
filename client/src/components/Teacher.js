import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import CoursesTeacher from "./Courses.js";
import Students from "./Students";
import AssignmentsTeacher from "./AssignmentsTeacher.js";
import { Routes, Route } from "react-router-dom";

export default function Teacher() {
    const { user, } = useAuth();

    return (
        <>
        <Routes>
            <Route path="../CoursesTeacher" element={<CoursesTeacher />} />
            <Route path="../Students" element={<Students />} />
            <Route path="../AssignmentsTeacher" element={<AssignmentsTeacher />} />
        </Routes>
            <h1>Teachers</h1>
            <CoursesTeacher />
            <Students />
            <AssignmentsTeacher />
        </>
            );
}