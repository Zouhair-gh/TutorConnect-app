import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DeliverableForm = ({ roomId, participants, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        maxPoints: 100,
        assignedParticipantIds: [],
        attachmentUrl: '',
        isVisible: true,
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleParticipantSelection = (e) => {
        const { value, checked } = e.target;
        const participantId = parseInt(value);

        setFormData((prevState) => {
            if (checked) {
                return {
                    ...prevState,
                    assignedParticipantIds: [...prevState.assignedParticipantIds, participantId],
                };
            } else {
                return {
                    ...prevState,
                    assignedParticipantIds: prevState.assignedParticipantIds.filter((id) => id !== participantId),
                };
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.deadline) newErrors.deadline = 'Deadline is required';
        if (formData.maxPoints <= 0) newErrors.maxPoints = 'Maximum points must be greater than 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="card">
            <div className="card-header bg-primary text-white">
                <h3 className="card-title mb-0">Create Deliverable</h3>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Title*</label>
                        <input
                            type="text"
                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description*</label>
                        <textarea
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Deadline*</label>
                            <input
                                type="date"
                                className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleInputChange}
                            />
                            {errors.deadline && <div className="invalid-feedback">{errors.deadline}</div>}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Max Points*</label>
                            <input
                                type="number"
                                className={`form-control ${errors.maxPoints ? 'is-invalid' : ''}`}
                                name="maxPoints"
                                value={formData.maxPoints}
                                onChange={handleInputChange}
                                min="1"
                            />
                            {errors.maxPoints && <div className="invalid-feedback">{errors.maxPoints}</div>}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Attachment URL (Optional)</label>
                        <input
                            type="text"
                            className="form-control"
                            name="attachmentUrl"
                            value={formData.attachmentUrl}
                            onChange={handleInputChange}
                            placeholder="https://example.com/materials"
                        />
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            name="isVisible"
                            checked={formData.isVisible}
                            onChange={handleInputChange}
                        />
                        <label className="form-check-label">Make assignment visible</label>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Assign Participants</label>
                        {participants.map((participant) => (
                            <div key={participant.id} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    value={participant.id}
                                    checked={formData.assignedParticipantIds.includes(participant.id)}
                                    onChange={handleParticipantSelection}
                                />
                                <label className="form-check-label">
                                    {participant.firstName} {participant.lastName}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Deliverable
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

DeliverableForm.propTypes = {
    roomId: PropTypes.string.isRequired,
    participants: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default DeliverableForm;
