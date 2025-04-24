import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TicketService from "./TicketService";
import SideBar from "../../layouts/SideBar";
import NavBar from "../../layouts/NavBar";


const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const data = await TicketService.getTicketById(id);
                setTicket(data);
            } catch (error) {
                console.error("Error fetching ticket:", error);
                setError("Failed to load ticket details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            try {
                await TicketService.deleteTicket(id);
                navigate("/tutor/tickets");
            } catch (error) {
                console.error("Error deleting ticket:", error);
                setError("Failed to delete ticket. Please try again.");
            }
        }
    };

    const getPriorityBadge = (priority) => {
        const classes = {
            LOW: "badge bg-success",
            MEDIUM: "badge bg-primary",
            HIGH: "badge bg-warning",
            URGENT: "badge bg-danger",
        };
        return classes[priority] || "badge bg-secondary";
    };

    const getStatusBadge = (status) => {
        const classes = {
            NEW: "badge bg-purple",
            IN_PROGRESS: "badge bg-info",
            RESOLVED: "badge bg-success",
            CLOSED: "badge bg-secondary",
        };
        return classes[status] || "badge bg-secondary";
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <>
                <SideBar />
                <NavBar />
                <div className="wrapper">
                    <div className="content-page">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body text-center py-5">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-2">Loading ticket details...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }

    if (error) {
        return (
            <>
                <SideBar />
                <NavBar />
                <div className="wrapper">
                    <div className="content-page">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                            <button
                                                onClick={() => navigate("/tutor/tickets")}
                                                className="btn btn-primary"
                                            >
                                                Back to Tickets
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }

    if (!ticket) {
        return (
            <>
                <SideBar />
                <NavBar />
                <div className="wrapper">
                    <div className="content-page">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body text-center py-5">
                                            <p className="text-muted">Ticket not found</p>
                                            <button
                                                onClick={() => navigate("/tutor/tickets")}
                                                className="btn btn-primary mt-3"
                                            >
                                                Back to Tickets
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
            </>
        );
    }

    return (
        <>
            <SideBar />
            <NavBar />
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title">Ticket Details</h4>
                                        <div>
                                            <span className={`me-2 ${getStatusBadge(ticket.status)}`}>
                                                {ticket.status.replace("_", " ")}
                                            </span>
                                            <span className={getPriorityBadge(ticket.priority)}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row mb-3">
                                            <div className="col-md-12">
                                                <h5>{ticket.subject}</h5>
                                                <p className="text-muted mb-0">
                                                    Created: {formatDate(ticket.createdAt)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="border rounded p-3 mb-4">
                                                    <h6 className="mb-3">Description</h6>
                                                    <p className="mb-0">{ticket.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Ticket ID</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={ticket.id}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Last Updated</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={formatDate(ticket.updatedAt)}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between mt-4">
                                            <button
                                                onClick={() => navigate("/tutor/tickets")}
                                                className="btn btn-secondary"
                                            >
                                                <i className="ri-arrow-left-line me-1"></i> Back to Tickets
                                            </button>
                                            <div>
                                                <button
                                                    onClick={() => navigate(`/tutor/tickets/edit/${ticket.id}`)}
                                                    className="btn btn-primary me-2"
                                                >
                                                    <i className="ri-edit-line me-1"></i> Edit
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    className="btn btn-danger"
                                                >
                                                    <i className="ri-delete-bin-line me-1"></i> Delete
                                                </button>
                                            </div>
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

export default TicketDetail;