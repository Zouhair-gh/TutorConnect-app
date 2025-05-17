import SideBar from "../layouts/SideBars/SideBar";
import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import Navbar from "../layouts/NavBar";
import Footer from "../layouts/footer";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    capacity: "",
    startDate: "",
    endDate: "",
    tutorId: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tutors, setTutors] = useState([]);

  // Fetch tutors on component mount
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axiosClient.get("/tutors/all");
        setTutors(response.data);
      } catch (err) {
        console.error("Failed to fetch tutors", err);
      }
    };
    fetchTutors();
  }, []);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const calculatedAmount = diffDays * 20;

        setFormData(prev => ({
          ...prev,
          amount: calculatedAmount
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
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        throw new Error("End date must be after start date");
      }

      if (!formData.tutorId) {
        throw new Error("Please select a tutor");
      }

      const payload = {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        amount: parseInt(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        tutorId: parseInt(formData.tutorId)
      };

      const response = await axiosClient.post("/rooms/create", payload);
      setSuccess("Room created successfully");
      setTimeout(() => navigate("/admin/rooms"), 1500);
    } catch (err) {
      if (err.response?.status === 401) {
        // Handle unauthorized (likely token expired)
        setError("Session expired. Please login again.");
        setTimeout(() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        }, 2000);
      } else if (err.response?.status === 403) {
        setError("You don't have permission to perform this action");
      } else if (err.response?.data) {
        setError(err.response.data.message || "Error creating room");
      } else {
        setError(err.message || "Error creating room");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
        <SideBar />
        <Navbar />
        <div className="wrapper">
          <div className="content-page">
            <div className="container-fluid">
              <div className="container p-4">
                <h2 className="mb-4">Create a New Room</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          maxLength={255}
                      />
                    </div>
                  </div>

                  <div className="row">
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
                          min="1"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="amount" className="form-label">
                        Amount (DH)
                      </label>
                      <input
                          readOnly
                          type="number"
                          className="form-control"
                          id="amount"
                          name="amount"
                          value={formData.amount}
                          min="0"
                      />
                      <small className="text-muted">
                        Automatically calculated (20 DH per day)
                      </small>
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
                          min={new Date().toISOString().split('T')[0]}
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
                          min={formData.startDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
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
                      >
                        <option value="">Select a tutor</option>
                        {tutors.map(tutor => (
                            <option key={tutor.id} value={tutor.id}>
                              {tutor.firstName} {tutor.lastName} ({tutor.email})
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
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