import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';

const SessionSummary = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axiosClient.get(`/sessions/${sessionId}`);
                setSession(response.data);
            } catch (error) {
                console.error('Error fetching session:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [sessionId]);

    if (loading) {
        return <div className="container mt-5 text-center">Loading session summary...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h3 className="mb-0">Session Completed</h3>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                                <h4 className="mt-3">Thank you for your participation!</h4>
                            </div>

                            <div className="session-details mb-4">
                                <h5>Session Details</h5>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <strong>Title:</strong> {session?.title || `Session #${sessionId}`}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Date:</strong> {new Date(session?.date).toLocaleString()}
                                    </li>
                                    <li className="list-group-item">
                                        <strong>Duration:</strong> {session?.duration || 'N/A'} minutes
                                    </li>
                                </ul>
                            </div>

                            <div className="next-steps">
                                <h5>Next Steps</h5>
                                <div className="list-group">
                                    <button
                                        className="list-group-item list-group-item-action"
                                        onClick={() => navigate(`/sessions/${sessionId}/feedback`)}
                                    >
                                        <i className="bi bi-chat-square-text me-2"></i>
                                        Provide Feedback
                                    </button>
                                    <button
                                        className="list-group-item list-group-item-action"
                                        onClick={() => navigate(`/sessions/${sessionId}/resources`)}
                                    >
                                        <i className="bi bi-folder me-2"></i>
                                        Access Session Resources
                                    </button>
                                    <button
                                        className="list-group-item list-group-item-action"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        <i className="bi bi-house me-2"></i>
                                        Return to Dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionSummary;