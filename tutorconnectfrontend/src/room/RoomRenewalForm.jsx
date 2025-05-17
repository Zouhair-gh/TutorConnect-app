import React, { useState } from "react";
import axiosClient from "../api/axiosClient"
import { useNavigate } from "react-router-dom";


import { Modal, Button, Form } from "react-bootstrap";

const RoomRenewalForm = ({ room, show, onHide }) => {
    const [duration, setDuration] = useState(30);
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const renewalData = {
                originalRoomId: room.id,
                name: room.name,
                capacity: room.capacity,
                startDate: new Date().toISOString().split('T')[0],
                endDate: endDate || calculateEndDate(duration),
                amount: room.amount,
                tutorId: room.tutor.id,
                isRenewal: true
            };

            await axiosClient.post("/demands/room", renewalData);
            onHide();
            navigate("/tutor/rooms");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit renewal request");
        } finally {
            setLoading(false);
        }
    };

    const calculateEndDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Request Room Renewal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Renewal Duration (Days)</Form.Label>
                        <Form.Control
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            min="1"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Or Select Specific End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Additional Message</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Form.Group>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Request"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default RoomRenewalForm;