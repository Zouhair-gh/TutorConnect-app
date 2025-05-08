import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FiCalendar,
    FiClock,
    FiBookOpen,
    FiRepeat,
    FiUsers,
    FiArrowLeft
} from "react-icons/fi";
import { Badge, ProgressBar, Button } from "react-bootstrap";
import NavBar from "../../layouts/NavBar";
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";

const ParticipantSessionDetail = () => {
    const { roomId, id } = useParams();
    const navigate = useNavigate();

    // Dummy static session data
    const session = {
        title: "Sample Session Title",
        startTime: "2025-05-10T09:00:00Z",
        endTime: "2025-05-10T11:00:00Z",
        sessionType: "ONLINE",
        isRecurring: true,
        recurringPattern: "Weekly",
        description: "This is a sample session description for testing purposes.",
        status: "SCHEDULED",
        confirmedAttendees: 8,
        totalParticipants: 10
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const variants = {
            SCHEDULED: 'primary',
            IN_PROGRESS: 'warning',
            COMPLETED: 'success',
            CANCELLED: 'danger',
            RESCHEDULED: 'info'
        };
        return <Badge bg={`${variants[status]}-light`} className={`text-${variants[status]} fs-6`}>{status}</Badge>;
    };

    return (
        <>
            <NavBar />
            <TutorSideBar />
            <div className="wrapper">
                <div className="content-page">

                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <button
                                    className="btn btn-outline-secondary rounded-pill"
                                    onClick={() => navigate(`/participant/rooms`)}
                                >
                                    <FiArrowLeft className="me-2" /> Back to Rooms
                                </button>
                            </div>

                            <div className="card border-0 shadow-sm mb-4">
                                <div className="card-header bg-white border-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="mb-0">{session.title}</h3>
                                        {getStatusBadge(session.status)}
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center mb-3">
                                                <FiCalendar className="me-3 text-primary" size={20} />
                                                <div>
                                                    <small className="text-muted">Start Time</small>
                                                    <p className="mb-0 fw-bold">{formatDate(session.startTime)}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <FiClock className="me-3 text-primary" size={20} />
                                                <div>
                                                    <small className="text-muted">End Time</small>
                                                    <p className="mb-0 fw-bold">{formatDate(session.endTime)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center mb-3">
                                                <FiBookOpen className="me-3 text-primary" size={20} />
                                                <div>
                                                    <small className="text-muted">Session Type</small>
                                                    <p className="mb-0 fw-bold">{session.sessionType}</p>
                                                </div>
                                            </div>
                                            {session.isRecurring && (
                                                <div className="d-flex align-items-center mb-3">
                                                    <FiRepeat className="me-3 text-primary" size={20} />
                                                    <div>
                                                        <small className="text-muted">Recurring Pattern</small>
                                                        <p className="mb-0 fw-bold">{session.recurringPattern}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="mb-3">Description</h5>
                                        <p className="text-muted">{session.description}</p>
                                    </div>

                                    <div className="mb-4">
                                        <h5 className="mb-3">Attendance</h5>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="fw-bold">
                                                <FiUsers className="me-2" />
                                                {session.confirmedAttendees} of {session.totalParticipants} confirmed
                                            </span>
                                            <span>{Math.round((session.confirmedAttendees / session.totalParticipants) * 100)}%</span>
                                        </div>
                                        <ProgressBar
                                            now={(session.confirmedAttendees / session.totalParticipants) * 100}
                                            variant="primary"
                                            className="rounded-pill"
                                            style={{ height: '8px' }}
                                        />
                                    </div>

                                    <div className="d-flex flex-wrap gap-2">
                                        <Button variant="info" className="rounded-pill px-4" disabled>Static Buttons</Button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ParticipantSessionDetail;
