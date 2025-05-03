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
            const response = await axiosClient.post('/login', { email, password });
            const token = response.data;

            localStorage.setItem('authToken', token);

            const verifyResponse = await axiosClient.get('/verifyToken', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userRole = verifyResponse.data.role;

            if (userRole === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (userRole === 'TUTOR') {
                navigate('/tutor/TutorDashboard');
            }
            else if (userRole === 'PARTICIPANT') {
                navigate('/participant/dashboard');
            } else {
                navigate('/unauthorized', {
                    state: {
                        from: location.pathname,
                        requiredRole: 'ADMIN or TUTOR or PARTICIPANT',
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
        <section className="login-content">
            <div className="container">
                <div className="row align-items-center justify-content-center height-self-center">
                    <div className="col-lg-8">
                        <div className="card auth-card">
                            <div className="card-body p-0">
                                <div className="d-flex align-items-center auth-content">
                                    <div className="col-lg-7 align-self-center">
                                        <div className="p-3">
                                            <h2 className="mb-2">Sign In</h2>
                                            <p>Login to stay connected.</p>
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="floating-label form-group">
                                                            <input
                                                                className="floating-input form-control"
                                                                type="email"
                                                                placeholder=" "
                                                                id="email"
                                                                required
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                disabled={isLoading}
                                                            />
                                                            <label>Email</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <div className="floating-label form-group">
                                                            <input
                                                                className="floating-input form-control"
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder=" "
                                                                id="password"
                                                                required
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                disabled={isLoading}
                                                            />
                                                            <label>Password</label>
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
                                                    <div className="col-lg-6">
                                                        <div className="custom-control custom-checkbox mb-3">
                                                            <input
                                                                type="checkbox"
                                                                className="custom-control-input"
                                                                id="customCheck1"
                                                                disabled={isLoading}
                                                            />
                                                            <label className="custom-control-label control-label-1" htmlFor="customCheck1">Remember Me</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <a href="auth-recoverpw.html" className="text-primary float-right">Forgot Password?</a>
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                                </button>
                                                <p className="mt-3">
                                                    Create an Account <a href="auth-sign-up.html" className="text-primary">Sign Up</a>
                                                </p>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-lg-5 content-right">
                                        <img src="../assets/images/login/01.png" className="img-fluid image-right" alt="Login illustration" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginForm;