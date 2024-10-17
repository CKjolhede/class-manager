import React, { useContext, useEffect, useState, createContext, } from "react";
import Cookies from "js-cookie";

const TypeContext = createContext();

export const useType = () => useContext(TypeContext);

export const TypeProvider = ({ children }) => {
    const [userType, setUserType] = useState(null);
        useEffect(() => {
            const checkType = async () => {
                const user_type = Cookies.get("user_type");

                setUserType(user_type);
            }; checkType();
        }, []);
    return (
        <TypeContext.Provider value={{userType}}>
            {children}
        </TypeContext.Provider>
    );
};