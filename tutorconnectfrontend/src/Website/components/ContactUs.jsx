import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Import the envelope icon

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here (e.g., send data to a server)
        alert('Form submitted!');
        setFormData({ name: '', email: '', message: '' }); // Clear form after submission
    };

    return (
        <div className="contact-us">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h2 className="section-title">Contact Us</h2>
                        <p>If you have any questions or need further assistance, feel free to reach out to us!</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Your Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Your Message</label>
                                <textarea
                                    className="form-control"
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn">Submit</button>
                        </form>
                    </div>
                    <div className="col-md-6">
                        <div className="contact-icon">
                            <FontAwesomeIcon icon={faEnvelope} size="5x" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
