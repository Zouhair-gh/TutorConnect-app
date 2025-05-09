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
import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../layouts/footer";
import Navbar from "../layouts/NavBar";
import ParticipantSidebar from "../layouts/SideBars/ParticipantSidebar";
import { Link } from "react-router-dom";

const ParticipantRoomsList = () => {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState(null);

    const colorClasses = ["primary", "success", "danger", "warning", "info"];

    const getRandomColorClass = (index) => colorClasses[index % colorClasses.length];

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        axios.get("/api/participants/my-rooms")
            .then(response => {
                // Extract only room info from DTO
                const roomList = response.data.map(item => item.room);
                setRooms(roomList);
            })
            .catch(error => {
                console.error("Error fetching rooms:", error);
                setError("Failed to fetch rooms");
            });
    }, []);

    return (
        <>
            <ParticipantSidebar />
            <Navbar />
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="row">
                                {rooms.length > 0 ? (
                                    rooms.map((room, index) => {
                                        const colorClass = getRandomColorClass(index);
                                        return (
                                            <div key={room.id} className="col-md-6 col-lg-4 mb-4">
                                                <div className="card card-block card-stretch card-height-helf">
                                                    <div className="card-body card-item-right">
                                                        <div className="d-flex align-items-top">
                                                            <div className={`bg-${colorClass}-light rounded p-3 me-3`}>
                                                                <i className={`fa fa-building fa-2x text-${colorClass}`} aria-hidden="true"></i>
                                                            </div>
                                                            <div className="style-text text-left flex-grow-1">
                                                                <h5 className="mb-2">{room.name}</h5>
                                                                <p className="mb-1">Capacity: {room.capacity} people</p>
                                                                <p className="mb-1">Amount: {room.amount}</p>
                                                                <p className="mb-1">
                                                                    Period: {formatDate(room.startDate)} - {formatDate(room.endDate)}
                                                                </p>
                                                                <div className="mt-3">
                                                                    <Link to={`/participant/rooms/${room.id}/1`} className="btn btn-sm btn-info me-2">
                                                                        <i className="fa fa-eye"></i> View
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-12 text-center">
                                        <p className="text-muted">No rooms found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ParticipantRoomsList;
