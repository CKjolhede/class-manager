import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Home from "./Home";
import Header from "./Header";
import Login from "./Login";

function App() {
    const { user } = useAuth();
    

    return (
            <div class="container-fluid-xlg ">
                <div class="row ">
                    <div class="col-12">
                    <Header />
                    </div>
            
                <Routes>
                    <Route path="/*" element={user ? <Home /> : <Navigate to="/login"/>} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </div>
    );
}
export default App;
