import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from './axiosClient';

const AuthContext = createContext();

// Context Provider Component
export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken') || '');

    // Set token in localStorage and state
    const saveToken = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
    };

    const logout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('authToken');
        window.location.href = '/login'; // or use navigate from react-router
    };

    // Fetch user profile if token exists
    useEffect(() => {
        if (token) {
            axiosClient
                .get('/profile') // Change endpoint if needed
                .then(({ data }) => {
                    setUser(data);
                })
                .catch(() => {
                    logout(); // token invalid or expired
                });
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, setUser, saveToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};
