import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar, FiCreditCard } from 'react-icons/fi';
import { Card, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import NavBar from "../../layouts/NavBar";
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";

const ParticipantDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [participant, setParticipant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // First, get all rooms that the tutor has access to
    useEffect(() => {
        const fetchTutorRooms = async () => {
            try {
                const response = await axiosClient.get('/rooms/my-rooms');
                setRooms(response.data);
                // If rooms are found, use the first one for the participant lookup
                if (response.data && response.data.length > 0) {
                    setSelectedRoom(response.data[0].id);
                }
            } catch (err) {
                console.error('Error fetching tutor rooms:', err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('authToken');
                    navigate('/login', { state: { from: `/tutor/participants/${id}` } });
                }
            }
        };

        fetchTutorRooms();
    }, [id, navigate]);

    // Once we have a selected room, find the participant
    useEffect(() => {
        const fetchParticipant = async () => {
            if (!selectedRoom) return;

            try {
                setLoading(true);
                // Use the correct endpoint with roomId
                const response = await axiosClient.get(`/rooms/${selectedRoom}/participants`);

                // Find the participant with the matching ID in the list
                const foundParticipant = response.data.find(p => p.id.toString() === id.toString());

                if (foundParticipant) {
                    setParticipant(foundParticipant);
                    setError('');
                } else {
                    // If not found in this room, check other rooms
                    let found = false;
                    for (const room of rooms) {
                        if (room.id === selectedRoom) continue; // Skip the one we just checked

                        try {
                            const roomResponse = await axiosClient.get(`/rooms/${room.id}/participants`);
                            const participantInRoom = roomResponse.data.find(p => p.id.toString() === id.toString());

                            if (participantInRoom) {
                                setParticipant(participantInRoom);
                                setSelectedRoom(room.id);
                                found = true;
                                break;
                            }
                        } catch (e) {
                            console.error(`Error checking room ${room.id}:`, e);
                        }
                    }

                    if (!found) {
                        setError('Participant not found in any of your rooms');
                    }
                }
            } catch (err) {
                console.error('Error fetching participant:', err);
                // Check if the error is authentication related
                if (err.response?.status === 401 || err.response?.status === 403) {
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

        if (selectedRoom) {
            fetchParticipant();
        }
    }, [id, selectedRoom, navigate, rooms]);

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
                <Alert variant="warning">
                    {rooms.length > 0
                        ? "Participant not found in any of your rooms"
                        : "You don't have access to any rooms yet"}
                </Alert>
            </div>
        );
    }

    return (

        <>
            <NavBar />
            <TutorSideBar />
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

        </>
    );
};

export default ParticipantDetail;