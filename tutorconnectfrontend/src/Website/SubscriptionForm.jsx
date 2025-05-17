import React from 'react';
import { useState } from 'react';
import axiosClient from '../api/axiosClient';

const SubscriptionForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        purpose: '',
        experience: '',
        message: '',
        status: 'PENDING'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({
        success: false,
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ success: false, message: '' });

        try {
            const response = await axiosClient.post('/demands', {
                ...formData,
                createdAt: new Date().toISOString()
            });
            setSubmitStatus({
                success: true,
                message: 'Your application has been submitted successfully!'
            });
            // Reset form
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                purpose: '',
                experience: '',
                message: '',
                status: 'PENDING'
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus({
                success: false,
                message: error.response?.data?.message || 'Submission error. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="subscription-form-section" id="contact">
            <div className="container">
                <div className="form-header">
                    <h2>Become a Tutor</h2>
                    <p>Join our network of professional tutors and share your knowledge with students worldwide</p>
                </div>

                <div className="form-container">
                    {submitStatus.message && (
                        <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
                            {submitStatus.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email <span className="required">*</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="johndoe@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone">Phone <span className="required">*</span></label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="+1 (123) 456-7890"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="purpose">Teaching Purpose <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="purpose"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="e.g., Web Development, Mathematics"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label htmlFor="experience">Experience Level <span className="required">*</span></label>
                                <select
                                    id="experience"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Select your experience level</option>
                                    <option value="Beginner">Beginner (1-2 years)</option>
                                    <option value="Intermediate">Intermediate (3-5 years)</option>
                                    <option value="Advanced">Advanced (5+ years)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group full-width">
                                <label htmlFor="message">Additional Information</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="4"
                                    placeholder="Tell us about your teaching experience and qualifications..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="form-submit">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="submit-btn"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SubscriptionForm;