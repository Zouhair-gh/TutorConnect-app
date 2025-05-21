import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  FiFileText,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import { Badge, ProgressBar } from "react-bootstrap";
import NavBar from "../../layouts/NavBar";
import ParticipantSideBar from "../../layouts/SideBars/ParticipantSidebar";

const ParticipantDeliverables = () => {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { roomId } = useParams();
  const navigate = useNavigate();

  const fetchDeliverables = async () => {
    try {
      setLoading(true);
      const endpoint = roomId
        ? `/deliverables/room/${roomId}/participant` // New endpoint
        : "/deliverables/participant"; // Existing endpoint

      const response = await axiosClient.get(endpoint);
      setDeliverables(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch deliverables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliverables();
  }, [roomId]);
  const formatDate = (dateString) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUBMITTED":
        return <Badge bg="info">Submitted</Badge>;
      case "GRADED":
        return <Badge bg="success">Graded</Badge>;
      case "LATE":
        return <Badge bg="danger">Late</Badge>;
      default:
        return <Badge bg="secondary">Pending</Badge>;
    }
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return 0;
    const end = new Date(deadline);
    const now = new Date();
    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    fetchDeliverables();
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
      <NavBar />
      <ParticipantSideBar />

      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="fw-bold">My Assignments</h2>
                  <p className="text-muted">
                    View and submit your deliverables
                  </p>
                </div>
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

              <div className="row">
                {deliverables.length > 0 ? (
                  deliverables.map((deliverable) => {
                    const daysRemaining = getDaysRemaining(
                      deliverable.deadline
                    );
                    const progressPercentage = Math.min(
                      100,
                      Math.max(0, (daysRemaining / 14) * 100)
                    );

                    return (
                      <div
                        key={deliverable.id}
                        className="col-md-6 col-lg-4 mb-4"
                      >
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-header bg-white border-0 pb-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="mb-0 fw-bold text-truncate">
                                {deliverable.title}
                              </h5>
                              {getStatusBadge(deliverable.status)}
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="mb-3">
                              <p className="text-muted mb-2">
                                {deliverable.description}
                              </p>

                              {deliverable.deadline && (
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between mb-1">
                                    <small className="text-muted">
                                      Deadline in
                                    </small>
                                    <small className="fw-bold">
                                      {daysRemaining} days
                                    </small>
                                  </div>
                                  <ProgressBar
                                    now={progressPercentage}
                                    variant={
                                      daysRemaining > 7
                                        ? "success"
                                        : daysRemaining > 3
                                        ? "warning"
                                        : "danger"
                                    }
                                    className="rounded-pill"
                                    style={{ height: "6px" }}
                                  />
                                </div>
                              )}

                              <div className="d-flex flex-column gap-2 mb-3">
                                <div className="d-flex align-items-center">
                                  <FiCalendar className="me-2 text-info" />
                                  <span>
                                    Deadline:{" "}
                                    <strong>
                                      {formatDate(deliverable.deadline)}
                                    </strong>
                                  </span>
                                </div>
                                <div className="d-flex align-items-center">
                                  <FiCheckCircle className="me-2 text-success" />
                                  <span>
                                    Max points:{" "}
                                    <strong>
                                      {deliverable.maxPoints || "N/A"}
                                    </strong>
                                  </span>
                                </div>
                                {deliverable.grade !== null && (
                                  <div className="d-flex align-items-center">
                                    <FiCheckCircle className="me-2 text-warning" />
                                    <span>
                                      Grade:{" "}
                                      <strong>
                                        {deliverable.grade}/
                                        {deliverable.maxPoints}
                                      </strong>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="card-footer bg-white border-0 pt-0">
                            <div className="d-flex justify-content-between">
                              <Link
                                to={`/participant/deliverables/${deliverable.id}/submit`}
                                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                              >
                                <FiArrowRight className="me-1" /> Submit
                                assignment
                              </Link>
                              {!deliverable.isSubmitted &&
                                deliverable.isVisible && (
                                  <Link
                                    to={`/participant/deliverables/${deliverable.id}/submit`}
                                    className="btn btn-sm btn-primary rounded-pill px-3"
                                  >
                                    Submit Now
                                  </Link>
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
                        <FiFileText className="display-4 text-muted mb-3" />
                        <h4 className="fw-bold mb-2">No Assignments Found</h4>
                        <p className="text-muted mb-4">
                          You don't have any active assignments yet
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParticipantDeliverables;
