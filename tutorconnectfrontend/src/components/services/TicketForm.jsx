import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketService from "./TicketService";
import SideBar from "../../layouts/SideBar";
import NavBar from "../../layouts/NavBar";


const TicketForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
        priority: "MEDIUM",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await TicketService.createTicket(formData);
            navigate("/tutor/tickets");
        } catch (error) {
            console.error("Error creating ticket:", error);
            setError(
                error.response?.data?.message || "Failed to create ticket. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SideBar />
            <NavBar/>
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <h2 className="mb-4">Create Support Ticket</h2>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="subject" className="form-label">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="Brief description of your issue"
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="priority" className="form-label">
                                            Priority *
                                        </label>
                                        <select
                                            className="form-control"
                                            id="priority"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="description" className="form-label">
                                            Description *
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="6"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            placeholder="Please provide detailed information about your issue"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? "Submitting..." : "Submit Ticket"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary ms-2"
                                        onClick={() => navigate("/tutor/tickets")}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default TicketForm;