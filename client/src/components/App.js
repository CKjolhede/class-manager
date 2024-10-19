import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import Home from "./Home";
//import Courses from "./Courses";
//import Course from "./Course";
import Header from "./Header";
import Sidebar from "./Sidebar";

function App() {
    const { user } = useAuth();


    return (
        <>
            <Header />
                <br />
            <Routes>
                {/*<Route path="/course/:courseId/*" element={<Course />} />*/}
                {/*<Route exact path="/courses/*" element={<Courses />} />*/}
                {/*<Route path="/*" element={user ? <Home /> : <Navigate to="/login"/>} />*/}
                <Route path="/*" element={user ? <Home /> : <Navigate to="/login" />}/>
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    
    );
}
export default App;
