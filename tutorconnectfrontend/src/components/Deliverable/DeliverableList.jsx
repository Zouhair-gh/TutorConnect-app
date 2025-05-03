import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import DeliverableDetailModal from './DeliverableDetailModal';
import GradeDeliverableModal from './GradeDeliverableModal';

// Helper function for calculating days difference - moved outside component
const getDaysDifference = (dateString) => {
    if (!dateString) return null;

    const deadline = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

// Helper function for badge styling - moved outside component
const getStatusBadgeStyle = (deliverable) => {
    if (deliverable.isSubmitted) {
        return deliverable.grade
            ? { backgroundColor: '#28a745', color: 'white' } // Green for graded
            : { backgroundColor: '#17a2b8', color: 'white' }; // Blue for submitted
    } else if (deliverable.isPastDeadline) {
        return { backgroundColor: '#dc3545', color: 'white' }; // Red for late
    } else {
        const daysLeft = getDaysDifference(deliverable.deadline);
        if (daysLeft <= 1) {
            return { backgroundColor: '#ffc107', color: '#212529' }; // Yellow warning
        }
        return { backgroundColor: '#007bff', color: 'white' }; // Blue for pending
    }
};

const DeliverableList = ({
                             deliverables,
                             onDelete,
                             onEdit,
                             onGrade,
                             onToggleVisibility,
                             isTutor = false
                         }) => {
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [gradeModalOpen, setGradeModalOpen] = useState(false);
    const [selectedDeliverable, setSelectedDeliverable] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const openDetailModal = (deliverable) => {
        setSelectedDeliverable(deliverable);
        setDetailModalOpen(true);
    };

    const openGradeModal = (deliverable) => {
        setSelectedDeliverable(deliverable);
        setGradeModalOpen(true);
    };

    const closeDetailModal = () => {
        setDetailModalOpen(false);
        setSelectedDeliverable(null);
    };

    const closeGradeModal = () => {
        setGradeModalOpen(false);
        setSelectedDeliverable(null);
    };

    const handleGradeSubmit = (gradeData) => {
        onGrade(selectedDeliverable.id, gradeData);
        closeGradeModal();
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter deliverables based on search and status
    const filteredDeliverables = deliverables.filter(deliverable => {
        const matchesSearch =
            deliverable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deliverable.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (deliverable.participantName &&
                deliverable.participantName.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filterStatus === 'all') {
            return matchesSearch;
        }

        switch(filterStatus) {
            case 'pending':
                return !deliverable.isSubmitted && !deliverable.isPastDeadline && matchesSearch;
            case 'submitted':
                return deliverable.isSubmitted && !deliverable.grade && matchesSearch;
            case 'graded':
                return deliverable.isSubmitted && !!deliverable.grade && matchesSearch;
            case 'late':
                return deliverable.isPastDeadline && !deliverable.isSubmitted && matchesSearch;
            case 'hidden':
                return !deliverable.isVisible && matchesSearch;
            default:
                return matchesSearch;
        }
    });

    // Group deliverables by participant if tutor view
    const groupedDeliverables = isTutor ?
        filteredDeliverables.reduce((acc, deliverable) => {
            const participantId = deliverable.participantId || 'unassigned';
            if (!acc[participantId]) {
                acc[participantId] = {
                    participantName: deliverable.participantName || 'Unassigned',
                    deliverables: []
                };
            }
            acc[participantId].deliverables.push(deliverable);
            return acc;
        }, {}) : {};

    return (
        <div className="card">
            <div className="card-header bg-light">
                <div className="row align-items-center">
                    <div className="col-md-6 mb-2 mb-md-0">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search assignments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Assignments</option>
                            <option value="pending">Pending</option>
                            <option value="submitted">Submitted (Not Graded)</option>
                            <option value="graded">Graded</option>
                            <option value="late">Late</option>
                            {isTutor && <option value="hidden">Hidden</option>}
                        </select>
                    </div>
                </div>
            </div>
            <div className="card-body">
                {isTutor ? (
                    // Tutor view - grouped by participant
                    Object.keys(groupedDeliverables).length === 0 ? (
                        <div className="alert alert-info">
                            No assignments found matching your criteria.
                        </div>
                    ) : (
                        <div className="accordion" id="participantAccordion">
                            {Object.entries(groupedDeliverables).map(([participantId, group]) => (
                                <div className="accordion-item" key={participantId}>
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#participant-${participantId}`}
                                        >
                                            <div className="d-flex justify-content-between w-100 align-items-center pe-3">
                                                <span>{group.participantName}</span>
                                                <span className="badge bg-secondary rounded-pill">
                                                    {group.deliverables.length} Assignment(s)
                                                </span>
                                            </div>
                                        </button>
                                    </h2>
                                    <div
                                        id={`participant-${participantId}`}                                         className="accordion-collapse collapse"
                                        data-bs-parent="#participantAccordion"
                                    >
                                        <div className="accordion-body">
                                            <div className="list-group">
                                                {group.deliverables.map(deliverable => (
                                                    <div key={deliverable.id} className="list-group-item">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div className="me-3">
                                                                <h5 className="mb-1">
                                                                    <span
                                                                        className="badge me-2"
                                                                        style={{
                                                                            width: '80px',
                                                                            ...getStatusBadgeStyle(deliverable)
                                                                        }}
                                                                    >
                                                                        {deliverable.status}
                                                                    </span>
                                                                    {deliverable.title}
                                                                </h5>
                                                                <small className="text-muted">
                                                                    Deadline: {formatDate(deliverable.deadline)}
                                                                    {!deliverable.isSubmitted && deliverable.deadline && (
                                                                        <span className="ms-2">
                                                                            ({getDaysDifference(deliverable.deadline)} days left)
                                                                        </span>
                                                                    )}
                                                                </small>
                                                                {deliverable.isSubmitted && (
                                                                    <div className="mt-2">
                                                                        <small>
                                                                            Submitted on: {formatDate(deliverable.submissionDate)}
                                                                        </small>
                                                                        {deliverable.grade && (
                                                                            <span className="ms-3">
                                                                                Grade: <strong>{deliverable.grade}/{deliverable.maxPoints}</strong>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => openDetailModal(deliverable)}
                                                                >
                                                                    <i className="bi bi-eye"></i> View
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                    onClick={() => onEdit(deliverable)}
                                                                >
                                                                    <i className="bi bi-pencil"></i> Edit
                                                                </button>
                                                                {!deliverable.isSubmitted && (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-success"
                                                                        onClick={() => onToggleVisibility(deliverable.id, deliverable.isVisible)}
                                                                    >
                                                                        {deliverable.isVisible ? (
                                                                            <>
                                                                                <i className="bi bi-eye-slash"></i> Hide
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <i className="bi bi-eye"></i> Publish
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                )}
                                                                {deliverable.isSubmitted && !deliverable.grade && (
                                                                    <button
                                                                        className="btn btn-sm btn-warning"
                                                                        onClick={() => openGradeModal(deliverable)}
                                                                    >
                                                                        <i className="bi bi-check-circle"></i> Grade
                                                                    </button>
                                                                )}
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => onDelete(deliverable.id)}
                                                                >
                                                                    <i className="bi bi-trash"></i> Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    // Student view - simple list
                    filteredDeliverables.length === 0 ? (
                        <div className="alert alert-info">
                            No assignments found matching your criteria.
                        </div>
                    ) : (
                        <div className="list-group">
                            {filteredDeliverables.map(deliverable => (
                                <div key={deliverable.id} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="me-3">
                                            <h5 className="mb-1">
                                                <span
                                                    className="badge me-2"
                                                    style={{
                                                        width: '80px',
                                                        ...getStatusBadgeStyle(deliverable)
                                                    }}
                                                >
                                                    {deliverable.status}
                                                </span>
                                                {deliverable.title}
                                            </h5>
                                            <small className="text-muted">
                                                Deadline: {formatDate(deliverable.deadline)}
                                                {!deliverable.isSubmitted && deliverable.deadline && (
                                                    <span className="ms-2">
                                                        ({getDaysDifference(deliverable.deadline)} days left)
                                                    </span>
                                                )}
                                            </small>
                                            {deliverable.isSubmitted && (
                                                <div className="mt-2">
                                                    <small>
                                                        Submitted on: {formatDate(deliverable.submissionDate)}
                                                    </small>
                                                    {deliverable.grade && (
                                                        <span className="ms-3">
                                                            Grade: <strong>{deliverable.grade}/{deliverable.maxPoints}</strong>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="btn-group">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => openDetailModal(deliverable)}
                                            >
                                                <i className="bi bi-eye"></i> View
                                            </button>
                                            {!deliverable.isSubmitted && deliverable.isVisible && (
                                                <Link
                                                    to={`/submit-deliverable/${deliverable.id}`}
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    <i className="bi bi-upload"></i> Submit
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            {/* Detail Modal */}
            <DeliverableDetailModal
                isOpen={detailModalOpen}
                onClose={closeDetailModal}
                deliverable={selectedDeliverable}
                formatDate={formatDate}
                isTutor={isTutor}
            />

            {/* Grade Modal (for tutors only) */}
            {isTutor && (
                <GradeDeliverableModal
                    isOpen={gradeModalOpen}
                    onClose={closeGradeModal}
                    deliverable={selectedDeliverable}
                    onSubmit={handleGradeSubmit}
                />
            )}
        </div>
    );
};

DeliverableList.propTypes = {
    deliverables: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onGrade: PropTypes.func.isRequired,
    onToggleVisibility: PropTypes.func.isRequired,
    isTutor: PropTypes.bool
};

export default DeliverableList;