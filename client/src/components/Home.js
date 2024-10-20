import React from 'react';
import { Routes, Route } from "react-router-dom";
import Courses from "./Courses.js";
import Course from "./Course.js";
import CreateAssignment from "./CreateAssignment.js";
//import Header from "./Header.js";
//import Students from "./Students.js";
import Sidebar from "./Sidebar.js";
import Assignments from "./Assignments.js";
import TeacherStudents from "./TeacherStudents.js";

export default function Home() {

    return (
        <>

            <Sidebar />

            <Routes>
                <Route exact path="/courses/*" element={<Courses />} />
                <Route path="course/:courseId/*" element={<Course />} />
                <Route
                    path="/course/:courseId/assignments/*"
                    element={<Assignments />}/>


                <Route path="/teacherstudents" element={<TeacherStudents />} />
            </Routes>
        </>
    );
}