import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TutorSideBar from "../layouts/SideBars/TutorSideBar";

import Navbar from "../layouts/NavBar";
import Footer from "../layouts/footer";
import axiosClient from "../api/axiosClient";
import {
  Calendar,
  User,
  DollarSign,
  Clock,
  Home,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
const RoomViewTutor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/rooms/${id}`);
        setRoom(response.data);
      } catch (err) {
        setError("Failed to fetch room details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await axiosClient.delete(`/rooms/${id}`);
      navigate("/rooms", {
        state: {
          message: "Room deleted successfully",
          type: "success",
        },
      });
    } catch (err) {
      setError("Failed to delete room");
      setShowDeleteModal(false);
      setDeleteLoading(false);
      console.error(err);
    }
  };

  // Calculate days between start and end dates
  const calculateDuration = () => {
    if (!room) return 0;
    const startDate = new Date(room.startDate);
    const endDate = new Date(room.endDate);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Calculate price per day
  const calculatePricePerDay = () => {
    if (!room) return 0;
    const days = calculateDuration();
    return (room.amount / days).toFixed(2);
  };

  if (loading) {
    return (
      <>
        <TutorSideBar />
        <Navbar />
        <div className="wrapper">
          <div className="content-page">
            <div className="container-fluid">
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h5 className="text-primary">Loading room details...</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const renderError = () => (
    <>
      <TutorSideBar />
      <Navbar />
      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <div className="card border-danger shadow-sm">
                <div className="card-body text-center">
                  <div className="text-danger mb-3">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h4 className="text-danger">{error}</h4>
                  <p className="text-muted">
                    There was a problem fetching the room details.
                  </p>
                  <Link to="/tutor/rooms" className="btn btn-primary mt-3">
                    <ArrowLeft size={18} className="me-2" />
                    Back to Rooms
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  const renderNotFound = () => (
    <>
      <TutorSideBar />
      <Navbar />
      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <div className="card border-warning shadow-sm">
                <div className="card-body text-center">
                  <div className="text-warning mb-3">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <h4 className="text-warning">Room Not Found</h4>
                  <p className="text-muted">
                    The room you're looking for doesn't exist or has been
                    removed.
                  </p>
                  <Link to="/rooms" className="btn btn-primary mt-3">
                    <ArrowLeft size={18} className="me-2" />
                    Back to Rooms
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  if (error) {
    return renderError();
  }

  if (!room) {
    return renderNotFound();
  }

  return (
    <>
      <TutorSideBar />
      <Navbar />
      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/rooms">Rooms</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {room.name}
                  </li>
                </ol>
              </nav>

              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="text-primary mb-1">{room.name}</h2>
                  <p className="text-muted">
                    <Home size={16} className="me-1" />
                    Room ID: {room.id}
                  </p>
                </div>
                <div>
                  <Link to="/rooms" className="btn btn-outline-secondary me-2">
                    <ArrowLeft size={18} className="me-1" />
                    Back
                  </Link>
                  <Link
                    to={`/rooms/edit/${id}`}
                    className="btn btn-warning me-2"
                  >
                    <Edit size={18} className="me-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn btn-danger"
                    disabled={deleteLoading}
                  >
                    <Trash2 size={18} className="me-1" />
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="row">
                {/* Left Column */}
                <div className="col-lg-8">
                  <div className="card shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">Room Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="icon-box bg-light-primary rounded p-3 me-3">
                              <Home size={24} className="text-primary" />
                            </div>
                            <div>
                              <h6 className="text-muted mb-1">Room Name</h6>
                              <h5 className="mb-0">{room.name}</h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="icon-box bg-light-info rounded p-3 me-3">
                              <User size={24} className="text-info" />
                            </div>
                            <div>
                              <h6 className="text-muted mb-1">Capacity</h6>
                              <h5 className="mb-0">{room.capacity} people</h5>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 mb-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="icon-box bg-light-success rounded p-3 me-3">
                              <Calendar size={24} className="text-success" />
                            </div>
                            <div>
                              <h6 className="text-muted mb-1">Start Date</h6>
                              <h5 className="mb-0">
                                {formatDate(room.startDate)}
                              </h5>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6 mb-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="icon-box bg-light-warning rounded p-3 me-3">
                              <Calendar size={24} className="text-warning" />
                            </div>
                            <div>
                              <h6 className="text-muted mb-1">End Date</h6>
                              <h5 className="mb-0">
                                {formatDate(room.endDate)}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr />

                      <div className="row">
                        <div className="col-md-12">
                          <h5 className="mb-4">Reservation Timeline</h5>
                          <div className="progress-timeline">
                            <div
                              className="timeline-progress"
                              style={{
                                width: "100%",
                                height: "6px",
                                backgroundColor: "#e9ecef",
                                borderRadius: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <div
                                className="progress-bar bg-success"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "10px",
                                }}
                              ></div>
                            </div>
                            <div className="d-flex justify-content-between">
                              <div className="timeline-point">
                                <div className="point bg-success"></div>
                                <small>{formatDate(room.startDate)}</small>
                              </div>
                              <div className="timeline-point">
                                <div className="point bg-success"></div>
                                <small>{formatDate(room.endDate)}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-lg-4">
                  <div className="card shadow-sm mb-4">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0">Pricing Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <div className="icon-box bg-light-danger rounded p-3 me-3">
                          <DollarSign size={24} className="text-danger" />
                        </div>
                        <div>
                          <h6 className="text-muted mb-1">Total Amount</h6>
                          <h4 className="mb-0">${room.amount.toFixed(2)}</h4>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-4">
                        <div className="icon-box bg-light-primary rounded p-3 me-3">
                          <Clock size={24} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="text-muted mb-1">Duration</h6>
                          <h5 className="mb-0">{calculateDuration()} days</h5>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-4">
                        <div className="icon-box bg-light-info rounded p-3 me-3">
                          <DollarSign size={24} className="text-info" />
                        </div>
                        <div>
                          <h6 className="text-muted mb-1">Price per day</h6>
                          <h5 className="mb-0">${calculatePricePerDay()}</h5>
                        </div>
                      </div>

                      <div className="alert alert-info mb-0">
                        <small>
                          <strong>Note:</strong> Prices include all taxes and
                          fees. Cancellation policy applies 48 hours before
                          check-in.
                        </small>
                      </div>
                    </div>
                  </div>

                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Quick Actions</h5>
                      <div className="d-grid gap-2">
                        <Link
                          to={`/reservations/new?roomId=${id}`}
                          className="btn btn-outline-primary"
                        >
                          Make New Reservation
                        </Link>
                        <Link
                          to={`/rooms/edit/${id}`}
                          className="btn btn-outline-secondary"
                        >
                          Update Room Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <div className="alert-icon text-danger mb-3">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </div>
                  <h4>Are you sure?</h4>
                  <p className="text-muted">
                    You are about to delete the room "{room.name}". This action
                    cannot be undone.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete Room"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}

      <Footer />
    </>
  );
};

export default RoomViewTutor;
