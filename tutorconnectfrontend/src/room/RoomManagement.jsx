import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TutorSideBar from "../layouts/SideBars/TutorSideBar";
import Navbar from "../layouts/NavBar";
import { FiUsers, FiFileText, FiCalendar, FiEye, FiPlus } from "react-icons/fi";
import { ProgressBar, Spinner, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

const RoomManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    participants: 0,
    assignments: 0,
    sessions: 0,
    progress: 0,
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);

        // Validate room ID
        if (!id || isNaN(id)) {
          throw new Error("Invalid room ID");
        }

        // Fetch room details
        const roomResponse = await axiosClient.get(`/rooms/${id}`);
        if (!roomResponse.data) {
          throw new Error("Room not found");
        }
        setRoom(roomResponse.data);

        // Fetch statistics in parallel
        const [participantsResponse, deliverablesResponse, sessionsResponse] =
          await Promise.all([
            axiosClient.get(`/rooms/${id}/participants`),
            axiosClient.get(`/deliverables/room/${id}`),
            axiosClient.get(`/sessions/room/${id}`),
          ]);

        setStats({
          participants: participantsResponse.data?.length || 0,
          assignments: deliverablesResponse.data?.length || 0,
          sessions: sessionsResponse.data?.length || 0,
          progress: calculateProgress(deliverablesResponse.data || []),
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch room data"
        );
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch room data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id]);

  const calculateProgress = (deliverables) => {
    if (!deliverables || deliverables.length === 0) return 0;
    const completed = deliverables.filter((d) => d.status === "GRADED").length;
    return Math.round((completed / deliverables.length) * 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const handleEndClassroom = async () => {
    if (
      !window.confirm(
        "Are you sure you want to end this classroom? This action cannot be undone."
      )
    )
      return;

    try {
      await axiosClient.put(`/rooms/${id}/end`);
      toast.success("Classroom ended successfully");
      navigate("/tutor/rooms");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end classroom");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/tutor/rooms" className="btn btn-primary mt-3">
          Back to Rooms
        </Link>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">Room not found</Alert>
        <Link to="/tutor/rooms" className="btn btn-primary mt-3">
          Back to Rooms
        </Link>
      </div>
    );
  }

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
                </div>
                <div className="text-end">
                  <div className="badge bg-success-light text-success mb-2">
                    Active
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold">Course Progress</span>
                  <span>{stats.progress}%</span>
                </div>
                <ProgressBar
                  now={stats.progress}
                  variant="primary"
                  className="rounded-pill"
                  style={{ height: "8px" }}
                />
              </div>

              <div className="row">
                {/* Participants Card */}
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
                      <h2 className="display-5 fw-bold text-primary">
                        {stats.participants}
                      </h2>
                      <p className="text-muted">of {room.capacity} capacity</p>
                    </div>
                    <div className="card-footer bg-white border-0">
                      <Link
                        to={`/tutor/rooms/${id}/participants`}
                        className="btn btn-outline-primary w-100 rounded-pill"
                      >
                        <FiEye className="me-2" /> Manage Participants
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Assignments Card */}
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
                      <h2 className="display-5 fw-bold text-warning">
                        {stats.assignments}
                      </h2>
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
                        to={`/tutor/rooms/${id}/deliverables/create`}
                        className="btn btn-warning flex-grow-1 rounded-pill d-flex align-items-center justify-content-center"
                      >
                        <FiPlus className="me-2" /> Create New
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Sessions Card */}
                <div className="col-md-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-white border-0">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary-light rounded p-2 me-3">
                          <FiCalendar className="text-primary" size={24} />
                        </div>
                        <h5 className="mb-0">Sessions</h5>
                      </div>
                    </div>
                    <div className="card-body text-center py-4">
                      <h2 className="display-5 fw-bold text-primary">
                        {stats.sessions}
                      </h2>
                      <p className="text-muted">scheduled sessions</p>
                    </div>
                    <div className="card-footer bg-white border-0 d-flex gap-2">
                      <Link
                        to={`/tutor/rooms/${id}/sessions`}
                        className="btn btn-outline-primary flex-grow-1 rounded-pill d-flex align-items-center justify-content-center"
                      >
                        <FiEye className="me-2" /> View All
                      </Link>
                      <Link
                        to={`/tutor/rooms/${id}/sessions/create`}
                        className="btn btn-primary flex-grow-1 rounded-pill d-flex align-items-center justify-content-center"
                      >
                        <FiPlus className="me-2" /> Create New
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
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
                    <Link
                      to={`/tutor/rooms/${id}/announcements/create`}
                      className="btn btn-outline-success rounded-pill px-4"
                    >
                      Send Announcement
                    </Link>
                    <Link
                      to={`/tutor/rooms/${id}/reports`}
                      className="btn btn-outline-secondary rounded-pill px-4"
                    >
                      Generate Reports
                    </Link>
                    <button
                      onClick={handleEndClassroom}
                      className="btn btn-outline-danger rounded-pill px-4"
                    >
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
