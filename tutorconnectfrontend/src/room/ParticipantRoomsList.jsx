import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
    Card,
    Button,
    Spinner,
    Alert,
    Badge,
    Row,
    Col,
    Container
} from "react-bootstrap";
import {
    FiCalendar,
    FiUsers,
    FiArrowRight,
    FiClock
} from "react-icons/fi";
import NavBar from "../layouts/NavBar";
import ParticipantSidebar from "../layouts/SideBars/ParticipantSidebar";

const ParticipantRoomsList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                // Updated endpoint to match the controller path
                const response = await axiosClient.get("/rooms/1/participants/my-rooms");
                setRooms(response.data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
                setError("Failed to load rooms. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadge = (status) => {
        const variants = {
            ACTIVE: "success",
            PENDING: "warning",
            COMPLETED: "primary",
            CANCELLED: "danger"
        };
        return <Badge bg={variants[status]}>{status}</Badge>;
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading your rooms...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-4">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <ParticipantSidebar />
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <Container className="py-4">
                            <h2 className="mb-4">My Rooms</h2>

                            {rooms.length === 0 ? (
                                <Alert variant="info">
                                    You haven't joined any rooms yet. Contact your tutor to get access.
                                </Alert>
                            ) : (
                                <Row className="g-4">
                                    {rooms.map((roomData) => {
                                        const room = roomData.room;
                                        return (
                                            <Col key={room.id} md={6} lg={4}>
                                                <Card className="h-100 shadow-sm">
                                                    <Card.Body>
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <Card.Title>{room.name}</Card.Title>
                                                            {getStatusBadge(room.status)}
                                                        </div>

                                                        <div className="mb-3">
                                                            <p className="mb-1">
                                                                <FiUsers className="me-2" />
                                                                {roomData.participants.length} participants
                                                            </p>
                                                            <p className="mb-1">
                                                                <FiCalendar className="me-2" />
                                                                {formatDate(room.startDate)} - {formatDate(room.endDate)}
                                                            </p>
                                                            <p className="mb-1">
                                                                <FiClock className="me-2" />
                                                                {room.schedule}
                                                            </p>
                                                        </div>

                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <Button
                                                                variant="primary"
                                                                onClick={() => navigate(`/participant/participantroom/${room.id}/sessions`)}
                                                            >
                                                                View Sessions <FiArrowRight className="ms-2" />
                                                            </Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            )}
                        </Container>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ParticipantRoomsList;