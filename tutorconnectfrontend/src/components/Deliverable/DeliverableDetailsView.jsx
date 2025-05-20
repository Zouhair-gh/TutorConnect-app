import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { FiArrowLeft, FiUpload, FiDownload, FiCalendar, FiFileText } from 'react-icons/fi';
import { Badge, Button, ListGroup, Alert, ProgressBar } from 'react-bootstrap';
import NavBar from "../../layouts/NavBar";
import ParticipantSideBar from "../../layouts/SideBars/ParticipantSidebar";


const DeliverableDetailsView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deliverable, setDeliverable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDeliverable = async () => {
            try {
                const response = await axiosClient.get(`/deliverables/${id}`);
                setDeliverable(response.data);
            } catch (err) {
                setError('Failed to load deliverable details');
            } finally {
                setLoading(false);
            }
        };

        fetchDeliverable();
    }, [id]);

    const calculateDaysLeft = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate - now;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">

            </div>
        );
    }

    return (
        <>
            <NavBar />
            <ParticipantSideBar />

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <Button
                                variant="outline-secondary"
                                className="mb-4"
                                onClick={() => navigate(-1)}
                            >
                                <FiArrowLeft className="me-2" />
                                Back to List
                            </Button>

                            {error && <Alert variant="danger">{error}</Alert>}

                            {deliverable && (
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-4">
                                            <div>
                                                <h2>{deliverable.title}</h2>
                                                <p className="text-muted">{deliverable.description}</p>
                                            </div>
                                            {!deliverable.isSubmitted && deliverable.isVisible && (
                                                <Link
                                                    to={`/participant/deliverables/${deliverable.id}/submit`}
                                                    className="btn btn-primary"
                                                >
                                                    <FiUpload className="me-2" />
                                                    Submit Assignment
                                                </Link>
                                            )}
                                        </div>

                                        <div className="row">
                                            <div className="col-md-8">
                                                <ListGroup variant="flush">
                                                    <ListGroup.Item className="d-flex align-items-center">
                                                        <FiCalendar className="me-3 text-primary" size={20} />
                                                        <div>
                                                            <small className="text-muted">Deadline</small>
                                                            <h5 className="mb-0">
                                                                {new Date(deliverable.deadline).toLocaleDateString()}
                                                                <Badge
                                                                    bg={calculateDaysLeft(deliverable.deadline) > 3 ? 'success' : 'danger'}
                                                                    className="ms-3"
                                                                >
                                                                    {calculateDaysLeft(deliverable.deadline)} days left
                                                                </Badge>
                                                            </h5>
                                                        </div>
                                                    </ListGroup.Item>

                                                    {deliverable.filePath && (
                                                        <ListGroup.Item className="d-flex align-items-center">
                                                            <FiDownload className="me-3 text-primary" size={20} />
                                                            <div>
                                                                <small className="text-muted">Your Submission</small>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        onClick={() => window.open(deliverable.filePath, '_blank')}
                                                                    >
                                                                        Download File
                                                                    </Button>
                                                                    <span className="text-muted">
                                                                        Submitted on {new Date(deliverable.submissionDate).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </ListGroup.Item>
                                                    )}
                                                </ListGroup>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="card border-0 shadow-sm">
                                                    <div className="card-body">
                                                        <h5 className="card-title">Details</h5>
                                                        <dl className="mb-0">
                                                            <dt>Course</dt>
                                                            <dd>{deliverable.roomName}</dd>

                                                            <dt>Max Points</dt>
                                                            <dd>{deliverable.maxPoints}</dd>

                                                            {deliverable.grade !== null && (
                                                                <>
                                                                    <dt>Your Grade</dt>
                                                                    <dd>
                                                                        {deliverable.grade}/{deliverable.maxPoints}
                                                                        {deliverable.feedback && (
                                                                            <div className="text-muted small mt-1">
                                                                                Feedback: {deliverable.feedback}
                                                                            </div>
                                                                        )}
                                                                    </dd>
                                                                </>
                                                            )}
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeliverableDetailsView;