import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Link } from 'react-router-dom';
import DeliverableForm from './DeliverableFormWrapper';
import DeliverableList from './DeliverableList';
import DeliverableStats from './DeliverableStats';
import { toast } from 'react-toastify';
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";
import Navbar from "../../layouts/NavBar";

import { FiArrowLeft, FiList, FiPlusCircle, FiBarChart2 } from "react-icons/fi";

const DeliverableManagement = () => {
    const { roomId } = useParams();
    const [deliverables, setDeliverables] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('list'); // list, create, stats
    const [selectedDeliverable, setSelectedDeliverable] = useState(null);
    const navigate = useNavigate();

    // Fetch both deliverables and participants on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch deliverables for this room
                const deliverablesResponse = await axiosClient.get(`/deliverables/room/${roomId}`);
                setDeliverables(deliverablesResponse.data);

                // Fetch participants in this room
                const roomResponse = await axiosClient.get(`/rooms/${roomId}`);
                setParticipants(roomResponse.data.participants || []);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                handleApiError(err);
            }
        };

        fetchData();
    }, [roomId, navigate]);

    const fetchDeliverables = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/deliverables/room/${roomId}`);
            setDeliverables(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching deliverables:', err);
            handleApiError(err);
        }
    }, [roomId, navigate]);

    const handleApiError = (err) => {
        if (err.response?.status === 403 || err.response?.status === 401) {
            toast.error('Your session has expired. Please log in again.');
            localStorage.removeItem('authToken');
            navigate('/login');
        } else {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handleCreateDeliverable = async (deliverableData) => {
        try {
            await axiosClient.post('/deliverables', deliverableData);
            toast.success('Assignment created successfully!');
            setView('list');
            fetchDeliverables();
        } catch (err) {
            console.error('Error creating deliverable:', err);
            toast.error('Failed to create assignment.');
            handleApiError(err);
        }
    };

    const handleDeleteDeliverable = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await axiosClient.delete(`/deliverables/${id}`);
                toast.success('Assignment deleted successfully!');
                fetchDeliverables();
            } catch (err) {
                console.error('Error deleting deliverable:', err);
                toast.error('Failed to delete assignment.');
                handleApiError(err);
            }
        }
    };

    const handleEditDeliverable = (deliverable) => {
        setSelectedDeliverable(deliverable);
        setView('create');
    };

    const handleGradeDeliverable = async (id, gradeData) => {
        try {
            await axiosClient.post('/deliverables/grade', {
                deliverableId: id,
                grade: parseFloat(gradeData.grade),
                feedback: gradeData.feedback
            });
            toast.success('Assignment graded successfully!');
            fetchDeliverables();
        } catch (err) {
            console.error('Error grading deliverable:', err);
            toast.error('Failed to grade assignment.');
            handleApiError(err);
        }
    };

    const handleToggleVisibility = async (id, currentVisibility) => {
        try {
            await axiosClient.patch(`/deliverables/${id}/visibility?visible=${!currentVisibility}`);
            toast.success(`Assignment ${!currentVisibility ? 'published' : 'unpublished'} successfully!`);
            fetchDeliverables();
        } catch (err) {
            console.error('Error toggling visibility:', err);
            toast.error('Failed to update assignment visibility.');
            handleApiError(err);
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'create':
                return (
                    <DeliverableForm
                        roomId={roomId}
                        participants={participants}
                        onSubmit={handleCreateDeliverable}
                        editMode={!!selectedDeliverable}
                        initialData={selectedDeliverable}
                        onCancel={() => {
                            setView('list');
                            setSelectedDeliverable(null);
                        }}
                    />
                );
            case 'stats':
                return (
                    <DeliverableStats
                        deliverables={deliverables}
                        participants={participants}
                        onBack={() => setView('list')}
                    />
                );
            case 'list':
            default:
                return (
                    <DeliverableList
                        deliverables={deliverables}
                        onDelete={handleDeleteDeliverable}
                        onEdit={handleEditDeliverable}
                        onGrade={handleGradeDeliverable}
                        onToggleVisibility={handleToggleVisibility}
                        isTutor={true}
                    />
                );
        }
    };

    if (loading && deliverables.length === 0) {
        return (
            <>
                <TutorSideBar />
                <Navbar />
                <div className="wrapper">
                    <div className="content-page">
                        <div className="container-fluid">
                            <div className="container p-4">
                                <div className="d-flex justify-content-center my-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </>
        );
    }

    return (
        <>
            <TutorSideBar />
            <Navbar />
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold">Assignment Management</h2>
                                    <Link
                                        to={`/tutor/rooms/${roomId}`}
                                        className="btn btn-sm btn-outline-secondary rounded-pill"
                                    >
                                        <FiArrowLeft className="me-2" /> Back to Room
                                    </Link>
                                </div>
                                <div className="btn-group">
                                    {view !== 'list' && (
                                        <button
                                            className="btn btn-outline-primary rounded-pill"
                                            onClick={() => setView('list')}
                                        >
                                            <FiList className="me-2" /> View Assignments
                                        </button>
                                    )}
                                    {view !== 'create' && (
                                        <button
                                            className="btn btn-primary rounded-pill"
                                            onClick={() => {
                                                setSelectedDeliverable(null);
                                                setView('create');
                                            }}
                                        >
                                            <FiPlusCircle className="me-2" /> Create Assignment
                                        </button>
                                    )}
                                    {view !== 'stats' && (
                                        <button
                                            className="btn btn-outline-info rounded-pill"
                                            onClick={() => setView('stats')}
                                        >
                                            <FiBarChart2 className="me-2" /> Statistics
                                        </button>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    {renderContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default DeliverableManagement;