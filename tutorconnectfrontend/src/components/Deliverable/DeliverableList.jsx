import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    FiFileText,
    FiCalendar,
    FiUser,
    FiCheckCircle,
    FiClock,
    FiPlus,
    FiEye,
    FiEdit,
    FiTrash2
} from "react-icons/fi";
import { Badge, ProgressBar } from "react-bootstrap";
import NavBar from "../../layouts/NavBar";
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";



const DeliverableList = () => {
    const { roomId } = useParams();
    const [deliverables, setDeliverables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const fetchDeliverables = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/deliverables/room/${roomId}`);
            setDeliverables(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch deliverables");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (deliverableId) => {
        if (window.confirm("Are you sure you want to delete this deliverable?")) {
            try {
                await axiosClient.delete(`/deliverables/${deliverableId}`);
                setSuccess("Deliverable deleted successfully!");
                setTimeout(() => setSuccess(""), 5000);
                fetchDeliverables();
            } catch (err) {
                setError(err.response?.data || "Failed to delete deliverable");
                console.error(err);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not submitted";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'SUBMITTED':
                return <Badge bg="info">Submitted</Badge>;
            case 'GRADED':
                return <Badge bg="success">Graded</Badge>;
            case 'LATE':
                return <Badge bg="danger">Late</Badge>;
            default:
                return <Badge bg="secondary">Pending</Badge>;
        }
    };

    const getDaysRemaining = (deadline) => {
        if (!deadline) return 0;
        const end = new Date(deadline);
        const now = new Date();
        return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    };

    const getProgressVariant = (days) => {
        if (days > 7) return "success";
        if (days > 3) return "info";
        if (days > 0) return "warning";
        return "danger";
    };

    useEffect(() => {
        fetchDeliverables();
    }, [roomId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
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
                                <div>
                                    <h2 className="fw-bold">Classroom Deliverables</h2>
                                    <p className="text-muted">Manage assignments and submissions</p>
                                </div>
                                <Link
                                    to={`/tutor/rooms/${roomId}/deliverables/create`}
                                    className="btn btn-primary rounded-pill px-4"
                                >
                                    <FiPlus className="me-2" /> Create Deliverable
                                </Link>
                            </div>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    {success}
                                    <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
                                </div>
                            )}

                            <div className="row">
                                {deliverables.length > 0 ? (
                                    deliverables.map((deliverable) => {
                                        const daysRemaining = getDaysRemaining(deliverable.deadline);
                                        const progressPercentage = Math.min(100, Math.max(0, (daysRemaining / 14) * 100));

                                        return (
                                            <div key={deliverable.id} className="col-md-6 col-lg-4 mb-4">
                                                <div className="card h-100 border-0 shadow-sm">
                                                    <div className="card-header bg-white border-0 pb-0">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <h5 className="mb-0 fw-bold text-truncate">{deliverable.title}</h5>
                                                            {getStatusBadge(deliverable.status)}
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <p className="text-muted mb-2">{deliverable.description}</p>

                                                            {deliverable.deadline && (
                                                                <div className="mb-3">
                                                                    <div className="d-flex justify-content-between mb-1">
                                                                        <small className="text-muted">Deadline in</small>
                                                                        <small className="fw-bold">{daysRemaining} days</small>
                                                                    </div>
                                                                    <ProgressBar
                                                                        now={progressPercentage}
                                                                        variant={getProgressVariant(daysRemaining)}
                                                                        className="rounded-pill"
                                                                        style={{ height: '6px' }}
                                                                    />
                                                                </div>
                                                            )}

                                                            <div className="d-flex flex-column gap-2 mb-3">
                                                                <div className="d-flex align-items-center">
                                                                    <FiUser className="me-2 text-primary" />
                                                                    <span>Assigned to: <strong>{deliverable.participantName}</strong></span>
                                                                </div>
                                                                <div className="d-flex align-items-center">
                                                                    <FiCalendar className="me-2 text-info" />
                                                                    <span>Deadline: <strong>{formatDate(deliverable.deadline)}</strong></span>
                                                                </div>
                                                                <div className="d-flex align-items-center">
                                                                    <FiCheckCircle className="me-2 text-success" />
                                                                    <span>Max points: <strong>{deliverable.maxPoints || 'N/A'}</strong></span>
                                                                </div>
                                                                {deliverable.grade !== null && (
                                                                    <div className="d-flex align-items-center">
                                                                        <FiCheckCircle className="me-2 text-warning" />
                                                                        <span>Grade: <strong>{deliverable.grade}/{deliverable.maxPoints}</strong></span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-footer bg-white border-0 pt-0">
                                                        <div className="d-flex justify-content-between">
                                                            <Link
                                                                to={`/tutor/deliverables/${deliverable.id}`}
                                                                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                                            >
                                                                <FiEye className="me-1" /> View
                                                            </Link>
                                                            {deliverable.status === 'SUBMITTED' && (
                                                                <Link
                                                                    to={`/tutor/deliverables/${deliverable.id}/grade`}
                                                                    className="btn btn-sm btn-warning rounded-pill px-3"
                                                                >
                                                                    <FiEdit className="me-1" /> Grade
                                                                </Link>
                                                            )}
                                                            <button
                                                                className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                                onClick={() => handleDelete(deliverable.id)}
                                                            >
                                                                <FiTrash2 className="me-1" /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-12">
                                        <div className="card border-0 shadow-sm">
                                            <div className="card-body text-center py-5">
                                                <FiFileText className="display-4 text-muted mb-3" />
                                                <h4 className="fw-bold mb-2">No Deliverables Found</h4>
                                                <p className="text-muted mb-4">This classroom doesn't have any deliverables yet</p>
                                                <Link
                                                    to={`/tutor/rooms/${roomId}/deliverables/create`}
                                                    className="btn btn-primary rounded-pill px-4"
                                                >
                                                    Create First Deliverable
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default DeliverableList;