import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeliverableForm from './DeliverableForm';
import axiosClient from '../../api/axiosClient';

const DeliverableEditWrapper = () => {
    const { roomId, deliverableId } = useParams();
    const navigate = useNavigate();
    const [deliverable, setDeliverable] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch deliverable and participants data
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log(`Fetching data for room ${roomId}, deliverable ${deliverableId}`);

                // Fetch participants for the room - try both possible endpoints
                let participantsData = [];
                try {
                    const participantsResponse = await axiosClient.get(`/rooms/${roomId}/participants`);
                    console.log('Participants data received:', participantsResponse.data);
                    participantsData = participantsResponse.data;
                } catch (participantsError) {
                    console.error('Error with first endpoint, trying fallback:', participantsError);
                    try {
                        const fallbackResponse = await axiosClient.get(`/participants/room/${roomId}`);
                        console.log('Participants data received from fallback:', fallbackResponse.data);
                        participantsData = fallbackResponse.data;
                    } catch (fallbackError) {
                        console.error('Both participant endpoints failed:', fallbackError);
                        // Continue with empty participants array
                    }
                }

                // Fetch the specific deliverable
                const deliverableResponse = await axiosClient.get(`/deliverables/${deliverableId}`);
                console.log('Deliverable data received:', deliverableResponse.data);

                setParticipants(participantsData);
                setDeliverable(deliverableResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                console.error('Response data:', err.response?.data);
                console.error('Response status:', err.response?.status);
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roomId, deliverableId]);

    const handleSubmit = async (formData) => {
        try {
            console.log('Submitting updated form data:', formData);

            // Format data to match API expectations
            const request = {
                id: parseInt(deliverableId),
                roomId: parseInt(roomId),
                title: formData.title,
                description: formData.description,
                deadline: formData.deadline,
                maxPoints: formData.maxPoints,
                attachmentUrl: formData.attachmentUrl,
                isVisible: formData.isVisible,
                participantIds: formData.assignedParticipantIds
            };

            console.log('Formatted update request:', request);

            const response = await axiosClient.put(`/deliverables/${deliverableId}`, request);
            console.log('Update response:', response.data);

            navigate(`/rooms/${roomId}/deliverables`);
        } catch (err) {
            console.error('Error updating assignment:', err);
            console.error('Response data:', err.response?.data);
            console.error('Response status:', err.response?.status);
            alert(`Error updating assignment: ${err.response?.data?.message || err.message || 'Unknown error'}`);
        }
    };

    const handleCancel = () => {
        navigate(`/rooms/${roomId}/deliverables`);
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">
                    <div className="d-flex align-items-center">
                        <div className="spinner-border me-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div>
                            <strong>Loading assignment data...</strong>
                            <p className="mb-0">Please wait while we fetch the necessary information.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    <h4>Error Loading Data</h4>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">Room ID: {roomId}, Deliverable ID: {deliverableId}</p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => navigate(`/rooms/${roomId}/deliverables`)}
                    >
                        Return to Assignment List
                    </button>
                </div>
            </div>
        );
    }

    if (!deliverable) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    <h4>Assignment Not Found</h4>
                    <p>The requested assignment could not be found or you don't have permission to edit it.</p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => navigate(`/rooms/${roomId}/deliverables`)}
                    >
                        Return to Assignment List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <DeliverableForm
                roomId={roomId}
                participants={participants}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                editMode={true}
                initialData={deliverable}
            />
        </div>
    );
};

export default DeliverableEditWrapper;