import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const CreateUserForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        cin: '',
        phoneNumber: '',
        birthDate: '',
        gender: '',
        username: '',
        role: 'PARTICIPANT',
        specialites: '',
        bibliographie: '',
        specialiter: '',
        nbrAnneeExp: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Convert birthDate to SQL date format (if provided)
            const payload = {
                ...formData
            };

            // Convert numeric fields to numbers
            if (formData.role === 'STAFF' && formData.nbrAnneeExp) {
                payload.nbrAnneeExp = parseInt(formData.nbrAnneeExp);
            }

            const response = await axiosClient.post('/admin/users', payload);
            setSuccess('User created successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                cin: '',
                phoneNumber: '',
                birthDate: '',
                gender: '',
                username: '',
                role: 'PARTICIPANT',
                specialites: '',
                bibliographie: '',
                specialiter: '',
                nbrAnneeExp: ''
            });

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create user');
        }
    };

    return (
        <div className="container p-4">
            <h2 className="mb-4">Create New User</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
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

                    <div className="col-md-6 mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select
                            className="form-control"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="PARTICIPANT">Participant</option>
                            <option value="TUTOR">Tutor</option>
                            <option value="STAFF">Staff</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="cin" className="form-label">CIN</label>
                        <input
                            type="text"
                            className="form-control"
                            id="cin"
                            name="cin"
                            value={formData.cin}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="birthDate" className="form-label">Birth Date</label>
                        <input
                            type="date"
                            className="form-control"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select
                            className="form-control"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Conditional fields based on role */}
                {formData.role === 'TUTOR' && (
                    <div className="mb-3">
                        <label htmlFor="specialites" className="form-label">Specialities</label>
                        <input
                            type="text"
                            className="form-control"
                            id="specialites"
                            name="specialites"
                            value={formData.specialites}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {formData.role === 'STAFF' && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="bibliographie" className="form-label">Bibliography</label>
                            <textarea
                                className="form-control"
                                id="bibliographie"
                                name="bibliographie"
                                value={formData.bibliographie}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="specialiter" className="form-label">Speciality</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="specialiter"
                                    name="specialiter"
                                    value={formData.specialiter}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label htmlFor="nbrAnneeExp" className="form-label">Years of Experience</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="nbrAnneeExp"
                                    name="nbrAnneeExp"
                                    value={formData.nbrAnneeExp}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-4">
                    <button type="submit" className="btn btn-primary">Create User</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/users')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUserForm;