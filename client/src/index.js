import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";
import "./styles.css";
import "./custom.css";

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
