import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { FiSave, FiArrowLeft, FiCheckCircle, FiUsers } from "react-icons/fi";
import NavBar from "../../layouts/NavBar";
import TutorSideBar from "../../layouts/SideBars/TutorSideBar";

const GradeDeliverableForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [singleMode, setSingleMode] = useState(true);
  const [selectedParticipantId, setSelectedParticipantId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [maxPoints, setMaxPoints] = useState(100);

  const [formData, setFormData] = useState({
    grade: "",
    feedback: "",
  });

  const [batchFormData, setBatchFormData] = useState({
    grade: "",
    feedback: "",
  });

  const [deliverable, setDeliverable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateGrade = (grade, maxPoints) => {
    if (grade === "" || isNaN(grade)) return false;
    const numericGrade = parseFloat(grade);
    return numericGrade >= 0 && numericGrade <= maxPoints;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deliverableResponse = await axiosClient.get(
          `/deliverables/${id}`
        );
        setDeliverable(deliverableResponse.data);
        setMaxPoints(deliverableResponse.data.maxPoints || 100);

        setFormData({
          grade: deliverableResponse.data.grade || "",
          feedback: deliverableResponse.data.feedback || "",
        });

        const roomId = deliverableResponse.data.roomId;
        setRoomId(roomId);

        const roomDeliverablesResponse = await axiosClient.get(
          `/deliverables/room/${roomId}`
        );

        const relatedDeliverables = roomDeliverablesResponse.data.filter(
          (d) => d.title === deliverableResponse.data.title
        );
        setDeliverables(relatedDeliverables);

        const participantsList = relatedDeliverables
          .map((d) => ({ id: d.participantId, name: d.participantName }))
          .filter(
            (p, index, self) => index === self.findIndex((t) => t.id === p.id)
          );

        setParticipants(participantsList);

        if (deliverableResponse.data.participantId) {
          setSelectedParticipantId(deliverableResponse.data.participantId);
        } else if (participantsList.length > 0) {
          setSelectedParticipantId(participantsList[0].id);
        }
      } catch (err) {
        setError("Failed to fetch deliverable details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleParticipantChange = (e) => {
    const participantId = e.target.value;
    setSelectedParticipantId(participantId);

    const participantDeliverable = deliverables.find(
      (d) => d.participantId === parseInt(participantId)
    );

    setFormData({
      grade: participantDeliverable?.grade || "",
      feedback: participantDeliverable?.feedback || "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBatchChange = (e) => {
    const { name, value } = e.target;
    setBatchFormData((prev) => ({ ...prev, [name]: value }));
  };

  //   const handleSingleSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!validateGrade(formData.grade, maxPoints)) {
  //       setError(`Grade must be between 0 and ${maxPoints}`);
  //       return;
  //     }

  //     setSubmitting(true);
  //     setError("");
  //     setSuccessMessage("");

  //     try {
  //       const participantDeliverable = deliverables.find(
  //         (d) => d.participantId === parseInt(selectedParticipantId)
  //       );

  //       if (!participantDeliverable) {
  //         setError("Participant deliverable not found");
  //         return;
  //       }

  //       await axiosClient.post("/deliverables/grade", {
  //         deliverableId: participantDeliverable.id,
  //         grade: parseFloat(formData.grade),
  //         feedback: formData.feedback,
  //       });

  //       setSuccessMessage(
  //         `Successfully graded ${participantDeliverable.participantName}'s submission`
  //       );

  //       const updatedResponse = await axiosClient.get(
  //         `/deliverables/${participantDeliverable.id}`
  //       );

  //       setDeliverables((prev) =>
  //         prev.map((d) =>
  //           d.id === participantDeliverable.id ? updatedResponse.data : d
  //         )
  //       );
  //     } catch (err) {
  //       setError(err.response?.data?.message || "Failed to submit grade");
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   };
  const handleSingleSubmit = async (e) => {
    e.preventDefault();

    if (!validateGrade(formData.grade, maxPoints)) {
      setError(`Grade must be between 0 and ${maxPoints}`);
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const participantDeliverable = deliverables.find(
        (d) => d.participantId === parseInt(selectedParticipantId)
      );

      if (!participantDeliverable) {
        setError("Participant deliverable not found");
        return;
      }

      // Ajout de logs pour le débogage
      console.log(
        "Submitting grade for deliverable:",
        participantDeliverable.id
      );
      console.log("Payload:", {
        deliverableId: participantDeliverable.id,
        grade: parseFloat(formData.grade),
        feedback: formData.feedback,
      });

      const response = await axiosClient.post("/deliverables/grade", {
        deliverableId: participantDeliverable.id,
        grade: parseFloat(formData.grade),
        feedback: formData.feedback,
      });

      console.log("Grade submission successful:", response.data);

      setSuccessMessage(
        `Successfully graded ${participantDeliverable.participantName}'s submission`
      );

      // Mise à jour optimiste de l'état
      setDeliverables((prev) =>
        prev.map((d) =>
          d.id === participantDeliverable.id
            ? {
                ...d,
                grade: parseFloat(formData.grade),
                feedback: formData.feedback,
                status: "GRADED", // Ajout du statut si nécessaire
              }
            : d
        )
      );
    } catch (err) {
      console.error("Full error details:", {
        message: err.message,
        response: err.response,
        config: err.config,
      });

      if (err.response) {
        // Erreur avec réponse du serveur
        setError(err.response.data?.message || "Server error occurred");
      } else if (err.request) {
        // Requête faite mais pas de réponse
        setError("Network error - Please check your connection");
      } else {
        // Erreur lors de la configuration de la requête
        setError("Request configuration error");
      }
    } finally {
      setSubmitting(false);
    }
  };
  //   const handleBatchSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!validateGrade(batchFormData.grade, maxPoints)) {
  //       setError(`Grade must be between 0 and ${maxPoints}`);
  //       return;
  //     }

  //     setSubmitting(true);
  //     setError("");
  //     setSuccessMessage("");

  //     try {
  //       const gradePromises = deliverables.map((deliverable) =>
  //         axiosClient.post("/deliverables/grade", {
  //           deliverableId: deliverable.id,
  //           grade: parseFloat(batchFormData.grade),
  //           feedback: batchFormData.feedback,
  //         })
  //       );

  //       await Promise.all(gradePromises);

  //       setSuccessMessage(
  //         `Successfully graded all ${deliverables.length} participants`
  //       );

  //       const updatedResponse = await axiosClient.get(
  //         `/deliverables/room/${roomId}`
  //       );

  //       const updatedDeliverables = updatedResponse.data.filter(
  //         (d) => d.title === deliverable.title
  //       );
  //       setDeliverables(updatedDeliverables);
  //     } catch (err) {
  //       setError(err.response?.data?.message || "Failed to submit batch grades");
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   };
  const handleBatchSubmit = async (e) => {
    e.preventDefault();

    if (!validateGrade(batchFormData.grade, maxPoints)) {
      setError(`Grade must be between 0 and ${maxPoints}`);
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log(
        "Starting batch grade submission for",
        deliverables.length,
        "participants"
      );

      const gradePromises = deliverables.map((deliverable) => {
        console.log("Grading deliverable:", deliverable.id);
        return axiosClient.post("/deliverables/grade", {
          deliverableId: deliverable.id,
          grade: parseFloat(batchFormData.grade),
          feedback: batchFormData.feedback,
        });
      });

      const results = await Promise.all(gradePromises);
      console.log("Batch grade results:", results);

      setSuccessMessage(
        `Successfully graded ${deliverables.length} participants`
      );

      // Mise à jour optimiste
      setDeliverables((prev) =>
        prev.map((d) => ({
          ...d,
          grade: parseFloat(batchFormData.grade),
          feedback: batchFormData.feedback,
          status: "GRADED",
        }))
      );
    } catch (err) {
      console.error("Batch grade error:", {
        message: err.message,
        failedRequests: err.response || err.request,
      });

      if (err.response) {
        setError(err.response.data?.message || "Batch grading failed");
      } else {
        setError("Network error during batch grading");
      }
    } finally {
      setSubmitting(false);
    }
  };
  if (loading && !deliverable) {
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
      <TutorSideBar />

      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="fw-bold">Grade Deliverable</h2>
                  <p className="text-muted">
                    {singleMode
                      ? "Grade individual student submissions"
                      : "Grade all student submissions"}
                    for: {deliverable?.title}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setSingleMode(!singleMode)}
                    className="btn btn-outline-primary rounded-pill px-4 me-2"
                  >
                    <FiUsers className="me-2" />
                    Switch to {singleMode ? "Batch" : "Individual"} Grading
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary rounded-pill px-4"
                  >
                    <FiArrowLeft className="me-2" /> Back
                  </button>
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

              {successMessage && (
                <div
                  className="alert alert-success alert-dismissible fade show"
                  role="alert"
                >
                  {successMessage}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccessMessage("")}
                  ></button>
                </div>
              )}

              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  {singleMode ? (
                    <form onSubmit={handleSingleSubmit}>
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              Student
                            </label>
                            <select
                              className="form-select"
                              value={selectedParticipantId}
                              onChange={handleParticipantChange}
                              required
                            >
                              <option value="">Select a student</option>
                              {participants.map((participant) => (
                                <option
                                  key={participant.id}
                                  value={participant.id}
                                >
                                  {participant.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              Max Points
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={maxPoints}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Grade</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FiCheckCircle />
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            name="grade"
                            min="0"
                            max={maxPoints}
                            step="0.1"
                            value={formData.grade}
                            onChange={handleChange}
                            required
                          />
                          <span className="input-group-text">
                            / {maxPoints}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold">Feedback</label>
                        <textarea
                          className="form-control"
                          name="feedback"
                          rows="5"
                          value={formData.feedback}
                          onChange={handleChange}
                          placeholder="Provide constructive feedback..."
                        />
                      </div>

                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                          type="submit"
                          className="btn btn-primary rounded-pill px-4"
                          disabled={submitting || !selectedParticipantId}
                        >
                          {submitting ? (
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <FiSave className="me-2" />
                          )}
                          Submit Grade
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleBatchSubmit}>
                      <div className="alert alert-info mb-4">
                        <div className="d-flex align-items-center">
                          <FiUsers className="me-2" size={24} />
                          <div>
                            <strong>Batch Grading Mode</strong>
                            <p className="mb-0">
                              You are about to grade all {participants.length}{" "}
                              students for this deliverable. The same grade and
                              feedback will be applied to everyone.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              Students
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={`All students (${participants.length})`}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              Max Points
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={maxPoints}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Grade for All Students
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FiCheckCircle />
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            name="grade"
                            min="0"
                            max={maxPoints}
                            step="0.1"
                            value={batchFormData.grade}
                            onChange={handleBatchChange}
                            required
                          />
                          <span className="input-group-text">
                            / {maxPoints}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          Feedback for All Students
                        </label>
                        <textarea
                          className="form-control"
                          name="feedback"
                          rows="5"
                          value={batchFormData.feedback}
                          onChange={handleBatchChange}
                          placeholder="Provide constructive feedback for all students..."
                        />
                      </div>

                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                          type="submit"
                          className="btn btn-primary rounded-pill px-4"
                          disabled={submitting || participants.length === 0}
                        >
                          {submitting ? (
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          ) : (
                            <FiSave className="me-2" />
                          )}
                          Submit Grades for All Students
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              <div className="card border-0 shadow-sm mt-4">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Graded Submissions</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Grade</th>
                          <th>Status</th>
                          <th>Submission Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliverables.map((d) => (
                          <tr key={d.id}>
                            <td>{d.participantName}</td>
                            <td>
                              {d.grade !== null && d.grade !== undefined
                                ? `${d.grade} / ${d.maxPoints}`
                                : "Not graded"}
                            </td>
                            <td>
                              {d.submissionDate ? (
                                d.grade !== null && d.grade !== undefined ? (
                                  <span className="badge bg-success">
                                    Graded
                                  </span>
                                ) : (
                                  <span className="badge bg-warning">
                                    Submitted
                                  </span>
                                )
                              ) : (
                                <span className="badge bg-danger">
                                  Not Submitted
                                </span>
                              )}
                            </td>
                            <td>{d.submissionDate || "N/A"}</td>
                          </tr>
                        ))}
                        {deliverables.length === 0 && (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No deliverables found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

export default GradeDeliverableForm;
