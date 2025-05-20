import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { FiUpload, FiSave, FiArrowLeft } from "react-icons/fi";
import { Button, Form, ProgressBar } from "react-bootstrap";
import NavBar from "../../layouts/NavBar";
import ParticipantSidebar from "../../layouts/SideBars/ParticipantSidebar";


const SubmitDeliverableForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        submissionNotes: "",
        files: []
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [deliverable, setDeliverable] = useState(null);

    // Add validation state
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        const fetchDeliverable = async () => {
            try {
                const response = await axiosClient.get(`/deliverables/${id}`);
                if (!response.data.isVisible) {
                    navigate(`/participant/deliverables/${id}`, {
                        state: { error: "This assignment is not available for submission" }
                    });
                }
                setDeliverable(response.data);
            } catch (err) {
                setError("Failed to fetch deliverable details");
            }
        };

        fetchDeliverable();
    }, [id, navigate]);

    const validateFiles = (files) => {
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        const invalidFiles = files.filter(file =>
            !ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE
        );

        return invalidFiles.length === 0;
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!validateFiles(files)) {
            setValidationError("Invalid file type or size (max 10MB). Allowed types: PDF, PNG, JPG, DOC/DOCX");
            return;
        }
        setValidationError("");
        setFormData(prev => ({ ...prev, files }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFiles(formData.files)) return;

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("request", JSON.stringify({
                deliverableId: parseInt(id),
                submissionNotes: formData.submissionNotes
            }));

            formData.files.forEach(file => {
                formDataToSend.append("files", file);
            });

            await axiosClient.post("/deliverables/submit", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                }
            });

            // Redirect to deliverable view with success state
            navigate(`/participant/deliverables/${id}`, {
                state: { success: "Submission successful!" }
            });
        } catch (err) {
            setError(err.response?.data?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar/>
           <ParticipantSidebar />

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold">Submit Deliverable</h2>
                                    <p className="text-muted">
                                        {deliverable?.title || "Loading assignment..."}
                                    </p>
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
                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Submission Notes</label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={formData.submissionNotes}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    submissionNotes: e.target.value
                                                }))}
                                                placeholder="Add any notes about your submission..."
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold">Attachments</label>
                                            <div className="border rounded p-3 text-center">
                                                <FiUpload className="display-4 text-muted mb-3" />
                                                <p className="text-muted">
                                                    Drag and drop files here or click to browse
                                                </p>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={handleFileChange}
                                                    multiple
                                                />
                                                {formData.files.length > 0 && (
                                                    <div className="mt-3">
                                                        <small className="text-muted">
                                                            Selected files: {formData.files.map(f => f.name).join(", ")}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {uploadProgress > 0 && uploadProgress < 100 && (
                                            <div className="mb-3">
                                                <ProgressBar
                                                    now={uploadProgress}
                                                    label={`${uploadProgress}%`}
                                                    className="rounded-pill"
                                                />
                                            </div>
                                        )}

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
                                                Submit Deliverable
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

export default SubmitDeliverableForm;