import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DeliverableForm from './DeliverableForm';
import axiosClient from '../../api/axiosClient';


import TutorSideBar from "../../layouts/SideBars/TutorSideBar";
import NavBar from "../../layouts/NavBar";

const DeliverableFormWrapper = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleCancel = () => {
        navigate(`/rooms/${roomId}/deliverables`);
    };

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                setLoading(true);
                console.log(`Fetching participants for room ID: ${roomId}`);

                try {
                    const response = await axiosClient.get(`/rooms/${roomId}/participants`);
                    console.log('Participants data received:', response.data);
                    setParticipants(response.data);
                } catch (specificError) {
                    console.error('Error with first endpoint, trying fallback:', specificError);
                    const fallbackResponse = await axiosClient.get(`/participants/room/${roomId}`);
                    console.log('Participants data received from fallback:', fallbackResponse.data);
                    setParticipants(fallbackResponse.data);
                }
            } catch (err) {
                console.error('Error fetching participants:', err);
                setError(err.message || 'Failed to fetch participants');
                setParticipants([]);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [roomId]);

    const handleSubmit = async (formData) => {
        try {
            const request = {
                roomId: parseInt(roomId),
                title: formData.title,
                description: formData.description,
                deadline: formData.deadline,
                maxPoints: formData.maxPoints,
                attachmentUrl: formData.attachmentUrl,
                isVisible: formData.isVisible,
                participantIds: formData.assignedParticipantIds
            };

            const response = await axiosClient.post('/deliverables', request);
            console.log('Submission response:', response.data);

            navigate(`/rooms/${roomId}/deliverables`);
        } catch (err) {
            console.error('Error creating assignment:', err);
            alert(`Error creating assignment: ${err.response?.data?.message || err.message || 'Unknown error'}`);
        }
    };

    return (
        <>

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <h2 className="mb-4">Create New Deliverable</h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <h4>Error Loading Participants</h4>
                                    <p>{error}</p>
                                    <hr />
                                    <p className="mb-0">Room ID: {roomId}</p>
                                </div>
                            )}

                            {loading && (
                                <div className="alert alert-info mb-3">
                                    Loading participants... This may take a moment.
                                </div>
                            )}

                            <DeliverableForm
                                roomId={roomId}
                                participants={participants}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                editMode={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default DeliverableFormWrapper;