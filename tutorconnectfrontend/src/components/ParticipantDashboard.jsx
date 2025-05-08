import React from 'react';
import {useState, useEffect} from "react";

import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../layouts/NavBar';
import ParticipantSideBar from '../layouts/SideBars/ParticipantSidebar';



const ParticipantDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const [rooms, setRooms] = useState([]);
    const [payments, setPayments] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState(null);

    // Utility functions
    const getRandomColorClass = () => {
        const colors = ['primary', 'success', 'info', 'warning', 'danger'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        // Fetch rooms the participant is part of
        fetch('/api/participant/rooms')
            .then((res) => res.json())
            .then((data) => setRooms(data))
            .catch((err) => setError('Error fetching rooms'));

        // Fetch participant payments
        fetch('/api/participant/payments')
            .then((res) => res.json())
            .then((data) => setPayments(data))
            .catch((err) => setError('Error fetching payments'));

        // Fetch participant assignments
        fetch('/api/participant/assignments')
            .then((res) => res.json())
            .then((data) => setAssignments(data))
            .catch((err) => setError('Error fetching assignments'));
    }, []);

    return (
        <>
        <ParticipantSideBar/>
        <Navbar/>
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="text-primary mb-1">My Dashboard</h2>
                                    <p className="text-muted">Overview of your rooms, payments, and assignments</p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="row">
                                {/* Left Column — My Rooms */}
                                <div className="col-lg-8">
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-header bg-primary text-white">
                                            <h5 className="mb-0">My Rooms</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                {rooms.length > 0 ? (
                                                    rooms.map((room) => (
                                                        <div key={room.id} className="col-md-6 mb-4">
                                                            <div className="border rounded p-3 h-100">
                                                                <h6 className="mb-1">{room.name}</h6>
                                                                <p className="text-muted mb-1">
                                                                    Capacity: {room.capacity} people
                                                                </p>
                                                                <p className="text-muted mb-1">
                                                                    Period: {formatDate(room.startDate)} - {formatDate(room.endDate)}
                                                                </p>
                                                                <Link to={`/rooms/${room.id}`} className="btn btn-sm btn-info mt-2">
                                                                    <i className="fa fa-eye me-1"></i> View Room
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-muted text-center">You are not part of any rooms.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* My Assignments */}
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-header bg-info text-white">
                                            <h5 className="mb-0">My Assignments</h5>
                                        </div>
                                        <div className="card-body">
                                            {assignments.length > 0 ? (
                                                <ul className="list-group">
                                                    {assignments.map((assignment) => (
                                                        <li key={assignment.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                            <span>{assignment.title}</span>
                                                            <span className={`badge bg-${assignment.completed ? 'success' : 'warning'}`}>
                          {assignment.completed ? 'Completed' : 'Pending'}
                        </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-muted text-center">No assignments yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column — Payments */}
                                <div className="col-lg-4">
                                    <div className="card shadow-sm mb-4">
                                        <div className="card-header bg-success text-white">
                                            <h5 className="mb-0">My Payments</h5>
                                        </div>
                                        <div className="card-body">
                                            {payments.length > 0 ? (
                                                <ul className="list-group">
                                                    {payments.map((payment) => (
                                                        <li key={payment.id} className="list-group-item">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <strong>${payment.amount.toFixed(2)}</strong><br />
                                                                    <small className="text-muted">{formatDate(payment.date)}</small>
                                                                </div>
                                                                <span className={`badge bg-${payment.status === 'Paid' ? 'success' : 'danger'}`}>
                            {payment.status}
                          </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-muted text-center">No payment records found.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title">Quick Links</h5>
                                            <div className="d-grid gap-2">
                                                <Link to="/rooms" className="btn btn-outline-primary">
                                                    Browse Available Rooms
                                                </Link>
                                                <Link to="/payments/history" className="btn btn-outline-secondary">
                                                    View Payment History
                                                </Link>
                                                <Link to="/assignments" className="btn btn-outline-info">
                                                    See All Assignments
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> {/* end row */}
                        </div> {/* end container */}
                    </div>
                </div>
            </div>


        </>

    );
};


export default ParticipantDashboard;
