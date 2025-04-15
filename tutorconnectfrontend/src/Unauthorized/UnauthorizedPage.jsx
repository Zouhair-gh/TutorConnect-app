import { useLocation, useNavigate } from 'react-router-dom';
import './UnauthorizedRedirect.css';

const UnauthorizedPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { from, requiredRole, userRole } = location.state || {};

    return (
        <div className="unauthorized-page">
            <div className="unauthorized-card">
                <div className="unauthorized-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <h1>Access Restricted</h1>
                <p className="unauthorized-message">
                    You don't have permission to access this resource.
                </p>

                <div className="access-details">
                    <div className="detail-item">
                        <span className="detail-label">Attempted to access:</span>
                        <span className="detail-value">{from || 'Unknown location'}</span>
                    </div>
                    {requiredRole && (
                        <div className="detail-item">
                            <span className="detail-label">Required role:</span>
                            <span className="detail-value role-badge required">{requiredRole}</span>
                        </div>
                    )}
                    {userRole && (
                        <div className="detail-item">
                            <span className="detail-label">Your role:</span>
                            <span className="detail-value role-badge current">{userRole}</span>
                        </div>
                    )}
                </div>

                <div className="action-buttons">
                    <button
                        onClick={() => navigate(-1)}
                        className="action-btn back-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="action-btn home-btn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                        </svg>
                        Go Home
                    </button>
                    {!userRole && (
                        <button
                            onClick={() => navigate('/login', { state: { from } })}
                            className="action-btn login-btn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                            </svg>
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;