import React from 'react';
import { useParams } from 'react-router-dom';

const SessionPreJoin = ({ session, user, onRefresh }) => {
    const { sessionId } = useParams();
    const isTutor = user?.role === 'TUTOR' || user?.role === 'ROLE_TUTOR' || user?.role === 'ADMIN';

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">Waiting Room</h3>
                        </div>
                        <div className="card-body text-center">
                            <div className="mb-4">
                                <i className="bi bi-clock-history" style={{ fontSize: '4rem', color: '#0d6efd' }}></i>
                                <h4 className="mt-3">
                                    {isTutor
                                        ? "You can start the session when ready"
                                        : "Waiting for the tutor to start the session"}
                                </h4>
                                <p className="text-muted">
                                    Session: <strong>{session?.title || `Session #${sessionId}`}</strong>
                                </p>
                            </div>

                            <div className="session-info mb-4">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <h6 className="card-title">Tutor</h6>
                                                <p className="card-text">
                                                    {session?.tutorName || 'Tutor name not available'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <h6 className="card-title">Scheduled Time</h6>
                                                <p className="card-text">
                                                    {new Date(session?.date).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="actions mt-4">
                                <button
                                    className="btn btn-primary me-2"
                                    onClick={onRefresh}
                                >
                                    <i className="bi bi-arrow-clockwise me-2"></i>
                                    Refresh Status
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => window.location.href = '/dashboard'}
                                >
                                    <i className="bi bi-box-arrow-left me-2"></i>
                                    Exit Waiting Room
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionPreJoin;