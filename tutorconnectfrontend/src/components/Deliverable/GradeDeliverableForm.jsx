import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

import { FiSave, FiArrowLeft, FiCheckCircle } from "react-icons/fi";


const GradeDeliverableForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        grade: "",
        feedback: ""
    });
    const [deliverable, setDeliverable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDeliverable = async () => {
            try {
                const response = await axiosClient.get(`/deliverables/${id}`);
                setDeliverable(response.data);
                setFormData(prev => ({
                    ...prev,
                    grade: response.data.grade || "",
                    feedback: response.data.feedback || ""
                }));
            } catch (err) {
                setError("Failed to fetch deliverable details");
            } finally {
                setLoading(false);
            }
        };

        fetchDeliverable();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosClient.post("/deliverables/grade", {
                deliverableId: parseInt(id),
                grade: parseFloat(formData.grade),
                feedback: formData.feedback
            });
            navigate(`/tutor/deliverables/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit grade");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading && !deliverable) {
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

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold">Grade Deliverable</h2>
                                    <p className="text-muted">Evaluate student submission for: {deliverable?.title}</p>
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
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Student</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={deliverable?.participantName || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Max Points</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={deliverable?.maxPoints || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-bold">Grade</label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <FiCheckCircle />
                                                </span>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="grade"
                                                    min="0"
                                                    max={deliverable?.maxPoints || 100}
                                                    step="0.1"
                                                    value={formData.grade}
                                                    onChange={handleChange}
                                                    required
                                                />
                                                <span className="input-group-text">
                                                    / {deliverable?.maxPoints || 100}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Feedback</label>
                                            <textarea
                                                className="form-control"
                                                name="feedback"
                                                rows="5"
                                                value={formData.feedback}
                                                onChange={handleChange}
                                                placeholder="Provide constructive feedback..."
                                            />
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
                                                Submit Grade
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

export default GradeDeliverableForm;