import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { FiFileText, FiArrowRight, FiCalendar } from 'react-icons/fi';
import { Badge, Table, Spinner, Alert } from 'react-bootstrap';
import NavBar from "../../layouts/NavBar";
import ParticipantSideBar from "../../layouts/SideBars/ParticipantSidebar";


const DeliverablesParticipantList = () => {
    const [deliverables, setDeliverables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchDeliverables = async () => {
        try {
            const response = await axiosClient.get('/deliverables/participant/me');
            setDeliverables(response.data);
        } catch (err) {
            setError('Failed to load deliverables');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeliverables();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'SUBMITTED': return <Badge bg="info">Submitted</Badge>;
            case 'GRADED': return <Badge bg="success">Graded</Badge>;
            case 'LATE': return <Badge bg="danger">Late</Badge>;
            default: return <Badge bg="secondary">Pending</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <>
            <NavBar />
            <ParticipantSideBar />

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2>My Deliverables</h2>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </button>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Table hover responsive>
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Course</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {deliverables.map(deliverable => (
                                    <tr key={deliverable.id}>
                                        <td>{deliverable.title}</td>
                                        <td>{deliverable.roomName}</td>
                                        <td>
                                            <FiCalendar className="me-2" />
                                            {new Date(deliverable.deadline).toLocaleDateString()}
                                        </td>
                                        <td>{getStatusBadge(deliverable.status)}</td>
                                        <td>
                                            <Link
                                                to={`/participant/deliverables/${deliverable.id}`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                <FiArrowRight className="me-1" />
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>

                            {deliverables.length === 0 && !loading && (
                                <div className="text-center py-5">
                                    <FiFileText size={48} className="text-muted mb-3" />
                                    <h4>No assignments found</h4>
                                    <p className="text-muted">You don't have any active deliverables yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeliverablesParticipantList;