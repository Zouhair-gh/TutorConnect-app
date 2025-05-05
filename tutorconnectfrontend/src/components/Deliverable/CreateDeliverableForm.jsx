import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

import { FiSave, FiArrowLeft, FiUser, FiCalendar, FiFileText } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CreateDeliverableForm = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days from now
        maxPoints: 100,
        isVisible: true,
        assignedParticipantIds: []
    });
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchParticipants = async () => {
        try {
            const response = await axiosClient.get(`/rooms/${roomId}/participants`);
            setParticipants(response.data);
        } catch (err) {
            setError("Failed to fetch participants");
        }
    };

    React.useEffect(() => {
        fetchParticipants();
    }, [roomId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                roomId: parseInt(roomId),
                deadline: formData.deadline.toISOString().split('T')[0]
            };
            await axiosClient.post("/deliverables", payload);
            navigate(`/tutor/rooms/${roomId}/deliverables`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create deliverable");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleParticipantToggle = (participantId) => {
        setFormData(prev => {
            const newParticipants = prev.assignedParticipantIds.includes(participantId)
                ? prev.assignedParticipantIds.filter(id => id !== participantId)
                : [...prev.assignedParticipantIds, participantId];
            return { ...prev, assignedParticipantIds: newParticipants };
        });
    };
    console.log("Participants:", participants);
    React.useEffect(() => {
        const btn = document.querySelector(".btn-primary");
        if (!btn) {
            console.warn("No .btn-primary button found!");
        } else {
            console.log("Primary button styles computed:", window.getComputedStyle(btn));
        }
    }, []);



    return (
        <>

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold">Create New Deliverable</h2>
                                    <p className="text-muted">Set up a new assignment for your students</p>
                                </div>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                >
                                    <FiArrowLeft className="me-2" /> Back
                                </button>
                            </div>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}

                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Description</label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                rows="4"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">Deadline</label>
                                                <div className="d-flex align-items-center">
                                                    <FiCalendar className="me-2 text-primary" />
                                                    <DatePicker
                                                        selected={formData.deadline}
                                                        onChange={(date) => setFormData(prev => ({ ...prev, deadline: date }))}
                                                        minDate={new Date()}
                                                        className="form-control"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold">Max Points</label>
                                                <div className="d-flex align-items-center">
                                                    <FiFileText className="me-2 text-primary" />
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="maxPoints"
                                                        min="1"
                                                        value={formData.maxPoints}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Assign To</label>
                                            <div className="d-flex align-items-center mb-2">
                                                <FiUser className="me-2 text-primary" />
                                                <small className="text-muted">Select participants (leave empty to assign to all)</small>
                                            </div>
                                            <div className="list-group">
                                                {participants.map(participant => (
                                                    <label key={participant.id} className="list-group-item">
                                                        <div className="d-flex align-items-center">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input me-3"
                                                                checked={formData.assignedParticipantIds.includes(participant.id)}
                                                                onChange={() => handleParticipantToggle(participant.id)}
                                                            />
                                                            {participant.firstName} {participant.lastName}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-3 form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="isVisible"
                                                checked={formData.isVisible}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
                                            />
                                            <label className="form-check-label" htmlFor="isVisible">
                                                Make visible to students immediately
                                            </label>
                                        </div>

                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button
                                                type="submit"
                                                className="btn btn-primary rounded-pill px-4"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <FiSave className="me-2" />
                                                )}
                                                Create Deliverable
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default CreateDeliverableForm;