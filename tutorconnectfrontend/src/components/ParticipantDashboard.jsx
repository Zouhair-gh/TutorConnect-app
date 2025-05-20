//version2 :
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import ParticipantSideBar from "../layouts/SideBars/ParticipantSidebar";
import NavBar from "../layouts/NavBar";
import {
  FiBook,
  FiUsers,
  FiClock,
  FiAward,
  FiEye,
  FiSettings,
  FiBarChart2,
  FiPieChart,
} from "react-icons/fi";
import { ProgressBar, Badge } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ParticipantDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    active: 0,
    completed: 0,
    total: 0,
    averageProgress: 0,
  });
  const [showCharts, setShowCharts] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosClient.get("/participants/my-rooms");
        const roomsData = response.data || [];
        setRooms(roomsData);

        // Calculate stats
        let active = 0;
        let completed = 0;
        let totalProgress = 0;

        roomsData.forEach((room) => {
          if (room.status === "COMPLETED") {
            completed++;
          } else {
            active++;
          }
          totalProgress += room.progress || 0;
        });

        setStats({
          active,
          completed,
          total: roomsData.length,
          averageProgress:
            roomsData.length > 0
              ? Math.round(totalProgress / roomsData.length)
              : 0,
        });
      } catch (err) {
        setError(
          "Failed to fetch your enrolled rooms. Please try again later."
        );
        console.error("Fetch rooms error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "ACTIVE":
        return "primary";
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Data for pie chart - Course Status
  const statusData = [
    { name: "Active", value: stats.active, color: "#4286f4" },
    { name: "Completed", value: stats.completed, color: "#28a745" },
  ];

  // Data for bar chart - Progress by Course
  const progressData = rooms.map((room) => ({
    name: room.name || "Big Data",
    progress: room.progress || 0,
  }));

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ParticipantSideBar />
      <NavBar />

      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card card-block card-stretch card-height">
                  <div className="card-header d-flex justify-content-between align-items-center border-bottom pb-3">
                    <div>
                      <h4 className="card-title mb-1">My Learning Dashboard</h4>
                      <p className="mb-0 text-muted">
                        Overview of all your enrolled courses
                      </p>
                    </div>
                    <div>
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => setShowCharts(!showCharts)}
                      >
                        {showCharts ? (
                          <>
                            <FiEye className="me-1" /> Hide Charts
                          </>
                        ) : (
                          <>
                            <FiBarChart2 className="me-1" /> Show Charts
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    {error && (
                      <div className="alert alert-danger mb-4">{error}</div>
                    )}

                    {!error && rooms.length === 0 ? (
                      <div className="text-center py-5">
                        <FiBook className="display-4 text-muted mb-3" />
                        <h5>No Enrolled Courses</h5>
                        <p className="text-muted mb-4">
                          You haven't enrolled in any courses yet
                        </p>
                        <Link to="/courses" className="btn btn-primary">
                          Browse Available Courses
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Stats Overview */}
                        <div className="row mb-4">
                          <div className="col-md-3">
                            <div className="card bg-light-primary border-0 mb-0">
                              <div className="card-body p-3">
                                <h5 className="mb-1">Total Courses</h5>
                                <h2 className="mb-0">{stats.total}</h2>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card bg-light-info border-0 mb-0">
                              <div className="card-body p-3">
                                <h5 className="mb-1">Active</h5>
                                <h2 className="mb-0">{stats.active}</h2>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card bg-light-success border-0 mb-0">
                              <div className="card-body p-3">
                                <h5 className="mb-1">Completed</h5>
                                <h2 className="mb-0">{stats.completed}</h2>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card bg-light-warning border-0 mb-0">
                              <div className="card-body p-3">
                                <h5 className="mb-1">Avg. Progress</h5>
                                <h2 className="mb-0">
                                  {stats.averageProgress}%
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Charts Section */}
                        {showCharts && rooms.length > 0 && (
                          <div className="row mb-4">
                            {/* Course Status Distribution */}
                            <div className="col-md-6 mb-4">
                              <div className="card h-100">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    <FiPieChart className="me-2" />
                                    Course Status Distribution
                                  </h5>
                                  <div style={{ height: "300px" }}>
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <PieChart>
                                        <Pie
                                          data={statusData}
                                          cx="50%"
                                          cy="50%"
                                          labelLine={false}
                                          outerRadius={80}
                                          fill="#8884d8"
                                          dataKey="value"
                                          label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(
                                              0
                                            )}%`
                                          }
                                        >
                                          {statusData.map((entry, index) => (
                                            <Cell
                                              key={`cell-${index}`}
                                              fill={entry.color}
                                            />
                                          ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Progress by Course */}
                            <div className="col-md-6 mb-4">
                              <div className="card h-100">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    <FiAward className="me-2" />
                                    Progress by Course
                                  </h5>
                                  <div style={{ height: "300px" }}>
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <BarChart
                                        data={progressData}
                                        margin={{
                                          top: 5,
                                          right: 30,
                                          left: 20,
                                          bottom: 70,
                                        }}
                                      >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                          dataKey="name"
                                          angle={-45}
                                          textAnchor="end"
                                          tick={{ fontSize: 12 }}
                                          height={70}
                                        />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip
                                          formatter={(value) => `${value}%`}
                                        />
                                        <Legend />
                                        <Bar
                                          dataKey="progress"
                                          fill="#8884d8"
                                          name="Progress (%)"
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Courses List */}
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead>
                              <tr>
                                <th>Course Name</th>
                                <th>Status</th>
                                <th>Progress</th>
                                <th>Tutor</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rooms.map((room) => (
                                <tr key={room.id || Math.random()}>
                                  <td>
                                    <strong>{room.name || "Big Data"}</strong>
                                  </td>
                                  <td>
                                    <Badge bg={getStatusVariant(room.status)}>
                                      {room.status || "Pending"}
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="flex-grow-1 me-2">
                                        <ProgressBar
                                          now={room.progress || 0}
                                          variant={
                                            room.progress >= 100
                                              ? "success"
                                              : "primary"
                                          }
                                          className="rounded-pill"
                                          style={{ height: "6px" }}
                                        />
                                      </div>
                                      <small>{room.progress || 0}%</small>
                                    </div>
                                  </td>
                                  <td>{room.tutorName || "4"}</td>
                                  <td>{formatDate(room.startDate)}</td>
                                  <td>{formatDate(room.endDate)}</td>
                                  <td>
                                    <div className="d-flex">
                                      <Link
                                        to={`/courses/${room.id}`}
                                        className="btn btn-sm btn-primary"
                                      >
                                        <FiSettings />
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
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

export default ParticipantDashboard;
