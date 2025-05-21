import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import Navbar from "../layouts/NavBar";
import Footer from "../layouts/footer";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "../layouts/SideBars/AdminSideBar";

const AddRoom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    capacity: "",
    startDate: "",
    endDate: "",
    tutorId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [tutorsLoading, setTutorsLoading] = useState(true);

  // Verify admin authorization and fetch tutors on component mount
  useEffect(() => {
    const checkAuthAndFetchTutors = async () => {
      try {
        // First, check if user has proper authorization
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Debug - Get user role from session if available
        try {
          const userResponse = await axiosClient.get("/auth/current-user");
          console.log("Current user info:", userResponse.data);
        } catch (userErr) {
          console.log("Could not fetch current user info:", userErr);
        }

        // Try alternative endpoints in case the path is different
        let tutorsData = [];
        let endpointSuccess = false;

        const endpointsToTry = [
          "/tutors/all", // Original endpoint
          "/admin/tutors/all", // Maybe needs admin prefix
          "/admin/tutors", // Alternative path
          "/tutors", // Simplified path
        ];

        // Try all endpoints
        for (const endpoint of endpointsToTry) {
          if (endpointSuccess) break;

          try {
            console.log(`Trying to fetch tutors from: ${endpoint}`);
            const response = await axiosClient.get(endpoint);

            if (response.data) {
              console.log(
                `Successful response from ${endpoint}:`,
                response.data
              );

              // Handle different response structures
              if (Array.isArray(response.data)) {
                tutorsData = response.data;
              } else if (
                response.data.content &&
                Array.isArray(response.data.content)
              ) {
                tutorsData = response.data.content;
              } else if (typeof response.data === "object") {
                // Try to extract array from response
                const possibleArrays = Object.values(response.data).filter(
                  (val) => Array.isArray(val)
                );
                if (possibleArrays.length > 0) {
                  tutorsData = possibleArrays[0];
                }
              }

              if (tutorsData.length > 0) {
                endpointSuccess = true;
                console.log("Successfully found tutors data:", tutorsData);
              }
            }
          } catch (err) {
            console.log(`Error trying endpoint ${endpoint}:`, err.message);
          }
        }

        if (endpointSuccess) {
          setTutors(tutorsData);
        } else {
          throw new Error("Could not find tutors data from any endpoints");
        }

        setTutorsLoading(false);
      } catch (err) {
        console.error("Tutors fetch error:", err.message);

        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => {
            localStorage.removeItem("authToken");
            navigate("/login");
          }, 2000);
        } else if (err.response?.status === 403) {
          setError(
            "You don't have permission to view tutors. Admin role required. Try logging out and back in."
          );
        } else {
          setError(
            "Failed to load tutors: " + (err.message || "Unknown error")
          );
        }
        setTutorsLoading(false);
      }
    };

    checkAuthAndFetchTutors();
  }, [navigate]);

  // Calculate amount based on dates
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const calculatedAmount = diffDays * 20;

        setFormData((prev) => ({
          ...prev,
          amount: calculatedAmount,
        }));
      }
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        amount: parseFloat(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        tutorId: parseInt(formData.tutorId),
      };

      console.log("Submitting room with payload:", payload);

      const response = await axiosClient.post("/rooms/create", payload);

      // Handle successful creation (201 Created)
      if (response.status === 201) {
        console.log("Room created successfully:", response.data);
        setSuccess(
          `Room created successfully! ID: ${response.data.roomId || "N/A"}`
        );
        setTimeout(() => navigate("/admin/rooms"), 1500);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (err) {
      console.error("Room creation error:", err);

      // Enhanced error messages
      if (err.response) {
        if (err.response.status === 404) {
          setError(
            "The selected tutor was not found. Please refresh the tutor list."
          );
        } else if (err.response.data) {
          setError(err.response.data.message || err.response.data);
        } else {
          setError(`Server error: ${err.response.status}`);
        }
      } else {
        setError(err.message || "Failed to create room");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // For development/debugging - show token info
  const showTokenDebugInfo = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        // Split the token and decode the payload
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        console.log("Token payload:", payload);
        alert("Token info logged to console. Check roles and expiration.");
      } catch (e) {
        console.error("Could not decode token:", e);
        alert("Could not decode token. See console for details.");
      }
    } else {
      alert("No token found in localStorage");
    }
  };

  return (
    <>
      <AdminSideBar />
      <Navbar />
      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <h2 className="mb-4">Create a New Room</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {/* {process.env.NODE_ENV === 'development' && (
                    <div className="mb-3">
                      <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={showTokenDebugInfo}
                          type="button"
                      >
                        Debug Auth Token
                      </button>
                    </div>
                )} */}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Room Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="capacity" className="form-label">
                      Capacity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="endDate" className="form-label">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount (Calculated)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      readOnly
                    />
                    <small className="text-muted">
                      Amount is calculated as $20 per day
                    </small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="tutorId" className="form-label">
                      Assign to Tutor
                    </label>
                    <select
                      className="form-control"
                      id="tutorId"
                      name="tutorId"
                      value={formData.tutorId}
                      onChange={handleChange}
                      required
                      disabled={tutorsLoading}
                    >
                      <option value="">
                        {tutorsLoading ? "Loading tutors..." : "Select a tutor"}
                      </option>
                      {tutors.map((tutor) => (
                        <option key={tutor.id} value={tutor.id}>
                          {tutor.firstName} {tutor.lastName} ({tutor.email})
                        </option>
                      ))}
                    </select>
                    {tutorsLoading && (
                      <small className="text-muted">Loading tutors...</small>
                    )}
                    {tutors.length === 0 && !tutorsLoading && (
                      <small className="text-danger">
                        No tutors available or you may not have permission to
                        view them
                      </small>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || tutorsLoading}
                  >
                    {isSubmitting ? "Creating..." : "Create Room"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-3"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddRoom;
