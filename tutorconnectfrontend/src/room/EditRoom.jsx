import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import SideBar from "../layouts/SideBars/SideBar";
import Navbar from "../layouts/NavBar";
import Footer from "../layouts/footer";
import AdminSideBar from "../layouts/SideBars/AdminSideBar";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    capacity: "",
    startDate: "",
    endDate: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/rooms/${id}`);
        const roomData = response.data.room; // Access the nested room object

        console.log("Room data:", roomData); // Verify the structure

        setFormData({
          name: roomData.name || '',
          capacity: roomData.capacity?.toString() || '',
          amount: roomData.amount?.toString() || '',
          startDate: roomData.startDate ?
              new Date(roomData.startDate).toISOString().split('T')[0] : '',
          endDate: roomData.endDate ?
              new Date(roomData.endDate).toISOString().split('T')[0] : ''
        });

      } catch (err) {
        console.error("Error details:", {
          status: err.response?.status,
          data: err.response?.data,
          error: err.message
        });
        setError("Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates

        // (20 per day)
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

    if (name === "startDate" && formData.endDate && value > formData.endDate) {
      setFormData({
        ...formData,
        [name]: value,
        endDate: value, // Reset end date to start date if it becomes invalid
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date values");
      }

      if (endDate < startDate) {
        throw new Error("La date de fin doit être après la date de début");
      }

      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity),
        amount: parseInt(formData.amount),
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };

      await axiosClient.put(`/rooms/${id}`, payload);
      setSuccess("Salle mise à jour avec succès");
      setTimeout(() => navigate("/admin/rooms"), 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        const errors = err.response.data
          .map((e) => e.defaultMessage)
          .join(", ");
        setError(`Erreurs : ${errors}`);
      } else if (err.response?.status === 403) {
        setError("Action non autorisée.");
      } else {
        setError(err.message || "Erreur lors de la mise à jour");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);
  const dateInputStyle = {
    cursor: "pointer",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ced4da",
    backgroundColor: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <>
      <AdminSideBar />
      <Navbar />
      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <h2 className="mb-4">Edit Room</h2>

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
                    Amount
                    </label>
                    <div className="input-group">
                      <input
                          readOnly
                          type="number"
                          className="form-control"
                          id="amount"
                          name="amount"
                          value={formData.amount}
                          min="0"
                      />
                    </div>
                    <small className="text-muted">
                      Automatically calculated based on selected dates
                    </small>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-calendar"></i>
                      </span>
                      <input
                          type="date"
                          className="form-control"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                          min={today}
                          style={dateInputStyle}
                      />
                    </div>
                    <small className="text-muted">
                      Cannot select dates before today
                    </small>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="endDate" className="form-label">
                      End Date
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-calendar"></i>
                      </span>
                      <input
                          type="date"
                          className="form-control"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                          min={formData.startDate || today}
                          style={dateInputStyle}
                      />
                    </div>
                    <small className="text-muted">
                      Cannot be before start date
                    </small>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                      type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "In progress..." : "Update"}
                  </button>
                  <button
                    style={{ marginLeft: "40px" }}
                    type="button"
                    className="btn btn-secondary ms-2"
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

export default EditRoom;
