import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FiCalendar,
    FiUsers,
    FiClock,
    FiCheckSquare,
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
import ParticipantSidebar from "../../layouts/SideBars/ParticipantSidebar";
import NavBar from "../../layouts/NavBar";

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

    // Handler for navigating to confirm attendance page
    const handleGoToConfirmAttendance = () => {
        navigate(`/participant/participantroom/${roomId}/confirm-attendance`);
    };

    return (
        <>
            <ParticipantSidebar />
            <NavBar />

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
                                        variant="success"
                                        onClick={handleGoToConfirmAttendance}
                                        className="rounded-pill"
                                    >
                                        <FiCheckSquare className="me-1" /> Confirm Attendances
                                    </Button>
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

                            {/* List View - Improved Styling */}
                            {!loading && sessions.length > 0 && viewMode === 'list' && (
                                <div className="row g-4">
                                    {sessions.map((session) => (
                                        <div key={session.id} className="col-md-6 col-lg-4">
                                            <Card className="h-100 shadow-sm border-0 hover-shadow">
                                                <div className={`card-status-indicator bg-${getStatusBadge(session.status).props.bg}`} style={{ height: '4px' }}></div>
                                                <Card.Header className="bg-white border-bottom-0 py-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h5 className="mb-0 text-truncate" style={{ maxWidth: '70%' }}>{session.title}</h5>
                                                        {getStatusBadge(session.status)}
                                                    </div>
                                                </Card.Header>
                                                <Card.Body className="pt-0">
                                                    <ListGroup variant="flush" className="mb-3">
                                                        <ListGroup.Item className="d-flex align-items-center ps-0 border-0 py-2">
                                                            <div className="bg-light rounded-circle p-2 me-3">
                                                                <FiCalendar className="text-primary" />
                                                            </div>
                                                            <span>{formatDate(session.startTime)}</span>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="d-flex align-items-center ps-0 border-0 py-2">
                                                            <div className="bg-light rounded-circle p-2 me-3">
                                                                <FiClock className="text-primary" />
                                                            </div>
                                                            <span>{session.sessionType}</span>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="ps-0 border-0 py-2">
                                                            <div className="d-flex align-items-center mb-2">
                                                                <div className="bg-light rounded-circle p-2 me-3">
                                                                    <FiUsers className="text-primary" />
                                                                </div>
                                                                <span>{session.confirmedAttendees} attending</span>
                                                            </div>
                                                            <ProgressBar
                                                                now={(session.confirmedAttendees / session.totalParticipants) * 100}
                                                                variant="primary"
                                                                className="rounded-pill"
                                                                style={{ height: '8px' }}
                                                            />
                                                        </ListGroup.Item>
                                                    </ListGroup>

                                                    <div className="text-muted mb-3" style={{
                                                        maxHeight: '60px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}>
                                                        {session.description}
                                                    </div>

                                                    <div className="d-flex justify-content-between mt-auto">
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            className="rounded-pill"
                                                            onClick={() => navigate(`/participant/rooms/${session.roomId}/sessions/${session.id}`)}
                                                        >
                                                            <FiInfo className="me-1" /> Details
                                                        </Button>

                                                        <div className="d-flex gap-2">
                                                            {session.status === "IN_PROGRESS" && (
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    className="rounded-pill"
                                                                    onClick={() => handleJoinSession(session.id)}
                                                                >
                                                                    <FiVideo className="me-1" /> Join
                                                                </Button>
                                                            )}

                                                            {session.isConfirmed && (
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    className="rounded-pill"
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

            <style jsx>{`
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                    transition: all 0.3s ease;
                }
                .card-status-indicator {
                    width: 100%;
                }
            `}</style>
        </>
    );
};

export default ParticipantSessionsList;