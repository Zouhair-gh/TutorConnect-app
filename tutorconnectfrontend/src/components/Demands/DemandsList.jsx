import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import AdminSideBar from "../../layouts/SideBars/AdminSideBar";
import NavBar from "../../layouts/NavBar";

const DemandsList = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("PENDING");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDemands();
  }, [activeTab]);

  const fetchDemands = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/demands/status/${activeTab}`);
      setDemands(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching demands:", err);
      setError("Failed to load demands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const statusUpdate = { status: newStatus };
            const response = await axiosClient.put(`/demands/${id}/status`, statusUpdate);

            // Handle success
        } catch (err) {
            console.error("Detailed error:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });

            setError(err.response?.data?.message ||
                `Failed to update status: ${err.response?.status || 'Network error'}`);
        }
    };

  const processApprovedDemand = async (demand) => {
    try {
      // Determine the type of demand based on available data
      const demandType = determineDemandType(demand);

      switch(demandType) {
        case "TUTOR_ACCOUNT":
          await createTutorAccount(demand);
          break;
        case "ROOM_CREATION":
          await createRoom(demand);
          break;
        case "ROOM_RENEWAL":
          await renewRoom(demand);
          break;
        default:
          console.warn("Unknown demand type");
      }
    } catch (err) {
      console.error("Error processing the approved demand:", err);
      throw err; // Rethrow to be caught by the caller
    }
  };

  const determineDemandType = (demand) => {
    // Check demand properties to determine the type
    if (demand.demandType) {
      return demand.demandType; // If the backend already sets this property
    }

    // Otherwise infer from available data
    if (demand.purpose) {
      const purpose = demand.purpose.toLowerCase();

      if (purpose.includes("tutor") || purpose.includes("account")) {
        return "TUTOR_ACCOUNT";
      }

      if (purpose.includes("extend") || purpose.includes("renewal") || purpose.includes("renew")) {
        return "ROOM_RENEWAL";
      }

      if (purpose.includes("room") || purpose.includes("class")) {
        return "ROOM_CREATION";
      }
    }

    // Default to tutor account creation if can't determine
    return "TUTOR_ACCOUNT";
  };

  const createTutorAccount = async (demand) => {
    // API call to create tutor account
    try {
      await axiosClient.post("/users/create-tutor", {
        fullName: demand.fullName,
        email: demand.email,
        phone: demand.phone,
        experience: demand.experience,
        // Add other necessary fields
      });
    } catch (err) {
      console.error("Error creating tutor account:", err);
      throw new Error("Failed to create tutor account");
    }
  };

  const createRoom = async (demand) => {
    // API call to create a new room
    try {
      // Extract room data from demand message or additional fields
      // This is just an example, adapt based on your actual data structure
      await axiosClient.post("/rooms/create", {
        name: demand.purpose, // Or parse from message
        tutorId: demand.userId, // If available
        capacity: 10, // Default value or parse from message
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],
        amount: 0 // Default value or parse from message
      });
    } catch (err) {
      console.error("Error creating room:", err);
      throw new Error("Failed to create room");
    }
  };

  const renewRoom = async (demand) => {
    // API call to renew/extend a room
    try {
      if (!demand.roomId) {
        throw new Error("Room ID not provided for renewal");
      }

      // This is just an example, adapt based on your actual data structure
      await axiosClient.put(`/rooms/${demand.roomId}/renew`, {
        endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0] // Default +30 days
        // Add other fields that might need updating
      });
    } catch (err) {
      console.error("Error renewing room:", err);
      throw new Error("Failed to renew room");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const classes = {
      PENDING: "badge bg-warning",
      APPROVED: "badge bg-success",
      REJECTED: "badge bg-danger",
    };
    return classes[status] || "badge bg-secondary";
  };

  const getDemandTypeBadge = (demand) => {
    const type = determineDemandType(demand);
    const classes = {
      TUTOR_ACCOUNT: "badge bg-info me-2",
      ROOM_CREATION: "badge bg-primary me-2",
      ROOM_RENEWAL: "badge bg-purple me-2"
    };

    const labels = {
      TUTOR_ACCOUNT: "Tutor Account",
      ROOM_CREATION: "New Room",
      ROOM_RENEWAL: "Room Renewal"
    };

    return (
        <span className={classes[type] || "badge bg-secondary me-2"}>
        {labels[type] || "Unknown"}
      </span>
    );
  };

  const filteredDemands = demands.filter(
      (demand) =>
          demand.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          demand.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          demand.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          demand.id?.toString().includes(searchTerm)
  );

  if (loading) {
    return (
        <>
          <AdminSideBar />
          <NavBar />
          <div className="wrapper">
            <div className="content-page">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading demands...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
    );
  }

  return (
      <>
        <AdminSideBar />
        <NavBar />
        <div className="wrapper">
          <div className="content-page">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h4 className="card-title">Tutor Subscription & Room Demands</h4>
                      <div>
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search demands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "250px", display: "inline-block" }}
                        />
                      </div>
                    </div>

                    <div className="card-body">
                      {/* Status tabs */}
                      <ul className="nav nav-tabs nav-tabs-custom mb-3">
                        <li className="nav-item">
                          <a
                              className={`nav-link ${
                                  activeTab === "PENDING" ? "active" : ""
                              }`}
                              onClick={() => setActiveTab("PENDING")}
                              role="button"
                          >
                            <span className="d-none d-sm-block">Pending</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                              className={`nav-link ${
                                  activeTab === "APPROVED" ? "active" : ""
                              }`}
                              onClick={() => setActiveTab("APPROVED")}
                              role="button"
                          >
                            <span className="d-none d-sm-block">Approved</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                              className={`nav-link ${
                                  activeTab === "REJECTED" ? "active" : ""
                              }`}
                              onClick={() => setActiveTab("REJECTED")}
                              role="button"
                          >
                            <span className="d-none d-sm-block">Rejected</span>
                          </a>
                        </li>
                      </ul>

                      {success && (
                          <div className="alert alert-success" role="alert">
                            {success}
                          </div>
                      )}

                      {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                      )}

                      {filteredDemands.length === 0 ? (
                          <div className="text-center py-5">
                            <div className="mb-4">
                              <i
                                  className="ri-user-add-line text-muted"
                                  style={{ fontSize: "48px" }}
                              ></i>
                            </div>
                            <h5 className="mb-2">No demands found</h5>
                            <p className="text-muted mb-4">
                              {searchTerm
                                  ? "No demands match your search criteria"
                                  : `You don't have any ${activeTab.toLowerCase()} demands`}
                            </p>
                          </div>
                      ) : (
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead>
                              <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Purpose</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                              </tr>
                              </thead>
                              <tbody>
                              {filteredDemands.map((demand) => (
                                  <tr key={demand.id}>
                                    <td>#{demand.id}</td>
                                    <td>{getDemandTypeBadge(demand)}</td>
                                    <td>{demand.fullName}</td>
                                    <td>{demand.email}</td>
                                    <td>{demand.purpose}</td>
                                    <td>
                                  <span
                                      className={getStatusBadge(demand.status)}
                                  >
                                    {demand.status}
                                  </span>
                                    </td>
                                    <td>{formatDate(demand.createdAt)}</td>
                                    <td>
                                      <div className="d-flex">
                                        {/* Detail view button */}
                                        <button
                                            onClick={() =>
                                                navigate(`/admin/demands/${demand.id}`)
                                            }
                                            className="btn btn-sm btn-outline-primary me-2"
                                            title="View Details"
                                        >
                                          <i className="ri-eye-line"></i>
                                        </button>

                                        {/* Action buttons based on current status */}
                                        {activeTab === "PENDING" && (
                                            <>
                                                <button onClick={() => handleStatusChange(demand.id, "APPROVED")}>
                                                    <i className="ri-check-line"></i>
                                                </button>
                                                <button
                                                    onClick={() =>
                                                      handleStatusChange(
                                                          demand,
                                                          "REJECTED"
                                                      )
                                                  }
                                                  className="btn btn-sm btn-outline-danger"
                                                  title="Reject"
                                              >
                                                <i className="ri-close-line"></i>
                                              </button>
                                            </>
                                        )}

                                        {activeTab !== "PENDING" && (
                                            <button
                                                onClick={() =>
                                                    handleStatusChange(
                                                        demand,
                                                        "PENDING"
                                                    )
                                                }
                                                className="btn btn-sm btn-outline-warning"
                                                title="Reset to Pending"
                                            >
                                              <i className="ri-refresh-line"></i>
                                            </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                              ))}
                              </tbody>
                            </table>
                          </div>
                      )}
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

export default DemandsList;