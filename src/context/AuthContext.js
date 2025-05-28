import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    name: decoded["name"],
                    email: decoded["email"],
                    image: decoded["image"],
                    token
                });
            } catch (e) {
                console.error("Invalid token", e);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        setUser({
            name: decoded["name"] ?? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? "",
            email: decoded["email"] ?? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ?? "",
            image: decoded["email"] ?? decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ?? "",
            token
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
