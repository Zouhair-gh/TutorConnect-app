    import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import './LoginForm.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // 1. Make login request
            const response = await axiosClient.post('/login', { email, password });
            const token = response.data;

            // 2. Store token
            localStorage.setItem('authToken', token);

            // 3. Verify token to get user role
            const verifyResponse = await axiosClient.get('/verifyToken', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userRole = verifyResponse.data.role;

            // 4. Redirect based on role
            if (userRole === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (userRole === 'TUTOR') {
                navigate('/tutor/TutorDashboard');
            } else {
                navigate('/unauthorized', {
                    state: {
                        from: location.pathname,
                        requiredRole: 'ADMIN or TUTOR',
                        userRole
                    }
                });
            }

        } catch (error) {
            setError('Invalid email or password');
            console.error('Login error:', error.response?.data || error.message);
            localStorage.removeItem('authToken');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <h2>Welcome Back</h2>
                <p>Sign in to your account</p>
                {error && <p className="error-message">{error}</p>}
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-container">
                        <span className="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </span>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-container">
                        <span className="input-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </span>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                    <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <div className="remember-me">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            disabled={isLoading}
                        />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button
                    type="submit"
                    className={`login-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    <span className="button-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" x2="3" y1="12" y2="12" />
                        </svg>
                    </span>
                    {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            <div className="signup-link">
                <p>Don't have an account? <a href="#">Sign up</a></p>
            </div>
        </div>
    );
};

export default LoginForm;