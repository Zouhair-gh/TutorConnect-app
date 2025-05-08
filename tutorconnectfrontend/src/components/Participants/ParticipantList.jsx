import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { FiUser, FiUserPlus, FiUserX, FiArrowLeft } from 'react-icons/fi';
import { Modal, Button, Table, Alert, Badge } from 'react-bootstrap';
import NavBar from "../../layouts/NavBar";
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";

const ParticipantList = () => {
    const { roomId } = useParams();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [availableParticipants, setAvailableParticipants] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [roomDetails, setRoomDetails] = useState(null);

    useEffect(() => {
        fetchParticipants();
        fetchRoomDetails();
    }, [roomId]);

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/rooms/${roomId}/participants`);
            setParticipants(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data || "Failed to fetch participants");
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomDetails = async () => {
        try {
            const response = await axiosClient.get(`/rooms/${roomId}`);
            setRoomDetails(response.data);
        } catch (err) {
            console.error("Failed to fetch room details", err);
        }
    };

    const fetchAvailableParticipants = async () => {
        try {
            const response = await axiosClient.get(`/rooms/${roomId}/participants/available`);
            setAvailableParticipants(response.data);
        } catch (err) {
            console.error("Failed to fetch available participants", err);
        }
    };

    const handleAddParticipant = async () => {
        if (!selectedParticipant) return;

        try {
            await axiosClient.post(`/rooms/${roomId}/participants`, {
                participantId: selectedParticipant
            });
            setShowAddModal(false);
            fetchParticipants();
            fetchRoomDetails();
        } catch (err) {
            setError(err.response?.data || "Failed to add participant");
        }
    };

    const handleRemoveParticipant = async (participantId) => {
        try {
            await axiosClient.delete(`/rooms/${roomId}/participants/${participantId}`);
            fetchParticipants();
            fetchRoomDetails();
        } catch (err) {
            setError(err.response?.data || "Failed to remove participant");
        }
    };

    const openAddModal = () => {
        fetchAvailableParticipants();
        setShowAddModal(true);
    };

    if (loading) {
        return <div className="text-center py-5">Loading participants...</div>;
    }

    return (

        <>
            <NavBar/>
            <TutorSideBar/>
            <div className="wrapper">
                <div className="content-page">

        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={`/tutor/rooms/${roomId}/manage`} className="btn btn-outline-secondary">
                    <FiArrowLeft className="me-2" /> Back to Room
                </Link>
                <h3 className="mb-0">Participants Management</h3>
                <div>
                    {roomDetails && (
                        <Badge bg="info" className="me-2">
                            {participants.length}/{roomDetails.capacity} participants
                        </Badge>
                    )}
                    <Button
                        variant="primary"
                        onClick={openAddModal}
                        disabled={roomDetails && participants.length >= roomDetails.capacity}
                    >
                        <FiUserPlus className="me-2" /> Add Participant
                    </Button>
                </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="card shadow-sm">
                <div className="card-body">
                    {participants.length > 0 ? (
                        <Table striped hover responsive>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {participants.map((participant) => (
                                <tr key={participant.id}>
                                    <td>{participant.firstName} {participant.lastName}</td>
                                    <td>{participant.email}</td>
                                    <td>{participant.phoneNumber}</td>
                                    <td>
                                        <Link
                                            to={`/tutor/participants/${participant.id}`}
                                            className="btn btn-sm btn-info me-2"
                                        >
                                            View
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleRemoveParticipant(participant.id)}
                                        >
                                            <FiUserX className="me-1" /> Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center py-4">
                            <FiUser size={48} className="text-muted mb-3" />
                            <h5>No participants yet</h5>
                            <p>Add participants to this classroom to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Participant Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Participant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {availableParticipants.length > 0 ? (
                        <div className="list-group">
                            {availableParticipants.map((participant) => (
                                <button
                                    key={participant.id}
                                    className={`list-group-item list-group-item-action ${selectedParticipant === participant.id ? 'active' : ''}`}
                                    onClick={() => setSelectedParticipant(participant.id)}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{participant.firstName} {participant.lastName}</strong>
                                            <div className="text-muted small">{participant.email}</div>
                                        </div>
                                        {selectedParticipant === participant.id && (
                                            <span className="badge bg-primary">Selected</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-3">
                            <p>No available participants to add</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddParticipant}
                        disabled={!selectedParticipant}
                    >
                        Add Participant
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
                </div>
            </div>
        </>

    );
};

export default ParticipantList;