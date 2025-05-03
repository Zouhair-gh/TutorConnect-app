import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GradeDeliverableModal from './GradeDeliverableModal';
import deliverableService from './deliverableService'

const GradeDeliverablePage = () => {
    const { roomId, deliverableId, submissionId } = useParams();
    const navigate = useNavigate();
    const [deliverable, setDeliverable] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGradeModal, setShowGradeModal] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const deliverableData = await deliverableService.getDeliverableById(deliverableId);
                setDeliverable(deliverableData);

                // Replace this with real submission data from API
                setSubmission({
                    id: submissionId,
                    studentName: "Student Name",
                    submissionDate: new Date().toISOString(),
                    content: "Submission content would be here",
                    attachments: [],
                    grade: deliverableData.grade,
                    feedback: deliverableData.feedback
                });
            } catch (err) {
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deliverableId, submissionId]);

    const handleGradeSubmit = async (gradeData) => {
        try {
            await deliverableService.gradeDeliverable({
                deliverableId,
                submissionId,
                grade: gradeData.grade,
                feedback: gradeData.feedback
            });

            setShowGradeModal(false);
            navigate(`/rooms/${roomId}/deliverables`);
        } catch (err) {
            setError(`Error submitting grade: ${err.message}`);
        }
    };

    const handleCloseModal = () => {
        setShowGradeModal(false);
        navigate(`/rooms/${roomId}/deliverables`);
    };

    if (loading)
        return <div className="container mt-4"><div className="alert alert-info">Loading submission details...</div></div>;

    if (error)
        return <div className="container mt-4"><div className="alert alert-danger">Error: {error}</div></div>;

    if (!deliverable)
        return <div className="container mt-4"><div className="alert alert-warning">Deliverable not found</div></div>;

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4>Grade Submission: {deliverable.title}</h4>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate(`/rooms/${roomId}/deliverables`)}
                    >
                        Back to Deliverables
                    </button>
                </div>

                <div className="card-body">
                    <h5>Submission Details</h5>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p><strong>Student:</strong> {submission.studentName}</p>
                            <p><strong>Submitted on:</strong> {new Date(submission.submissionDate).toLocaleString()}</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <p><strong>Maximum Points:</strong> {deliverable.maxPoints}</p>
                            {submission.grade && (
                                <p><strong>Current Grade:</strong> {submission.grade} / {deliverable.maxPoints}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h6>Submission Content</h6>
                        <div className="border rounded p-3 bg-light">
                            {submission.content}
                        </div>
                    </div>

                    {submission.attachments?.length > 0 && (
                        <div className="mb-4">
                            <h6>Attachments</h6>
                            <ul className="list-group">
                                {submission.attachments.map((attachment, index) => (
                                    <li key={index} className="list-group-item">
                                        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                            {attachment.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowGradeModal(true)}
                        >
                            {submission.grade ? 'Update Grade' : 'Grade Submission'}
                        </button>
                    </div>
                </div>
            </div>

            <GradeDeliverableModal
                isOpen={showGradeModal}
                onClose={handleCloseModal}
                deliverable={deliverable}
                onSubmit={handleGradeSubmit}
            />
        </div>
    );
};

export default GradeDeliverablePage;
