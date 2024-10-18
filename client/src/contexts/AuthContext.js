import React, { useContext, useState, createContext, useEffect, } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState({ isLoggedIn: false, user: null });

    useEffect(() => {
        const checkAuth = async () => {
            const response = await fetch("/authorized")
            if (response.ok) {
                const data = await response.json();
                setAuth({ isLoggedIn: true, user: data });
            } else {
                setAuth({ isLoggedIn: false, user: null });
            }
        };
        checkAuth();
    }, []);
    
    const login = (user) => {
        setAuth({ isLoggedIn: true, user });
        console.log("at login", user)
        navigate("/");
    };

    const logout = async () => {
        const response = await fetch("/logout", { method: "DELETE" });
        
        if (response.ok) {
            setAuth({ isLoggedIn: false, user: null });
            navigate("/");
        }
    
    };
    
    return (
        <AuthContext.Provider value={{ auth, isLoggedIn: auth.isLoggedIn, userType: auth.user?.userType, user: auth.user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};