import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import Home from "./Home";
import Courses from "./Courses.js";
import Header from "./Header";

function App() {
    const { user } = useAuth();


    return (
        <>
            <Header />
            {user ? (
                <>
                <Routes>
                    <Route exact path="/*" element={<Home />} />
                </Routes>
            {/*<Courses />*/}
                </>
            ) : (
                <Routes>
                    <Route path="/" element={<Login />} />
                </Routes>
        )}
        
        </>
    );
}
export default App;
