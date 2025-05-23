import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCalendar, FiUsers, FiClock, FiType, FiBookOpen, FiRepeat, FiCheckCircle } from "react-icons/fi";
import { ProgressBar, Badge } from "react-bootstrap";
import SessionCalendar from "./SessionCalendar";
import axiosClient from "../../api/axiosClient";
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";
import NavBar from "../../layouts/NavBar";


const SessionManagement = () => {
    const { roomId } = useParams();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axiosClient.get(`/sessions/room/${roomId}`);
                console.log("API Response:", response.data);
                setSessions(response.data);
            } catch (error) {
                console.error("Error fetching sessions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [roomId]);

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
        return <Badge bg={`${variants[status]}-light`} className={`text-${variants[status]}`}>{status}</Badge>;
    };

    return (
        <>
            <NavBar/>
            <TutorSideBar/>
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold">Session Management</h2>
                                    <h4 className="text-primary">Upcoming Sessions</h4>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'} rounded-pill`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        List View
                                    </button>
                                    <button
                                        className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline-primary'} rounded-pill`}
                                        onClick={() => setViewMode('calendar')}
                                    >
                                        Calendar View
                                    </button>
                                    <Link
                                        to={`/tutor/rooms/${roomId}/sessions/create`}
                                        className="btn btn-success rounded-pill px-4"
                                    >
                                        + New Session
                                    </Link>
                                </div>
                            </div>

                            {viewMode === 'calendar' ? (
                                <SessionCalendar sessions={sessions} roomId={roomId}/>
                            ) : (
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white border-0">
                                        <h5 className="mb-0">Upcoming Sessions</h5>
                                    </div>
                                    <div className="card-body">
                                        {loading ? (
                                            <div className="text-center py-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : sessions.length === 0 ? (
                                            <div className="text-center py-4 text-muted">
                                                No upcoming sessions scheduled
                                            </div>
                                        ) : (
                                            <div className="list-group list-group-flush">
                                                {sessions.map(session => (
                                                    <div key={session.id} className="list-group-item border-0 py-3">
                                                        <div
                                                            className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <h5 className="mb-1">
                                                                    <Link
                                                                        to={`/tutor/rooms/${roomId}/sessions/${session.id}`}
                                                                        className="text-dark"
                                                                    >
                                                                        {session.title}
                                                                    </Link>
                                                                </h5>
                                                                <div
                                                                    className="d-flex align-items-center gap-3 text-muted mb-2">
                                                                    <small><FiCalendar
                                                                        className="me-1"/> {formatDate(session.startTime)}
                                                                    </small>
                                                                    <small><FiClock
                                                                        className="me-1"/> {session.sessionType}
                                                                    </small>
                                                                    <small>{getStatusBadge(session.status)}</small>
                                                                </div>
                                                                <p className="mb-0">{session.description}</p>
                                                            </div>
                                                            <div className="text-end">
                                                                <div className="d-flex gap-2">
                                                                    <Link
                                                                        to={`/tutor/rooms/${roomId}/sessions/${session.id}/edit`}
                                                                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                    <Link
                                                                        to={`/tutor/rooms/${roomId}/sessions/${session.id}`}
                                                                        className="btn btn-sm btn-primary rounded-pill px-3"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                </div>
                                                                <small className="text-muted">
                                                                    {session.confirmedAttendees} of {session.totalParticipants} confirmed
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            </>
            );
            };

            export default SessionManagement;