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
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (end >= start) {
        // Calculate difference in days
        const diffTime = Math.abs(end - start);
        // +1 to include both
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        //  20 * nbr_days
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
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        throw new Error("La date de fin doit être après la date de début");
      }

      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity),
        amount: parseInt(formData.amount),
        startDate: new Date(formData.startDate).toISOString().split("T")[0],
        endDate: new Date(formData.endDate).toISOString().split("T")[0],
      };

      await axiosClient.post("/rooms/create", payload);
      setSuccess("Salle créée avec succès");
      setTimeout(() => navigate("/rooms"), 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        const errors = err.response.data
          .map((e) => e.defaultMessage)
          .join(", ");
        setError(`Erreurs : ${errors}`);
      } else if (err.response?.status === 403) {
        setError("Action non autorisée.");
      } else {
        setError(err.message || "Erreur lors de la création");
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
              <h2 className="mb-4">Create a New Room </h2>

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
                      Automatically calculated based on selected dates
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

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "In progress " : "Create"}
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

export default AddRoom;
