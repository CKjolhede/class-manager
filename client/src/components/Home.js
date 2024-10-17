import React from 'react';
import { Routes, Route } from "react-router-dom";
import Courses from "./Courses.js";
import Course from "./Course.js";


export default function Home() {
    return (
        <>
        <Routes>
            <Route exact path="/course/:courseId" element={<Course />} />
            <Route exact path="/courses/*" element={<Courses />} />
        </Routes>
            
    </>
            );
}