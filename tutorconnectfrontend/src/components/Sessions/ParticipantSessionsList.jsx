import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FiCalendar,
    FiUsers,
    FiClock,
    FiCheckCircle,
    FiVideo,
    FiInfo,
    FiTrash2,
    FiArrowLeft
} from "react-icons/fi";
import {
    Badge,
    Button,
    Card,
    ListGroup,
    Modal,
    ProgressBar,
    Spinner,
    Toast,
    ToastContainer
} from "react-bootstrap";
import axiosClient from "../../api/axiosClient";
import ParticipantSessionCalendar from "./ParticipantSessionCalendar";


const ParticipantSessionsList = () => {
    const { roomId } = useParams();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("list");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get(`/sessions/room/${roomId}`);
                setSessions(response.data);
            } catch (error) {
                console.error("Error fetching sessions:", error);
                showToastMessage("Failed to load sessions", "danger");
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [roomId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const variants = {
            SCHEDULED: "primary",
            IN_PROGRESS: "warning",
            COMPLETED: "success",
            CANCELLED: "danger",
            RESCHEDULED: "info",
        };
        return (
            <Badge bg={variants[status]} className="text-white">
                {status}
            </Badge>
        );
    };

    const handleJoinSession = (sessionId) => {
        navigate(`/participant/sessions/${sessionId}/video`);
    };

    const handleConfirmAttendance = async (sessionId) => {
        try {
            await axiosClient.post(`/api/sessions/${sessionId}/confirm-attendance`);
            setSessions(sessions.map(session =>
                session.id === sessionId
                    ? { ...session, isConfirmed: true, confirmedAttendees: session.confirmedAttendees + 1 }
                    : session
            ));
            showToastMessage("Attendance confirmed successfully!", "success");
        } catch (error) {
            console.error("Error confirming attendance:", error);
            showToastMessage("Failed to confirm attendance", "danger");
        }
    };

    const handleShowDeleteModal = (session) => {
        setSelectedSession(session);
        setShowDeleteModal(true);
    };

    const handleCancelAttendance = async () => {
        try {
            await axiosClient.delete(`/api/sessions/${selectedSession.id}/attend/${selectedSession.participantId}`);
            setSessions(sessions.filter(session => session.id !== selectedSession.id));
            showToastMessage("Attendance cancelled successfully", "success");
        } catch (error) {
            console.error("Error cancelling attendance:", error);
            showToastMessage("Failed to cancel attendance", "danger");
        } finally {
            setShowDeleteModal(false);
        }
    };

    const showToastMessage = (message, variant) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
    };

    return (
        <>


            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            {/* Header Section */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => navigate(-1)}
                                        className="mb-3"
                                    >
                                        <FiArrowLeft className="me-2" /> Back to Rooms
                                    </Button>
                                    <h2 className="fw-bold">My Sessions</h2>
                                    <p className="text-muted">Manage your session attendance and details</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant={viewMode === "list" ? "primary" : "outline-primary"}
                                        onClick={() => setViewMode("list")}
                                        className="rounded-pill"
                                    >
                                        <FiUsers className="me-1" /> List View
                                    </Button>
                                    <Button
                                        variant={viewMode === "calendar" ? "primary" : "outline-primary"}
                                        onClick={() => setViewMode("calendar")}
                                        className="rounded-pill"
                                    >
                                        <FiCalendar className="me-1" /> Calendar View
                                    </Button>
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Loading sessions...</p>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && sessions.length === 0 && (
                                <Card className="text-center py-5">
                                    <Card.Body>
                                        <FiCalendar size={48} className="text-muted mb-3" />
                                        <h5>No sessions scheduled</h5>
                                        <p className="text-muted">There are currently no sessions for this room</p>
                                    </Card.Body>
                                </Card>
                            )}

                            {/* Calendar View */}
                            {!loading && sessions.length > 0 && viewMode === 'calendar' && (
                                <Card className="border-0 shadow-sm">
                                    <Card.Body>
                                        <ParticipantSessionCalendar
                                            sessions={sessions}
                                            onSessionClick={(session) => navigate(`/participant/rooms/${session.roomId}/sessions/${session.id}`)}
                                        />
                                    </Card.Body>
                                </Card>
                            )}

                            {/* List View */}
                            {!loading && sessions.length > 0 && viewMode === 'list' && (
                                <div className="row g-4">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="col-md-6 col-lg-4">
                                            <Card className="h-100 shadow-sm">
                                                <Card.Header className="bg-white border-bottom-0">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h5 className="mb-0">{session.title}</h5>
                                                        {getStatusBadge(session.status)}
                                                    </div>
                                                </Card.Header>
                                                <Card.Body>
                                                    <ListGroup variant="flush" className="mb-3">
                                                        <ListGroup.Item className="d-flex align-items-center">
                                                            <FiCalendar className="me-2 text-primary" />
                                                            {formatDate(session.startTime)}
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="d-flex align-items-center">
                                                            <FiClock className="me-2 text-primary" />
                                                            {session.sessionType}
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="d-flex align-items-center">
                                                            <FiUsers className="me-2 text-primary" />
                                                            {session.confirmedAttendees} attending
                                                            <ProgressBar
                                                                now={(session.confirmedAttendees / session.totalParticipants) * 100}
                                                                className="ms-2 flex-grow-1"
                                                                style={{ height: '8px' }}
                                                            />
                                                        </ListGroup.Item>
                                                    </ListGroup>

                                                    <p className="text-muted mb-3">{session.description}</p>

                                                    <div className="d-flex justify-content-between">
                                                        <Button
                                                            variant="info"
                                                            size="sm"
                                                            onClick={() => navigate(`/participant/rooms/${session.roomId}/sessions/${session.id}`)}
                                                        >
                                                            <FiInfo className="me-1" /> Details
                                                        </Button>

                                                        <div className="d-flex gap-2">
                                                            {session.status === "IN_PROGRESS" && (
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => handleJoinSession(session.id)}
                                                                >
                                                                    <FiVideo className="me-1" /> Join
                                                                </Button>
                                                            )}

                                                            {session.status === "SCHEDULED" && !session.isConfirmed && (
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() => handleConfirmAttendance(session.id)}
                                                                >
                                                                    <FiCheckCircle className="me-1" /> Confirm
                                                                </Button>
                                                            )}

                                                            {session.isConfirmed && (
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => handleShowDeleteModal(session)}
                                                                >
                                                                    <FiTrash2 className="me-1" /> Cancel
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Attendance</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to cancel your attendance for "{selectedSession?.title}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleCancelAttendance}>
                        Confirm Cancellation
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Toast Notifications */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 11 }}>
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
};

export default ParticipantSessionsList;