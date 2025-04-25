import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const SubscriptionForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        purpose: '',  // Only keeping purpose
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
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Become a Tutor</h4>
                            </div>
                        </div>
                        <div className="card-body">
                            {submitStatus.message && (
                                <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
                                    {submitStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Phone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Teaching Purpose *</label>
                                            <input
                                                type="text"
                                                name="purpose"
                                                value={formData.purpose}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Experience *</label>
                                            <select
                                                name="experience"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            >
                                                <option value="">Select...</option>
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label>Additional Information</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="form-control"
                                                rows="4"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-primary"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
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

export default SubscriptionForm;