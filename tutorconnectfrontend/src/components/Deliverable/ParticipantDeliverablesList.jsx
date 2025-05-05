import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

import { FiFileText, FiUser, FiCalendar, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { Badge, Table } from "react-bootstrap";


const ParticipantDeliverablesList = () => {
    const { participantId } = useParams();
    const navigate = useNavigate();
    const [deliverables, setDeliverables] = useState([]);
    const [participant, setParticipant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [deliverablesRes, participantRes] = await Promise.all([
                axiosClient.get(`/deliverables/participant/${participantId}`),
                axiosClient.get(`/participants/${participantId}`)
            ]);
            setDeliverables(deliverablesRes.data);
            setParticipant(participantRes.data);
        } catch (err) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [participantId]);

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
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold">
                                        {participant?.firstName} {participant?.lastName}'s Deliverables
                                    </h2>
                                    <p className="text-muted">View and manage student assignments</p>
                                </div>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                >
                                    Back to Participants
                                </button>
                            </div>

                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}

                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <Table hover responsive>
                                        <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Room</th>
                                            <th>Deadline</th>
                                            <th>Status</th>
                                            <th>Grade</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {deliverables.length > 0 ? (
                                            deliverables.map(deliverable => (
                                                <tr key={deliverable.id}>
                                                    <td>{deliverable.title}</td>
                                                    <td>{deliverable.roomName}</td>
                                                    <td>{new Date(deliverable.deadline).toLocaleDateString()}</td>
                                                    <td>{getStatusBadge(deliverable.status)}</td>
                                                    <td>
                                                        {deliverable.grade !== null ?
                                                            `${deliverable.grade}/${deliverable.maxPoints}` :
                                                            '-'}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                                            onClick={() => navigate(`/tutor/deliverables/${deliverable.id}`)}
                                                        >
                                                            <FiArrowRight className="me-1" /> View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    <FiFileText className="display-4 text-muted mb-3" />
                                                    <h5>No deliverables found</h5>
                                                    <p className="text-muted">
                                                        This student hasn't been assigned any deliverables yet
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ParticipantDeliverablesList;