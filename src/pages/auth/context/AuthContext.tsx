// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axiosInstance from 'src/shared/utils/axios.config';
import { useNavigate } from 'react-router-dom';

// Define AuthContext interface
interface AuthContextProps {
    isAuthenticated: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

// Create AuthContext
const AuthContext = createContext<AuthContextProps>({
    isAuthenticated: false,
    token: null,
    login: async () => { },
    logout: () => { },
});

// useAuth hook for consuming AuthContext

// AuthProviderProps interface for props passed to AuthProvider component
interface AuthProviderProps {
    children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/sign-in');
        }
    }, [token, navigate]);

    const login = async (email: string, password: string) => {
        const response = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (data.token) {
            setToken(data.token);
            localStorage.setItem('token', data.token);
            navigate('/Home');

        }
    };



    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        navigate('/sign-in');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
