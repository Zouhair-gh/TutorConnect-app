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
