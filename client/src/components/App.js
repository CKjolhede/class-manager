import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Home from "./Home";
import Navbar from "./Navbar";
import Courses from "./Courses";
import Course from "./Course";
import Header from "./Header";
import Login from "./Login";

function App() {
    const { user } = useAuth();


    return (
            <div class="container-fluid ">
                <div class="row bg-dark">
                    <div class="col-12">
                    <Header />
                    </div>
            </div>
            {/*<div class="container-fluid p-0 m-0">*/}
                {/*<div class="row text-bg-primary">*/}
                    <Navbar />
                {/*</div>*/}
            {/*</div>*/}
                        <Routes>
                            <Route path="/course/:courseId/*" element={<Course />} />
                            <Route exact path="/courses/*" element={<Courses />} />
                            <Route path="/*" element={user ? <Home /> : <Navigate to="/login"/>} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
            
            </div>
    );
}
export default App;
