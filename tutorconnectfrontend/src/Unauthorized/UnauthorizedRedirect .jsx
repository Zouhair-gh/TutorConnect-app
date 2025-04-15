// UnauthorizedRedirect.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import './UnauthorizedRedirect.css';

const UnauthorizedRedirect = ({ requiredRole = null, children }) => {
    const [authStatus, setAuthStatus] = useState({
        loading: true,
        isAuthenticated: false,
        isAuthorized: false,
        userRole: null
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                setAuthStatus(prev => ({ ...prev, loading: false, isAuthenticated: false }));
                return;
            }

            try {
                const response = await axiosClient.get('/verifyToken', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userRole = response.data.role;
                const isAuthorized = requiredRole ? userRole === requiredRole : true;

                setAuthStatus({
                    loading: false,
                    isAuthenticated: true,
                    isAuthorized,
                    userRole
                });

                if (!isAuthorized) {
                    navigate('/unauthorized', {
                        state: {
                            from: location.pathname,
                            requiredRole,
                            userRole
                        }
                    });
                }
            } catch (error) {
                localStorage.removeItem('authToken');
                setAuthStatus(prev => ({ ...prev, loading: false, isAuthenticated: false }));
                navigate('/login', { state: { from: location.pathname } });
            }
        };

        verifyAuth();
    }, [navigate, location, requiredRole]);

    if (authStatus.loading) {
        return (
            <div className="auth-loader-container">
                <div className="auth-loader">
                    <div className="auth-spinner"></div>
                    <p>Verifying your access...</p>
                </div>
            </div>
        );
    }

    if (!authStatus.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname }} />;
    }

    if (!authStatus.isAuthorized) {
        return <Navigate to="/unauthorized" state={{
            from: location.pathname,
            requiredRole,
            userRole: authStatus.userRole
        }} />;
    }

    return children;
};

export default UnauthorizedRedirect;