import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiCreditCard } from 'react-icons/fi';
import { Card, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';

const ParticipantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [participant, setParticipant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchParticipant = async () => {
            try {
                setLoading(true);
                // Verify token first
                await axiosClient.get('/verifyToken');

                // Then fetch participant
                const response = await axiosClient.get(`/participants/${id}`);
                setParticipant(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching participant:', err);
                // Check if the error is authentication related
                if (err.response?.status === 401 || err.response?.status === 403) {
                    // If token verification failed, navigate to login
                    localStorage.removeItem('authToken');
                    navigate('/login', { state: { from: `/tutor/participants/${id}` } });
                } else {
                    // For other errors, display the error message
                    setError(err.response?.data?.message || "Failed to fetch participant details");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchParticipant();
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-4">
                <Link to="/tutor/rooms" className="btn btn-outline-secondary mb-4">
                    <FiArrowLeft className="me-2" /> Back to Rooms
                </Link>
                <Alert variant="danger">
                    <h5>Error</h5>
                    <p>{error}</p>
                    <button
                        className="btn btn-outline-primary mt-2"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </Alert>
            </div>
        );
    }

    if (!participant) {
        return (
            <div className="container py-4">
                <Link to="/tutor/rooms" className="btn btn-outline-secondary mb-4">
                    <FiArrowLeft className="me-2" /> Back to Rooms
                </Link>
                <Alert variant="warning">Participant not found</Alert>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <Link to="/tutor/rooms" className="btn btn-outline-secondary mb-4">
                <FiArrowLeft className="me-2" /> Back to Rooms
            </Link>

            <div className="row">
                <div className="col-md-4">
                    <Card className="mb-4">
                        <Card.Body className="text-center">
                            <div className="bg-primary-light rounded-circle p-4 d-inline-block mb-3">
                                <FiUser size={48} className="text-primary" />
                            </div>
                            <h4>{participant.firstName} {participant.lastName}</h4>
                            <p className="text-muted">Participant</p>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-md-8">
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="card-title">Personal Information</h5>
                            <hr />
                            <div className="row">
                                <div className="col-md-6">
                                    <p>
                                        <FiMail className="me-2 text-primary" />
                                        <strong>Email:</strong> {participant.email}
                                    </p>
                                    <p>
                                        <FiPhone className="me-2 text-primary" />
                                        <strong>Phone:</strong> {participant.phoneNumber}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p>
                                        <FiCalendar className="me-2 text-primary" />
                                        <strong>Birth Date:</strong> {participant.birthDate}
                                    </p>
                                    <p>
                                        <FiCreditCard className="me-2 text-primary" />
                                        <strong>CIN:</strong> {participant.cin}
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Tabs defaultActiveKey="courses" className="mb-3">
                        <Tab eventKey="courses" title="Enrolled Courses">
                            <div className="py-3">
                                {participant.courses && participant.courses.length > 0 ? (
                                    <ul className="list-group">
                                        {participant.courses.map(course => (
                                            <li key={course.id} className="list-group-item">
                                                <h6>{course.name}</h6>
                                                <small className="text-muted">Enrolled: {course.enrollmentDate}</small>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No courses enrolled.</p>
                                )}
                            </div>
                        </Tab>
                        <Tab eventKey="payments" title="Payment History">
                            <div className="py-3">
                                {participant.payments && participant.payments.length > 0 ? (
                                    <ul className="list-group">
                                        {participant.payments.map(payment => (
                                            <li key={payment.id} className="list-group-item">
                                                <div className="d-flex justify-content-between">
                                                    <span>{payment.description}</span>
                                                    <span className="badge bg-success">{payment.amount} MAD</span>
                                                </div>
                                                <small className="text-muted">Date: {payment.date}</small>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No payment history available.</p>
                                )}
                            </div>
                        </Tab>
                        <Tab eventKey="activity" title="Activity">
                            <div className="py-3">
                                {participant.activities && participant.activities.length > 0 ? (
                                    <ul className="list-group">
                                        {participant.activities.map((activity, index) => (
                                            <li key={index} className="list-group-item">
                                                <p>{activity.description}</p>
                                                <small className="text-muted">{activity.date}</small>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No activity records available.</p>
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default ParticipantDetail;