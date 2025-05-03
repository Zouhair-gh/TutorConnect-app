import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DeliverableDetailModal = ({ isOpen, onClose, deliverable, formatDate, isTutor }) => {
    if (!deliverable) return null;

    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{deliverable.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <h6 className="text-muted">Assignment Details</h6>
                    <div className="card">
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Deadline:</strong> {formatDate(deliverable.deadline)}
                                </div>
                                <div className="col-md-6">
                                    <strong>Maximum Points:</strong> {deliverable.maxPoints}
                                </div>
                            </div>
                            {isTutor && deliverable.participantName && (
                                <div className="mb-3">
                                    <strong>Assigned to:</strong> {deliverable.participantName}
                                </div>
                            )}
                            {deliverable.isSubmitted && (
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <strong>Submission Date:</strong> {formatDate(deliverable.submissionDate)}
                                    </div>
                                    {deliverable.grade !== null && (
                                        <div className="col-md-6">
                                            <strong>Grade:</strong> {deliverable.grade}/{deliverable.maxPoints}
                                        </div>
                                    )}
                                </div>
                            )}
                            <h6>Description</h6>
                            <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                                {deliverable.description}
                            </p>
                            {deliverable.attachmentUrl && (
                                <div className="mt-3">
                                    <h6>Reference Materials</h6>
                                    <a href={deliverable.attachmentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                        <i className="bi bi-file-earmark"></i> View Reference Materials
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {deliverable.isSubmitted && (
                    <div className="mb-4">
                        <h6 className="text-muted">Submission</h6>
                        <div className="card">
                            <div className="card-body">
                                {deliverable.submissionText && (
                                    <>
                                        <h6>Student's Response</h6>
                                        <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                                            {deliverable.submissionText}
                                        </p>
                                    </>
                                )}
                                {deliverable.submissionFileUrl && (
                                    <div className="mt-3">
                                        <h6>Submission File</h6>
                                        <a href={deliverable.submissionFileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                            <i className="bi bi-file-earmark-arrow-down"></i> Download Submission
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {deliverable.isSubmitted && deliverable.grade !== null && deliverable.feedback && (
                    <div>
                        <h6 className="text-muted">Feedback</h6>
                        <div className="card">
                            <div className="card-body">
                                <p style={{ whiteSpace: 'pre-wrap' }}>{deliverable.feedback}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

DeliverableDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    deliverable: PropTypes.object,
    formatDate: PropTypes.func.isRequired,
    isTutor: PropTypes.bool
};

export default DeliverableDetailModal;