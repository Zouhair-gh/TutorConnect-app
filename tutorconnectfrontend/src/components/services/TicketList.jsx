import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TicketService from "./TicketService";
import SideBar from "../../layouts/SideBar";
import NavBar from "../../layouts/NavBar";

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await TicketService.getMyTickets();
                setTickets(response);
            } catch (error) {
                console.error("Error fetching tickets:", error);
                setError("Failed to load tickets. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            try {
                await TicketService.deleteTicket(id);
                setTickets(tickets.filter((ticket) => ticket.id !== id));
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

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toString().includes(searchTerm) ||
        ticket.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.priority.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                            <p className="mt-2">Loading tickets...</p>
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
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title">My Support Tickets</h4>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Search tickets..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{ width: '250px', display: 'inline-block' }}
                                            />
                                            <button
                                                onClick={() => navigate("/tutor/tickets/create")}
                                                className="btn btn-primary"
                                            >
                                                <i className="ri-add-line me-1"></i> Create New
                                            </button>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        {filteredTickets.length === 0 ? (
                                            <div className="text-center py-5">
                                                <div className="mb-4">
                                                    <i className="ri-ticket-line text-muted" style={{ fontSize: '48px' }}></i>
                                                </div>
                                                <h5 className="mb-2">No tickets found</h5>
                                                <p className="text-muted mb-4">
                                                    {searchTerm ?
                                                        "No tickets match your search criteria" :
                                                        "You haven't created any tickets yet"}
                                                </p>
                                                <button
                                                    onClick={() => navigate("/tutor/tickets/create")}
                                                    className="btn btn-primary"
                                                >
                                                    <i className="ri-add-line me-1"></i> Create Ticket
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Subject</th>
                                                        <th>Status</th>
                                                        <th>Priority</th>
                                                        <th>Created</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {filteredTickets.map((ticket) => (
                                                        <tr key={ticket.id}>
                                                            <td>#{ticket.id}</td>
                                                            <td>
                                                                <Link
                                                                    to={`/tutor/tickets/${ticket.id}`}
                                                                    className="text-primary"
                                                                >
                                                                    {ticket.subject}
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                    <span className={getStatusBadge(ticket.status)}>
                                                                        {ticket.status.replace("_", " ")}
                                                                    </span>
                                                            </td>
                                                            <td>
                                                                    <span className={getPriorityBadge(ticket.priority)}>
                                                                        {ticket.priority}
                                                                    </span>
                                                            </td>
                                                            <td>{formatDate(ticket.createdAt)}</td>
                                                            <td>
                                                                <div className="d-flex">
                                                                    <Link
                                                                        to={`/tutor/tickets/${ticket.id}`}
                                                                        className="btn btn-sm btn-outline-primary me-2"
                                                                    >
                                                                        <i className="ri-eye-line"></i>
                                                                    </Link>
                                                                    {ticket.status === "NEW" && (
                                                                        <button
                                                                            onClick={() => handleDelete(ticket.id)}
                                                                            className="btn btn-sm btn-outline-danger"
                                                                        >
                                                                            <i className="ri-delete-bin-line"></i>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
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

export default TicketList;