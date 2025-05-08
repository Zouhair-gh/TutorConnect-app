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
import { Modal, Button, Form } from "react-bootstrap";

const TutorRoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // État pour le modal de renouvellement
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [renewalDuration, setRenewalDuration] = useState(30);
  const [renewalType, setRenewalType] = useState("days");
  const [customEndDate, setCustomEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [purpose, setPurpose] = useState("Extend class duration");
  const [capacity, setCapacity] = useState(0);
  const [amount, setAmount] = useState(0);

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

  const openRenewalModal = (room) => {
    setSelectedRoom(room);
    setCapacity(room.capacity);
    setAmount(room.amount);

    if (room && room.endDate) {
      const endDate = new Date(room.endDate);
      const newEndDate = new Date(endDate);
      newEndDate.setDate(endDate.getDate() + 30);

      const formattedDate = newEndDate.toISOString().split("T")[0];
      setCustomEndDate(formattedDate);
    }

    setShowRenewalModal(true);
  };

  const handleSubmitRenewal = async (e) => {
    e.preventDefault();

    if (!selectedRoom) return;

    try {
      let newEndDate;

      if (renewalType === "days") {
        const currentEndDate = new Date(selectedRoom.endDate);
        newEndDate = new Date(currentEndDate);
        newEndDate.setDate(
          currentEndDate.getDate() + parseInt(renewalDuration)
        );
      } else {
        newEndDate = new Date(customEndDate);
      }

      if (newEndDate < new Date(selectedRoom.endDate)) {
        throw new Error(
          "La nouvelle date doit être postérieure à la date de fin actuelle"
        );
      }

      const renewalData = {
        roomId: selectedRoom.id,
        demandType: "RENEW",
        purpose: purpose,
        message: message || `Renewal request for ${renewalDuration} days`,
        newEndDate: newEndDate.toISOString().split("T")[0], // Format YYYY-MM-DD
        amount: amount,
        capacity: capacity,
      };

      // Use the existing endpoint for room renewal since tutorService.requestRoomRenewal is not implemented
      await axiosClient.post(
        `/rooms/request-renewal/${selectedRoom.id}`,
        renewalData
      );

      // Gestion du feedback
      setSuccess(
        `Demande de renouvellement pour "${selectedRoom.name}" envoyée !`
      );
      setTimeout(() => setSuccess(""), 5000);
      setShowRenewalModal(false);
      fetchRooms();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Erreur lors de la demande"
      );
      console.error("Renewal error:", err);
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

    // Option 1: Polling toutes les 30 secondes
    // const interval = setInterval(fetchRooms, 30000);

    //return () => clearInterval(interval);
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
                                  onClick={() => openRenewalModal(room)}
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

      {/* Modal de renouvellement */}
      <Modal
        show={showRenewalModal}
        onHide={() => setShowRenewalModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Classroom Renewal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <Form onSubmit={handleSubmitRenewal}>
              <div className="mb-4">
                <h6 className="fw-bold">Classroom Information</h6>
                <div className="d-flex flex-column mt-2">
                  <p className="mb-1">
                    <strong>Name:</strong> {selectedRoom.name}
                  </p>
                  <p className="mb-1">
                    <strong>Current End Date:</strong>{" "}
                    {formatDate(selectedRoom.endDate)}
                  </p>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Purpose</Form.Label>
                <Form.Control
                  as="select"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                >
                  <option value="Extend class duration">
                    Extend class duration
                  </option>
                  <option value="Renew expired classroom">
                    Renew expired classroom
                  </option>
                  <option value="Change classroom parameters">
                    Change classroom parameters
                  </option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Capacity</Form.Label>
                <Form.Control
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  min="1"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Amount ($)</Form.Label>
                <Form.Control
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  required
                />
              </Form.Group>

              <div className="mb-3">
                <h6 className="fw-bold">Select Renewal Type</h6>
                <Form.Check
                  type="radio"
                  label="Extend by days"
                  name="renewalType"
                  id="renewalTypeDays"
                  checked={renewalType === "days"}
                  onChange={() => setRenewalType("days")}
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  label="Set specific end date"
                  name="renewalType"
                  id="renewalTypeCustom"
                  checked={renewalType === "custom"}
                  onChange={() => setRenewalType("custom")}
                />
              </div>

              {renewalType === "days" ? (
                <Form.Group className="mb-3">
                  <Form.Label>Extension Period (Days)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={renewalDuration}
                    onChange={(e) => setRenewalDuration(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Specify how many days you want to extend your classroom.
                  </Form.Text>
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>New End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                  <Form.Text className="text-muted">
                    Select the new end date for your classroom.
                  </Form.Text>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Additional Message (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add any additional information or special requests..."
                />
              </Form.Group>

              <div className="alert alert-info">
                <small>
                  <strong>Note:</strong> Your renewal request will be sent to an
                  administrator for approval. You will be notified once your
                  request is processed.
                </small>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => setShowRenewalModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Submit Renewal Request
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
};

export default TutorRoomsList;
