import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FiCalendar,
    FiClock,
    FiType,
    FiBookOpen,
    FiRepeat,
    FiCheckCircle,
    FiUser,
    FiUsers,
    FiEdit2,
    FiTrash2,
    FiArrowLeft
} from "react-icons/fi";
import axiosClient from "../../api/axiosClient";
import { Badge, ProgressBar, Button } from "react-bootstrap";
import NavBar from "../../layouts/NavBar";
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";

const SessionDetail = () => {
    const { roomId, id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendanceLoading, setAttendanceLoading] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axiosClient.get(`/sessions/${id}`);
                setSession(response.data);
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [id]);

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

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await axiosClient.post(`/sessions/${id}/status?status=${newStatus}`);
            setSession(response.data);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this session?")) {
            try {
                await axiosClient.delete(`/sessions/${id}`);
                navigate(`/tutor/rooms/${roomId}/sessions`);
            } catch (error) {
                console.error("Error deleting session:", error);
            }
        }
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

    if (loading) {
        return <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (!session) {
        return <div className="text-center py-4 text-muted">Session not found</div>;
    }

    return (
        <>
            <NavBar/>
            <TutorSideBar/>
            <div className="wrapper">
                <div className="content-page">

        <div className="container-fluid">
            <div className="container p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <button
                        className="btn btn-outline-secondary rounded-pill"
                        onClick={() => navigate(`/tutor/rooms/${roomId}/sessions`)}
                    >
                        <FiArrowLeft className="me-2" /> Back to Sessions
                    </button>
                    <div className="d-flex gap-2">
                        <Link
                            to={`/tutor/rooms/${roomId}/sessions/${id}/edit`}
                            className="btn btn-outline-primary rounded-pill px-4"
                        >
                            <FiEdit2 className="me-2" /> Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="btn btn-outline-danger rounded-pill px-4"
                        >
                            <FiTrash2 className="me-2" /> Delete
                        </button>
                    </div>
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
                                        <p className="mb-0 fw-bold">{session.sessionType.replace('_', ' ')}</p>
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
                            <p className="text-muted">{session.description || 'No description provided'}</p>
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
                            {session.status === 'SCHEDULED' && (
                                <>
                                    <Button
                                        variant="warning"
                                        className="rounded-pill px-4"
                                        onClick={async () => {
                                            await handleStatusChange('IN_PROGRESS');
                                            navigate(`/sessions/${id}/video`);
                                        }}
                                    >
                                        Start Session
                                    </Button>
                                    <Button
                                        variant="info"
                                        className="rounded-pill px-4"
                                        onClick={() => handleStatusChange('RESCHEDULED')}
                                    >
                                        Reschedule
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="rounded-pill px-4"
                                        onClick={() => handleStatusChange('CANCELLED')}
                                    >
                                        Cancel Session
                                    </Button>
                                </>
                            )}
                            {session.status === 'IN_PROGRESS' && (
                                <Button
                                    variant="success"
                                    className="rounded-pill px-4"
                                    onClick={() => handleStatusChange('COMPLETED')}
                                >
                                    Complete Session
                                </Button>
                            )}
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

export default SessionDetail;