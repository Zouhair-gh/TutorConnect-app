import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const GradeDeliverableModal = ({ isOpen, onClose, deliverable, onSubmit }) => {
    const [gradeData, setGradeData] = useState({
        grade: '',
        feedback: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (deliverable) {
            setGradeData({
                grade: deliverable.grade || '',
                feedback: deliverable.feedback || ''
            });
        }
    }, [deliverable]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGradeData({
            ...gradeData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!gradeData.grade) {
            newErrors.grade = 'Grade is required';
        } else {
            const gradeValue = parseInt(gradeData.grade, 10);
            if (isNaN(gradeValue) || gradeValue < 0) {
                newErrors.grade = 'Grade must be a non-negative number';
            } else if (deliverable && gradeValue > deliverable.maxPoints) {
                newErrors.grade = `Grade cannot exceed maximum points (${deliverable.maxPoints})`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                ...gradeData,
                grade: parseInt(gradeData.grade, 10)
            });
        }
    };

    if (!deliverable) return null;

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Grade Assignment: {deliverable.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="grade" className="form-label">
                            Grade (Out of {deliverable.maxPoints} points) *
                        </label>
                        <input
                            type="number"
                            className={`form-control ${errors.grade ? 'is-invalid' : ''}`}
                            id="grade"
                            name="grade"
                            value={gradeData.grade}
                            onChange={handleInputChange}
                            min="0"
                            max={deliverable.maxPoints}
                        />
                        {errors.grade && <div className="invalid-feedback">{errors.grade}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="feedback" className="form-label">Feedback</label>
                        <textarea
                            className="form-control"
                            id="feedback"
                            name="feedback"
                            value={gradeData.feedback}
                            onChange={handleInputChange}
                            rows="5"
                            placeholder="Provide feedback to the student about their work..."
                        ></textarea>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Submit Grade
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

GradeDeliverableModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    deliverable: PropTypes.object,
    onSubmit: PropTypes.func.isRequired
};

export default GradeDeliverableModal;