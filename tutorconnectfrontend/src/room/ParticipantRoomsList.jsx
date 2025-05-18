import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Footer from "../layouts/footer";
import Navbar from "../layouts/NavBar";
import ParticipantSidebar from "../layouts/SideBars/ParticipantSidebar";
import { Link, useNavigate } from "react-router-dom";
import { FiUsers, FiFileText, FiCalendar, FiEye, FiCheck } from "react-icons/fi";

const ParticipantRoomsList = () => {
    const [roomsWithParticipants, setRoomsWithParticipants] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const colorClasses = ["primary", "success", "danger", "warning", "info"];

    const getRandomColorClass = (index) => colorClasses[index % colorClasses.length];

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Check authentication
    const checkAuth = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("You are not authenticated. Please log in.");
            setLoading(false);
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (!checkAuth()) return;

        setLoading(true);
        console.log("Fetching participant rooms...");

        // Use axiosClient which has the base URL configured
        axiosClient.get("/participants/my-rooms")
            .then(response => {
                console.log("Room data received:", response.data);

                // Handle backend response format
                if (Array.isArray(response.data)) {
                    // Filter out any entries with null room
                    const validRoomData = response.data.filter(item => item && item.room);
                    setRoomsWithParticipants(validRoomData);

                    if (validRoomData.length === 0 && response.data.length > 0) {
                        console.warn("Received data but all rooms are null", response.data);
                    }
                } else {
                    console.error("Unexpected response format:", response.data);
                    setError("Received an unexpected data format from the server");
                }

                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching rooms:", error);

                // Provide more specific error messages based on HTTP status
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            setError("Authentication expired. Please log in again.");
                            // Optionally redirect to login page
                            break;
                        case 403:
                            setError("You don't have permission to access this resource. Please contact an administrator.");
                            break;
                        case 404:
                            setError("The rooms resource was not found. The API endpoint may have changed.");
                            break;
                        default:
                            setError(`Failed to fetch rooms: ${error.response.status} ${error.response.statusText}`);
                    }
                } else if (error.request) {
                    setError("Network error. Please check your connection and try again.");
                } else {
                    setError("Failed to fetch rooms. Please try again later.");
                }

                setLoading(false);
            });
    }, []);

    // Extract rooms from roomsWithParticipants data structure
    const rooms = roomsWithParticipants.map(item => item.room);

    // Handle view room management
    const handleCheckRoom = (roomId) => {
        navigate(`/participant/room-management/${roomId}`);
    };

    return (
        <>
            <ParticipantSidebar />
            <Navbar />
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <h2 className="mb-4">My Rooms</h2>

                            {loading && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger">
                                    <i className="fa fa-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            {!loading && !error && (
                                <div className="row">
                                    {rooms && rooms.length > 0 ? (
                                        rooms.map((room, index) => {
                                            // Skip any null room objects
                                            if (!room) return null;

                                            const colorClass = getRandomColorClass(index);
                                            return (
                                                <div key={room.id || index} className="col-md-6 col-lg-4 mb-4">
                                                    <div className="card card-block card-stretch card-height-helf">
                                                        <div className="card-body card-item-right">
                                                            <div className="d-flex align-items-top">
                                                                <div className={`bg-${colorClass}-light rounded p-3 me-3`}>
                                                                    <i className={`fa fa-building fa-2x text-${colorClass}`} aria-hidden="true"></i>
                                                                </div>
                                                                <div className="style-text text-left flex-grow-1">
                                                                    <h5 className="mb-2">{room.name || "Unnamed Room"}</h5>
                                                                    <p className="mb-1">Capacity: {room.capacity || "N/A"} people</p>

                                                                    <p className="mb-1">
                                                                        Period: {formatDate(room.startDate)} - {formatDate(room.endDate)}
                                                                    </p>
                                                                    <div className="mt-3">
                                                                        {room.id && (
                                                                            <>
                                                                                <Link to={`/participant/rooms/${room.id}/1`} className="btn btn-sm btn-info me-2">
                                                                                    <i className="fa fa-eye"></i> View
                                                                                </Link>
                                                                                <button
                                                                                    onClick={() => handleCheckRoom(room.id)}
                                                                                    className="btn btn-sm btn-success">
                                                                                    <FiCheck className="me-1" /> Check
                                                                                </button>
                                                                            </>
                                                                        )}
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
                                            <div className="alert alert-info">
                                                <p className="mb-0">No rooms found. You are not enrolled in any rooms yet.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ParticipantRoomsList;