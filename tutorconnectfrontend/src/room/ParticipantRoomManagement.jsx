import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ParticipantSidebar from "../layouts/SideBars/ParticipantSidebar";
import Navbar from "../layouts/NavBar";
import { FiUsers, FiFileText, FiCalendar, FiEye } from "react-icons/fi";
import { ProgressBar, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const ParticipantRoomManagement = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        participants: 0,
        assignments: 0,
        sessions: 0,
        progress: 0,
    });

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                setLoading(true);

                if (!id || isNaN(id)) {
                    throw new Error("Invalid room ID");
                }



                const mockRoom = {
                    id: id,
                    name: "Web Development Bootcamp",
                    capacity: 30,
                    startDate: "2025-02-15",
                    endDate: "2025-06-15"
                };

                const mockStats = {
                    participants: 24,
                    assignments: 8,
                    sessions: 12,
                    progress: 65
                };


                setRoom(mockRoom);
                setStats(mockStats);

                /*
                // This is the actual implementation that will be used later:

                // Fetch room details
                const roomResponse = await axiosClient.get(`/rooms/${id}`);
                if (!roomResponse.data) {
                  throw new Error("Room not found");
                }
                setRoom(roomResponse.data);

                // Fetch statistics in parallel
                const [participantsResponse, deliverablesResponse, sessionsResponse] =
                  await Promise.all([
                    axiosClient.get(`/rooms/${id}/participants`),
                    axiosClient.get(`/deliverables/room/${id}`),
                    axiosClient.get(`/sessions/room/${id}`),
                  ]);

                setStats({
                  participants: participantsResponse.data?.length || 0,
                  assignments: deliverablesResponse.data?.length || 0,
                  sessions: sessionsResponse.data?.length || 0,
                  progress: calculateProgress(deliverablesResponse.data || []),
                });
                */

            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to fetch room data"
                );
                toast.error(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to fetch room data"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();
    }, [id]);

    const calculateProgress = (deliverables) => {
        if (!deliverables || deliverables.length === 0) return 0;
        const completed = deliverables.filter((d) => d.status === "COMPLETED").length;
        return Math.round((completed / deliverables.length) * 100);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not scheduled";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "Invalid date";
        }
    };

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <Alert variant="danger">{error}</Alert>
                <Link to="/participant/rooms" className="btn btn-primary mt-3">
                    Back to Rooms
                </Link>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="container mt-5">
                <Alert variant="warning">Room not found</Alert>
                <Link to="/participant/rooms" className="btn btn-primary mt-3">
                    Back to Rooms
                </Link>
            </div>
        );
    }

    return (
        <>
            <ParticipantSidebar />
            <Navbar />

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold">Room Overview</h2>
                                    <h4 className="text-primary">{room.name}</h4>
                                </div>
                                <div className="text-end">
                                    <div className="badge bg-success-light text-success mb-2">
                                        Active
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-bold">Course Progress</span>
                                    <span>{stats.progress}%</span>
                                </div>
                                <ProgressBar
                                    now={stats.progress}
                                    variant="primary"
                                    className="rounded-pill"
                                    style={{ height: "8px" }}
                                />
                            </div>

                            <div className="row">

                                {/* Assignments Card */}
                                <div className="col-md-4 mb-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-header bg-white border-0">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-warning-light rounded p-2 me-3">
                                                    <FiFileText className="text-warning" size={24} />
                                                </div>
                                                <h5 className="mb-0">Assignments</h5>
                                            </div>
                                        </div>
                                        <div className="card-body text-center py-4">
                                            <h2 className="display-5 fw-bold text-warning">
                                                {stats.assignments}
                                            </h2>
                                            <p className="text-muted">active assignments</p>
                                        </div>
                                        <div className="card-footer bg-white border-0">
                                            <Link
                                                to={`/participant/rooms/${id}/deliverables`}
                                                className="btn btn-outline-warning w-100 rounded-pill"
                                            >
                                                <FiEye className="me-2" /> View Assignments
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Sessions Card */}
                                <div className="col-md-4 mb-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-header bg-white border-0">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary-light rounded p-2 me-3">
                                                    <FiCalendar className="text-primary" size={24} />
                                                </div>
                                                <h5 className="mb-0">Sessions</h5>
                                            </div>
                                        </div>
                                        <div className="card-body text-center py-4">
                                            <h2 className="display-5 fw-bold text-primary">
                                                {stats.sessions}
                                            </h2>
                                            <p className="text-muted">scheduled sessions</p>
                                        </div>
                                        <div className="card-footer bg-white border-0">
                                            <Link
                                                to={`/participant/participantroom/${id}/sessions`}
                                                className="btn btn-outline-primary w-100 rounded-pill"
                                            >
                                                <FiEye className="me-2" /> View Sessions
                                            </Link>
                                        </div>
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

export default ParticipantRoomManagement;