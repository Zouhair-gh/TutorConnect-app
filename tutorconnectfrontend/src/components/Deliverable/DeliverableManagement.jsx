import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Link } from 'react-router-dom';

const DeliverableManagement = () => {
    const { roomId } = useParams();
    const [deliverables, setDeliverables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newDeliverable, setNewDeliverable] = useState({
        title: '',
        description: '',
        deadline: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchDeliverables();
    }, [roomId]);

    const fetchDeliverables = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/deliverables/room/${roomId}`);
            setDeliverables(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching deliverables:', err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                // Handle authentication errors
                localStorage.removeItem('authToken');
                navigate('/login');
            } else {
                setError('Failed to load deliverables. Please try again.');
                setLoading(false);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDeliverable({ ...newDeliverable, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }

            await axiosClient.post('/deliverables', {
                title: newDeliverable.title,
                description: newDeliverable.description,
                deadline: newDeliverable.deadline,
                roomId: parseInt(roomId)
            });

            // Reset form and refresh data
            setNewDeliverable({
                title: '',
                description: '',
                deadline: ''
            });

            fetchDeliverables();
        } catch (err) {
            console.error('Error creating deliverable:', err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                // Handle authentication errors
                localStorage.removeItem('authToken');
                navigate('/login');
            } else {
                setError('Failed to create deliverable. Please try again.');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this deliverable?')) {
            try {
                await axiosClient.delete(`/deliverables/${id}`);
                fetchDeliverables();
            } catch (err) {
                console.error('Error deleting deliverable:', err);
                if (err.response?.status === 403 || err.response?.status === 401) {
                    // Handle authentication errors
                    localStorage.removeItem('authToken');
                    navigate('/login');
                } else {
                    setError('Failed to delete deliverable. Please try again.');
                }
            }
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Not submitted';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col">
                    <h2>Room Assignments</h2>
                    <Link to={`/tutor/rooms/${roomId}/manage`} className="btn btn-secondary mb-3">
                        Back to Room Management
                    </Link>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>Create New Assignment</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={newDeliverable.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={newDeliverable.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="deadline" className="form-label">Deadline</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="deadline"
                                        name="deadline"
                                        value={newDeliverable.deadline}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Create Assignment</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h4>Existing Assignments</h4>
                        </div>
                        <div className="card-body">
                            {deliverables.length === 0 ? (
                                <p>No assignments found for this room.</p>
                            ) : (
                                <div className="list-group">
                                    {deliverables.map((deliverable) => (
                                        <div key={deliverable.id} className="list-group-item list-group-item-action">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{deliverable.title}</h5>
                                                <small>Deadline: {formatDate(deliverable.deadline)}</small>
                                            </div>
                                            <p className="mb-1">{deliverable.description}</p>
                                            <small>
                                                Status: {deliverable.submitted ? 'Submitted' : 'Not Submitted'}
                                                {deliverable.submitted &&
                                                    ` on ${formatDate(deliverable.submissionDate)}`}
                                            </small>
                                            <div className="mt-2">
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(deliverable.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliverableManagement;