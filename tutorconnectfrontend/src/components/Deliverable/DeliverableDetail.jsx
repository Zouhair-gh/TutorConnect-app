import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

import {
  FiFileText,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiDownload,
  FiArrowLeft,
} from "react-icons/fi";
import { Badge, ListGroup, Button } from "react-bootstrap";
import CommentsSection from "./CommentsSection";
import NavBar from "../../layouts/NavBar";
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";

const DeliverableDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deliverable, setDeliverable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDeliverable = async () => {
    try {
      const response = await axiosClient.get(`/deliverables/${id}`);
      setDeliverable(response.data);
    } catch (err) {
      setError("Failed to fetch deliverable details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  useEffect(() => {
    fetchDeliverable();
  }, [id]);

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

  if (!deliverable) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="alert alert-danger">
          {error || "Deliverable not found"}
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <TutorSideBar />

      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary rounded-pill px-3 me-3"
                  >
                    <FiArrowLeft className="me-1" /> Back
                  </button>
                  <h2 className="fw-bold d-inline-block">
                    {deliverable.title}
                  </h2>
                </div>
                {deliverable.status === "SUBMITTED" && (
                  <Link
                    to={`/tutor/deliverables/${id}/grade`}
                    className="btn btn-warning rounded-pill px-4"
                  >
                    Grade Submission
                  </Link>
                )}
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
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">Description</h5>
                      <p className="card-text">{deliverable.description}</p>

                      <div className="row mt-4">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center mb-3">
                            <FiUser className="me-2 text-primary" />
                            <div>
                              <small className="text-muted">Assigned to</small>
                              <p className="mb-0 fw-bold">
                                {deliverable.participantName}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center mb-3">
                            <FiCalendar className="me-2 text-primary" />
                            <div>
                              <small className="text-muted">Deadline</small>
                              <p className="mb-0 fw-bold">
                                {new Date(
                                  deliverable.deadline
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {deliverable.isSubmitted && (
                        <>
                          <hr />
                          <h5 className="fw-bold mt-4">Submission Details</h5>
                          <div className="d-flex align-items-center mb-3">
                            <FiCalendar className="me-2 text-primary" />
                            <div>
                              <small className="text-muted">Submitted on</small>
                              <p className="mb-0 fw-bold">
                                {new Date(
                                  deliverable.submissionDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {deliverable.filePath && (
                            <div className="mb-3">
                              <Button
                                variant="outline-primary"
                                onClick={() =>
                                  handleDownload(deliverable.filePath)
                                }
                              >
                                <FiDownload className="me-2" />
                                Download Submission
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {deliverable.grade !== null && (
                        <>
                          <hr />
                          <h5 className="fw-bold mt-4">Grading</h5>
                          <div className="d-flex align-items-center mb-3">
                            <FiCheckCircle className="me-2 text-success" />
                            <div>
                              <small className="text-muted">Grade</small>
                              <p className="mb-0 fw-bold">
                                {deliverable.grade} / {deliverable.maxPoints}
                              </p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <small className="text-muted">Feedback</small>
                            <p className="mb-0">
                              {deliverable.feedback || "No feedback provided"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <CommentsSection deliverableId={id} />
                </div>

                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">Details</h5>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span>Status</span>
                          <Badge
                            bg={
                              deliverable.status === "GRADED"
                                ? "success"
                                : deliverable.status === "SUBMITTED"
                                ? "info"
                                : deliverable.status === "LATE"
                                ? "danger"
                                : "secondary"
                            }
                          >
                            {deliverable.status}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span>Max Points</span>
                          <span className="fw-bold">
                            {deliverable.maxPoints}
                          </span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span>Visibility</span>
                          <span className="fw-bold">
                            {deliverable.isVisible ? "Visible" : "Hidden"}
                          </span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span>Room</span>
                          <Link
                            to={`/tutor/rooms/${deliverable.roomId}`}
                            className="text-primary"
                          >
                            {deliverable.roomName}
                          </Link>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                </div>

                {/* new */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">Grade Access</h5>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span>Status</span>
                          <Badge
                            bg={
                              deliverable.status === "GRADED"
                                ? "success"
                                : deliverable.status === "SUBMITTED"
                                ? "info"
                                : deliverable.status === "LATE"
                                ? "danger"
                                : "secondary"
                            }
                          >
                            {deliverable.status}
                          </Badge>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span>Max Points</span>
                          <span className="fw-bold">
                            {deliverable.maxPoints}
                          </span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span>Visibility</span>
                          <span className="fw-bold">
                            {deliverable.isVisible ? "Visible" : "Hidden"}
                          </span>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <span>Room</span>
                          <Link
                            to={`/tutor/rooms/${deliverable.roomId}`}
                            className="text-primary"
                          >
                            {deliverable.roomName}
                          </Link>
                        </ListGroup.Item>
                        <ListGroup.Item className="text-center pt-3">
                          <Link
                            to={`/tutor/deliverables/${id}/grade`}
                            className="btn btn-warning rounded-pill px-4"
                          >
                            Grade Submission
                          </Link>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </div>
                </div>
                {/* end new */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliverableDetail;
