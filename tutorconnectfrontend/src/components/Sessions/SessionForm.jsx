import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCalendar, FiClock, FiType, FiBookOpen, FiRepeat, FiCheckCircle } from "react-icons/fi";
import axiosClient from "../../api/axiosClient";
import NavBar from "../../layouts/NavBar";
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";

const SessionForm = ({ editMode = false }) => {
    const { roomId, id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        sessionType: 'LECTURE',
        isRecurring: false,
        recurringPattern: '',
        status: 'SCHEDULED'
    });
    const [loading, setLoading] = useState(editMode);

    useEffect(() => {
        if (editMode) {
            const fetchSession = async () => {
                try {
                    const response = await axiosClient.get(`/sessions/${id}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error("Error fetching session:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSession();
        }
    }, [editMode, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axiosClient.put(`/sessions/${id}`, formData);
            } else {
                await axiosClient.post(`/sessions`, {
                    ...formData,
                    roomId: parseInt(roomId),
                    tutorCreated: true
                });
            }
            navigate(`/tutor/rooms/${roomId}/sessions`);
        } catch (error) {
            console.error("Error saving session:", error);
        }
    };

    if (loading) {
        return <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    return (
        <>
        <NavBar/>
    <TutorSideBar/>
    <div className="wrapper">
        <div className="content-page">
        <div className="container-fluid">
            <div className="container p-4">
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0">
                        <h4 className="mb-0">{editMode ? 'Edit Session' : 'Create New Session'}</h4>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Title</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FiType /></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Session Type</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FiBookOpen /></span>
                                        <select
                                            className="form-select"
                                            name="sessionType"
                                            value={formData.sessionType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="LECTURE">Lecture</option>
                                            <option value="QA_SESSION">Q&A Session</option>
                                            <option value="PRACTICE">Practice</option>
                                            <option value="WORKSHOP">Workshop</option>
                                            <option value="REVIEW">Review</option>
                                            <option value="EXAM_PREP">Exam Preparation</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Start Time</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FiCalendar /></span>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="startTime"
                                            value={formData.startTime ? formData.startTime.substring(0, 16) : ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">End Time</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FiClock /></span>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            name="endTime"
                                            value={formData.endTime ? formData.endTime.substring(0, 16) : ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isRecurring"
                                            id="isRecurring"
                                            checked={formData.isRecurring}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="isRecurring">
                                            Recurring Session
                                        </label>
                                    </div>
                                </div>
                                {formData.isRecurring && (
                                    <div className="col-md-6">
                                        <div className="input-group">
                                            <span className="input-group-text"><FiRepeat /></span>
                                            <select
                                                className="form-select"
                                                name="recurringPattern"
                                                value={formData.recurringPattern}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select pattern</option>
                                                <option value="DAILY">Daily</option>
                                                <option value="WEEKLY">Weekly</option>
                                                <option value="MONTHLY">Monthly</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {editMode && (
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FiCheckCircle /></span>
                                        <select
                                            className="form-select"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="SCHEDULED">Scheduled</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                            <option value="RESCHEDULED">Rescheduled</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                    onClick={() => navigate(`/tutor/rooms/${roomId}/sessions`)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-pill px-4"
                                >
                                    {editMode ? 'Update Session' : 'Create Session'}
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

export default SessionForm;