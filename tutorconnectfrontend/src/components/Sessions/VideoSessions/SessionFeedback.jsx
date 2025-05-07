import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../../api/axiosClient';

const SessionFeedback = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState({
        rating: 0,
        comments: '',
        technicalIssues: false,
        wouldRecommend: true
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleRatingChange = (rating) => {
        setFeedback({ ...feedback, rating });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFeedback({
            ...feedback,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await axiosClient.post(`/sessions/${sessionId}/feedback`, feedback);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <div className="alert alert-success">
                            <h4>Thank you for your feedback!</h4>
                            <p>Redirecting to your dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-info text-white">
                            <h3>Session Feedback</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <h5>How would you rate this session?</h5>
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`star-btn ${feedback.rating >= star ? 'active' : ''}`}
                                                onClick={() => handleRatingChange(star)}
                                            >
                                                <i className="bi bi-star-fill"></i>
                                            </button>
                                        ))}
                                    </div>
                                    <small className="text-muted">
                                        1 = Poor, 5 = Excellent
                                    </small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="comments" className="form-label">
                                        Additional Comments
                                    </label>
                                    <textarea
                                        id="comments"
                                        name="comments"
                                        className="form-control"
                                        rows="4"
                                        value={feedback.comments}
                                        onChange={handleChange}
                                        placeholder="What did you like or dislike about the session?"
                                    ></textarea>
                                </div>

                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="technicalIssues"
                                        name="technicalIssues"
                                        checked={feedback.technicalIssues}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="technicalIssues">
                                        I experienced technical issues during the session
                                    </label>
                                </div>

                                <div className="mb-4 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="wouldRecommend"
                                        name="wouldRecommend"
                                        checked={feedback.wouldRecommend}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="wouldRecommend">
                                        I would recommend this tutor to others
                                    </label>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate(`/sessions/${sessionId}`)}
                                    >
                                        Back to Session
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submitting || feedback.rating === 0}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Feedback'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionFeedback;