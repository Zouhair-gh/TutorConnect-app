import React from "react";
import { useParams , Link } from "react-router-dom";
import TutorSideBar from "../layouts/SideBars/TutorSideBar";
import Navbar from "../layouts/NavBar";
import { FiUsers, FiFileText, FiBook, FiPlus, FiUpload, FiEye , FiCalendar} from "react-icons/fi";
import { ProgressBar } from "react-bootstrap";
import NavBar from "../layouts/NavBar";


const RoomManagement = () => {
    const { id } = useParams();



    const room = {
        id: id,
        name: "Advanced Mathematics",
        participants: 15,
        assignments: 3,
        materials: 5,
        capacity: 20,
        progress: 75, // percentage of course completion
        activeSince: "2023-10-15",
        nextSession: "2023-12-05"
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <>
            <TutorSideBar />
            <Navbar />

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold">Manage Classroom</h2>
                                    <h4 className="text-primary">{room.name}</h4>
                                    <p className="text-muted">ID: {room.id} | Active since: {formatDate(room.activeSince)}</p>
                                </div>
                                <div className="text-end">
                                    <div className="badge bg-success-light text-success mb-2">
                                        Active
                                    </div>
                                    <p className="text-muted mb-0">Next session: {formatDate(room.nextSession)}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fw-bold">Course Progress</span>
                                    <span>{room.progress}%</span>
                                </div>
                                <ProgressBar
                                    now={room.progress}
                                    variant="primary"
                                    className="rounded-pill"
                                    style={{ height: '8px' }}
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-4 mb-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-header bg-white border-0">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary-light rounded p-2 me-3">
                                                    <FiUsers className="text-primary" size={24} />
                                                </div>
                                                <h5 className="mb-0">Participants</h5>
                                            </div>
                                        </div>
                                        <div className="card-body text-center py-4">
                                            <h2 className="display-5 fw-bold text-primary">{room.participants}</h2>
                                            <p className="text-muted">of {room.capacity} capacity</p>
                                        </div>
                                        <div className="card-footer bg-white border-0">
                                            <Link
                                                to={`/tutor/rooms/${room.id}/participants`}
                                                className="btn btn-outline-primary w-100 rounded-pill"
                                            >
                                                <FiEye className="me-2" /> Manage Participants
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 mb-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-header bg-white border-0">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-warning-light rounded p-2 me-3">
                                                    <FiFileText className="text-warning" size={24} />
                                                </div>
                                                <h5 className="mb-0">Assignments</h5>
                                            </div>
                                        </div>
                                        <div className="card-body text-center py-4">
                                            <h2 className="display-5 fw-bold text-warning">{room.assignments}</h2>
                                            <p className="text-muted">active assignments</p>
                                        </div>
                                        <div className="card-footer bg-white border-0 d-flex gap-2">
                                            <Link
                                                to={`/tutor/rooms/${id}/deliverables`}
                                                className="btn btn-outline-warning flex-grow-1 rounded-pill d-flex align-items-center justify-content-center"
                                            >
                                                <FiEye className="me-2" /> View All
                                            </Link>

                                            <Link
                                                to={`/tutor/rooms/${room.id}/deliverables/create`}
                                                className="btn btn-warning flex-grow-1 rounded-pill d-flex align-items-center justify-content-center"
                                            >
                                                <FiPlus className="me-2" /> Create New
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4 mb-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="card-header bg-white border-0">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary-light rounded p-2 me-3">
                                                    <FiCalendar className="text-primary" size={24}/>
                                                </div>
                                                <h5 className="mb-0">Sessions</h5>
                                            </div>
                                        </div>
                                        <div className="card-body text-center py-4">
                                            <h2 className="display-5 fw-bold text-primary">{room.sessions?.length || 0}</h2>
                                            <p className="text-muted">scheduled sessions</p>
                                        </div>
                                        <div className="card-footer bg-white border-0 d-flex gap-2">
                                            <Link
                                                to={`/tutor/rooms/${room.id}/sessions`}
                                                className="btn btn-outline-primary flex-grow-1 rounded-pill d-flex align-items-center justify-content-center"
                                            >
                                                <FiEye className="me-2"/> View All
                                            </Link>
                                            <Link
                                                to={`/tutor/rooms/${room.id}/sessions/create`}
                                                className="btn btn-primary flex-grow-1 rounded-pill d-flex align-items-center justify-content-center"
                                            >
                                                <FiPlus className="me-2"/> Create New
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="card border-0 shadow-sm mt-4">
                                <div className="card-header bg-white border-0">
                                    <h5 className="mb-0">Quick Actions</h5>
                                </div>
                                <div className="card-body">

                                    <div className="d-flex flex-wrap gap-2">

                                        <Link
                                            to={`/tutor/rooms/${id}/sessions/create`}
                                            className="btn btn-outline-primary rounded-pill px-4"
                                        >
                                            Schedule Session
                                        </Link>
                                        <button className="btn btn-outline-success rounded-pill px-4">
                                            Send Announcement
                                        </button>
                                        <button className="btn btn-outline-secondary rounded-pill px-4">
                                            Generate Reports
                                        </button>
                                        <button className="btn btn-outline-danger rounded-pill px-4">
                                            End Classroom
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default RoomManagement;