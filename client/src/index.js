import React from "react";
import App from "./components/App";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <Router>
        <AuthProvider>
                <Routes>
                    <Route path="/*" element={<App />} />
                </Routes>
        </AuthProvider>
    </Router>
    );
