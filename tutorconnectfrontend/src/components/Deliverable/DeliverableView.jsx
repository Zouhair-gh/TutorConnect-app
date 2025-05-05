import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

import {
    FiFileText,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiDownload,
    FiArrowLeft,
    FiUpload
} from "react-icons/fi";
import { Badge, ListGroup, Button } from "react-bootstrap";

import CommentsSection from "./CommentsSection";

const DeliverableView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deliverable, setDeliverable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDeliverable = async () => {
        try {
            const response = await axiosClient.get(`/deliverables/${id}`);
            setDeliverable(response.data);
        } catch (err) {
            setError("Failed to fetch deliverable details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliverable();
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!deliverable) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="alert alert-danger">{error || "Deliverable not found"}</div>
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
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="btn btn-outline-secondary rounded-pill px-3 me-3"
                                    >
                                        <FiArrowLeft className="me-1" /> Back
                                    </button>
                                    <h2 className="fw-bold d-inline-block">{deliverable.title}</h2>
                                </div>
                                {!deliverable.isSubmitted && deliverable.isVisible && (
                                    <Link
                                        to={`/participant/deliverables/${id}/submit`}
                                        className="btn btn-primary rounded-pill px-4"
                                    >
                                        <FiUpload className="me-1" /> Submit
                                    </Link>
                                )}
                            </div>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}

                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold">Description</h5>
                                            <p className="card-text">{deliverable.description}</p>

                                            <div className="d-flex align-items-center mb-3">
                                                <FiCalendar className="me-2 text-primary" />
                                                <div>
                                                    <small className="text-muted">Deadline</small>
                                                    <p className="mb-0 fw-bold">
                                                        {new Date(deliverable.deadline).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            {deliverable.isSubmitted && (
                                                <>
                                                    <hr />
                                                    <h5 className="fw-bold mt-4">Your Submission</h5>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <FiCalendar className="me-2 text-primary" />
                                                        <div>
                                                            <small className="text-muted">Submitted on</small>
                                                            <p className="mb-0 fw-bold">
                                                                {new Date(deliverable.submissionDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {deliverable.filePath && (
                                                        <div className="mb-3">
                                                            <Button
                                                                variant="outline-primary"
                                                                onClick={() => window.open(deliverable.filePath, '_blank')}
                                                            >
                                                                <FiDownload className="me-2" />
                                                                Download Submission
                                                            </Button>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {deliverable.grade !== null && (
                                                <>
                                                    <hr />
                                                    <h5 className="fw-bold mt-4">Grading</h5>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <FiCheckCircle className="me-2 text-success" />
                                                        <div>
                                                            <small className="text-muted">Grade</small>
                                                            <p className="mb-0 fw-bold">
                                                                {deliverable.grade} / {deliverable.maxPoints}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <small className="text-muted">Feedback</small>
                                                        <p className="mb-0">{deliverable.feedback || "No feedback provided"}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <CommentsSection deliverableId={id} />
                                </div>

                                <div className="col-lg-4">
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold">Details</h5>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item className="d-flex align-items-center border-0 py-3">
                                                    <div className="me-3">
                                                        <FiFileText className="text-primary" size={20} />
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Course</small>
                                                        <p className="mb-0 fw-bold">{deliverable.courseName}</p>
                                                    </div>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex align-items-center border-0 py-3">
                                                    <div className="me-3">
                                                        <FiClock className="text-primary" size={20} />
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Status</small>
                                                        <div>
                                                            {deliverable.isSubmitted ? (
                                                                <Badge bg="success" pill>Submitted</Badge>
                                                            ) : new Date(deliverable.deadline) < new Date() ? (
                                                                <Badge bg="danger" pill>Overdue</Badge>
                                                            ) : (
                                                                <Badge bg="warning" text="dark" pill>Pending</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                                <ListGroup.Item className="d-flex align-items-center border-0 py-3">
                                                    <div className="me-3">
                                                        <FiCheckCircle className="text-primary" size={20} />
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Points</small>
                                                        <p className="mb-0 fw-bold">{deliverable.maxPoints} points</p>
                                                    </div>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    </div>

                                    {deliverable.attachments && deliverable.attachments.length > 0 && (
                                        <div className="card border-0 shadow-sm mb-4">
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold">Attachments</h5>
                                                <ListGroup variant="flush">
                                                    {deliverable.attachments.map((attachment, index) => (
                                                        <ListGroup.Item
                                                            key={index}
                                                            className="d-flex align-items-center border-0 py-3"
                                                        >
                                                            <div className="me-3">
                                                                <FiFileText className="text-primary" size={20} />
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <p className="mb-0 fw-bold">{attachment.name}</p>
                                                                <small className="text-muted">
                                                                    {attachment.size && `${Math.round(attachment.size / 1024)} KB`}
                                                                </small>
                                                            </div>
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => window.open(attachment.url, '_blank')}
                                                            >
                                                                <FiDownload size={16} />
                                                            </Button>
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeliverableView;