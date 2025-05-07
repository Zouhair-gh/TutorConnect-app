import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import TutorSideBar from "../layouts/SideBars/TutorSideBar";
import Navbar from "../layouts/NavBar";
import Footer from "../layouts/footer";
import {
  FiBook,
  FiClock,
  FiUsers,
  FiDollarSign,
  FiEye,
  FiSettings,
  FiRefreshCw,
} from "react-icons/fi";
import { ProgressBar } from "react-bootstrap";

const TutorRoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/rooms/my-rooms");
      setRooms(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch rooms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRenewal = async (roomId) => {
    try {
      const renewalData = {
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        amount: rooms.find((r) => r.id === roomId).amount,
        isRenewal: true,
        originalRoomId: roomId,
      };

      await axiosClient.post(`/rooms/request-renewal/${roomId}`, renewalData);
      setSuccess("Renewal request submitted successfully!");
      setTimeout(() => setSuccess(""), 5000);
      fetchRooms(); // Refresh the list
    } catch (err) {
      setError(err.response?.data || "Failed to submit renewal request");
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  const getProgressVariant = (days) => {
    if (days > 30) return "success";
    if (days > 7) return "info";
    if (days > 3) return "warning";
    return "danger";
  };

  const getRoomStatus = (days) => {
    if (days > 30) return "Active";
    if (days > 0) return "Expiring Soon";
    return "Expired";
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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
                  <h2 className="fw-bold">My Classrooms</h2>
                  <p className="text-muted">
                    Manage your active tutoring sessions
                  </p>
                </div>
                <Link
                  to="/tutor/rooms/request"
                  className="btn btn-primary rounded-pill px-4"
                >
                  <i className="fas fa-plus me-2"></i>Request New Classroom
                </Link>
              </div>

              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}

              {success && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  {success}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess("")}
                  ></button>
                </div>
              )}

              <div className="row">
                {rooms.length > 0 ? (
                  rooms.map((room) => {
                    const daysRemaining = getDaysRemaining(room.endDate);
                    const canRenew = daysRemaining <= 7;
                    const progressPercentage = Math.min(
                      100,
                      Math.max(0, (daysRemaining / 30) * 100)
                    );

                    return (
                      <div key={room.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-header bg-white border-0 pb-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="mb-0 fw-bold text-truncate">
                                {room.name}
                              </h5>
                              <span
                                className={`badge bg-${getProgressVariant(
                                  daysRemaining
                                )}-light text-${getProgressVariant(
                                  daysRemaining
                                )}`}
                              >
                                {getRoomStatus(daysRemaining)}
                              </span>
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-1">
                                <small className="text-muted">
                                  Time Remaining
                                </small>
                                <small className="fw-bold">
                                  {daysRemaining} days
                                </small>
                              </div>
                              <ProgressBar
                                now={progressPercentage}
                                variant={getProgressVariant(daysRemaining)}
                                className="rounded-pill"
                                style={{ height: "6px" }}
                              />
                            </div>

                            <div className="d-flex flex-column gap-2 mb-3">
                              <div className="d-flex align-items-center">
                                <FiUsers className="me-2 text-primary" />
                                <span>
                                  Capacity:{" "}
                                  <strong>{room.capacity} students</strong>
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <FiDollarSign className="me-2 text-success" />
                                <span>
                                  Amount: <strong>${room.amount}</strong>
                                </span>
                              </div>
                              <div className="d-flex align-items-center">
                                <FiClock className="me-2 text-info" />
                                <span>
                                  Period:{" "}
                                  <strong>
                                    {formatDate(room.startDate)} -{" "}
                                    {formatDate(room.endDate)}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="card-footer bg-white border-0 pt-0">
                            <div className="d-flex justify-content-between">
                              <Link
                                to={`/tutor/rooms/${room.id}`}
                                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                              >
                                <FiEye className="me-1" /> Details
                              </Link>
                              <Link
                                to={`/tutor/rooms/${room.id}/manage`}
                                className="btn btn-sm btn-primary rounded-pill px-3"
                              >
                                <FiSettings className="me-1" /> Manage
                              </Link>
                              {canRenew && (
                                <button
                                  className="btn btn-sm btn-warning rounded-pill px-3"
                                  onClick={() => handleRequestRenewal(room.id)}
                                >
                                  <FiRefreshCw className="me-1" /> Renew
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body text-center py-5">
                        <FiBook className="display-4 text-muted mb-3" />
                        <h4 className="fw-bold mb-2">No Classrooms Found</h4>
                        <p className="text-muted mb-4">
                          You don't have any active classrooms yet
                        </p>
                        <Link
                          to="/tutor/rooms/request"
                          className="btn btn-primary rounded-pill px-4"
                        >
                          Request Your First Classroom
                        </Link>
                      </div>
                    </div>
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

export default TutorRoomsList;
