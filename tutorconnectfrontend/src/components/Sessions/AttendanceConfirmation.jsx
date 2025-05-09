import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Badge, Button, Card, ListGroup } from 'react-bootstrap';
import { FiCheckCircle, FiUser, FiCalendar, FiClock } from 'react-icons/fi';


const AttendanceConfirmation = () => {
    const { roomId } = useParams();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axiosClient.get(`/sessions/room/${roomId}/upcoming`);
                setSessions(response.data);
            } catch (error) {
                console.error("Error fetching sessions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, [roomId]);

    const handleConfirmAttendance = async (sessionId) => {
        try {
            const response = await axiosClient.post(
                `/sessions/${sessionId}/confirm-attendance`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    withCredentials: true
                }
            );

            setSessions(sessions.map(s =>
                s.id === sessionId ? {
                    ...s,
                    confirmedAttendees: s.confirmedAttendees + 1,
                    isConfirmed: true
                } : s
            ));

        } catch (error) {
            console.error("Full error:", {
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });

            if (error.response?.status === 403) {
                alert("Please refresh the page and try again. If the problem persists, log out and log back in.");
            } else {
                alert("Error confirming attendance. Please try again.");
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>

        <div className="container py-4">
            <h2 className="mb-4">Confirm Your Attendance</h2>

            {loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : sessions.length === 0 ? (
                <div className="alert alert-info">No upcoming sessions in this room</div>
            ) : (
                <div className="row g-4">
                    {sessions.map(session => (
                        <div key={session.id} className="col-md-6">
                            <Card className="h-100 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <Card.Title>{session.title}</Card.Title>
                                        <Badge bg={session.status === 'SCHEDULED' ? 'primary' : 'warning'}>
                                            {session.status}
                                        </Badge>
                                    </div>

                                    <ListGroup variant="flush" className="mb-3">
                                        <ListGroup.Item>
                                            <FiCalendar className="me-2" />
                                            {formatDate(session.startTime)}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <FiClock className="me-2" />
                                            {session.sessionType}
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <FiUser className="me-2" />
                                            {session.confirmedAttendees} confirmed attendees
                                        </ListGroup.Item>
                                    </ListGroup>

                                    <Button
                                        variant="success"
                                        onClick={() => handleConfirmAttendance(session.id)}
                                        disabled={session.status !== 'SCHEDULED'}
                                    >
                                        <FiCheckCircle className="me-2" />
                                        Confirm Attendance
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
};

export default AttendanceConfirmation;