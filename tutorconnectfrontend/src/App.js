import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axiosClient  from "./api/axiosClient";
// Pages & Components
import DashIndex from "./components/DashIndex";
import Index from "./Website/components/Index";
import LoginForm from "./registration/LoginForm";
import UnauthorizedPage from "./Unauthorized/UnauthorizedPage";

// Auth Context (optional but recommended for larger apps)
const AuthContext = React.createContext();

const ProtectedAdminRoute = ({ children }) => {
    const [auth, setAuth] = useState({ loading: true, isValid: false, isAdmin: false });
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axiosClient.get('/verifyToken');
                setAuth({
                    loading: false,
                    isValid: true,
                    isAdmin: response.data.role === 'ADMIN'
                });
            } catch (error) {
                localStorage.removeItem('authToken');
                setAuth({ loading: false, isValid: false, isAdmin: false });
                navigate('/login');
            }
        };

        verifyToken();
    }, [navigate]);

    if (auth.loading) return <div>Loading...</div>;
    if (!auth.isValid) return <Navigate to="/login" />;
    if (!auth.isAdmin) return <Navigate to="/" />;

    return children;
};
function App() {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        isAdmin: false,
        loading: true,
        user: null
    });

    const verifyAuth = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            setAuthState({
                isAuthenticated: false,
                isAdmin: false,
                loading: false,
                user: null
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/verifyToken", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setAuthState({
                    isAuthenticated: true,
                    isAdmin: userData.role === "ADMIN",
                    loading: false,
                    user: userData
                });
            } else {
                localStorage.removeItem("authToken");
                setAuthState({
                    isAuthenticated: false,
                    isAdmin: false,
                    loading: false,
                    user: null
                });
            }
        } catch (error) {
            console.error("Auth verification error:", error);
            setAuthState({
                isAuthenticated: false,
                isAdmin: false,
                loading: false,
                user: null
            });
        }
    };

    useEffect(() => {
        verifyAuth();
    }, []);

    const login = (token) => {
        localStorage.setItem("authToken", token);
        verifyAuth(); // Re-verify auth state
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            loading: false,
            user: null
        });
    };

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            logout
        }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route
                        path="/login"
                        element={<LoginForm />}
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedAdminRoute>
                                <DashIndex />
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route
                        path="/unauthorized"
                        element={
                        <UnauthorizedPage />

                        }
                    />
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;