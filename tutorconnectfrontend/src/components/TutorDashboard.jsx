// import React, { useEffect, useState } from "react";
// import axiosClient from "../api/axiosClient";
// import { Link } from "react-router-dom";
// import TutorSideBar from "../layouts/SideBars/TutorSideBar";
// import NavBar from "../layouts/NavBar";
// import {
//   FiBook,
//   FiUsers,
//   FiClock,
//   FiDollarSign,
//   FiEye,
//   FiSettings,
//   FiPlus,
//   FiAlertTriangle,
// } from "react-icons/fi";
// import { ProgressBar, Badge } from "react-bootstrap";

// const TutorRoomsDashboard = () => {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [stats, setStats] = useState({
//     active: 0,
//     expiring: 0,
//     expired: 0,
//     total: 0,
//   });

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const response = await axiosClient.get("/rooms/my-rooms");
//         setRooms(response.data || []); // Ensure we always have an array

//         // Calculate stats
//         const now = new Date();
//         const statsData = {
//           active: 0,
//           expiring: 0,
//           expired: 0,
//           total: response.data?.length || 0,
//         };

//         (response.data || []).forEach((room) => {
//           if (!room.endDate) return; // Skip if no end date

//           const daysRemaining = getDaysRemaining(room.endDate);

//           if (daysRemaining > 3) {
//             statsData.active++;
//           } else if (daysRemaining >= 1) {
//             statsData.expiring++;
//           } else {
//             statsData.expired++;
//           }
//         });

//         setStats(statsData);
//       } catch (err) {
//         setError("Failed to fetch rooms. Please try again later.");
//         console.error("Fetch rooms error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       });
//     } catch {
//       return "Invalid date";
//     }
//   };

//   const getDaysRemaining = (endDate) => {
//     if (!endDate) return -1; // Treat missing dates as expired
//     try {
//       const end = new Date(endDate);
//       const now = new Date();
//       return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
//     } catch {
//       return -1; // Treat invalid dates as expired
//     }
//   };

//   const getStatusVariant = (days) => {
//     if (days > 3) return "success";
//     if (days >= 1) return "warning";
//     return "danger";
//   };

//   const getStatusText = (days) => {
//     if (days > 3) return "Active";
//     if (days >= 1) return "Expiring Soon";
//     return "Expired";
//   };

//   if (loading) {
//     return (
//       <div
//         className="d-flex justify-content-center align-items-center"
//         style={{ minHeight: "300px" }}
//       >
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <TutorSideBar />
//       <NavBar />

//       <div className="wrapper">
//         <div className="content-page">
//           <div className="container-fluid">
//             <div className="row">
//               <div className="col-lg-12">
//                 <div className="card card-block card-stretch card-height">
//                   <div className="card-header d-flex justify-content-between align-items-center border-bottom pb-3">
//                     <div>
//                       <h4 className="card-title mb-1">Classroom Management</h4>
//                       <p className="mb-0 text-muted">
//                         Overview of all your classrooms
//                       </p>
//                     </div>
//                     <Link to="/tutor/rooms/request" className="btn btn-primary">
//                       <FiPlus className="me-1" /> New Classroom
//                     </Link>
//                   </div>
//                   <div className="card-body">
//                     {error && (
//                       <div className="alert alert-danger mb-4">
//                         <FiAlertTriangle className="me-2" />
//                         {error}
//                       </div>
//                     )}

//                     {!error && rooms.length === 0 ? (
//                       <div className="text-center py-5">
//                         <FiBook className="display-4 text-muted mb-3" />
//                         <h5>No Classrooms Found</h5>
//                         <p className="text-muted mb-4">
//                           You don't have any active classrooms yet
//                         </p>
//                         <Link
//                           to="/tutor/rooms/request"
//                           className="btn btn-primary"
//                         >
//                           <FiPlus className="me-1" /> Request Your First
//                           Classroom
//                         </Link>
//                       </div>
//                     ) : (
//                       <>
//                         {/* Stats Overview */}
//                         <div className="row mb-4">
//                           <div className="col-md-3">
//                             <div className="card bg-light-primary border-0 mb-0">
//                               <div className="card-body p-3">
//                                 <h5 className="mb-1">Total Classrooms</h5>
//                                 <h2 className="mb-0">{stats.total}</h2>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-md-3">
//                             <div className="card bg-light-success border-0 mb-0">
//                               <div className="card-body p-3">
//                                 <h5 className="mb-1">Active</h5>
//                                 <h2 className="mb-0">{stats.active}</h2>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-md-3">
//                             <div className="card bg-light-warning border-0 mb-0">
//                               <div className="card-body p-3">
//                                 <h5 className="mb-1">Expiring Soon</h5>
//                                 <h2 className="mb-0">{stats.expiring}</h2>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="col-md-3">
//                             <div className="card bg-light-danger border-0 mb-0">
//                               <div className="card-body p-3">
//                                 <h5 className="mb-1">Expired</h5>
//                                 <h2 className="mb-0">{stats.expired}</h2>
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Rooms List */}
//                         <div className="table-responsive">
//                           <table className="table table-hover mb-0">
//                             <thead>
//                               <tr>
//                                 <th>Classroom Name</th>
//                                 <th>Status</th>
//                                 <th>Students</th>
//                                 <th>Amount</th>
//                                 <th>Period</th>
//                                 <th>Time Remaining</th>
//                                 <th>Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {rooms.map((room) => {
//                                 const daysRemaining = getDaysRemaining(
//                                   room.endDate
//                                 );
//                                 const progressPercentage =
//                                   daysRemaining > 0
//                                     ? Math.min(
//                                         100,
//                                         Math.max(0, (daysRemaining / 30) * 100)
//                                       )
//                                     : 0;

//                                 return (
//                                   <tr key={room.id || Math.random()}>
//                                     <td>
//                                       <strong>
//                                         {room.name || "Unnamed Classroom"}
//                                       </strong>
//                                     </td>
//                                     <td>
//                                       <Badge
//                                         bg={getStatusVariant(daysRemaining)}
//                                       >
//                                         {getStatusText(daysRemaining)}
//                                       </Badge>
//                                     </td>
//                                     <td>
//                                       <FiUsers className="me-1 text-primary" />
//                                       {room.capacity || 0}
//                                     </td>
//                                     <td>{room.amount || 0} MAD</td>
//                                     <td>
//                                       <FiClock className="me-1 text-info" />
//                                       {formatDate(room.startDate)} -{" "}
//                                       {formatDate(room.endDate)}
//                                     </td>
//                                     <td>
//                                       <div className="d-flex align-items-center">
//                                         <div className="flex-grow-1 me-2">
//                                           <ProgressBar
//                                             now={progressPercentage}
//                                             variant={getStatusVariant(
//                                               daysRemaining
//                                             )}
//                                             className="rounded-pill"
//                                             style={{ height: "6px" }}
//                                           />
//                                         </div>
//                                         <small>
//                                           {daysRemaining > 0
//                                             ? `${daysRemaining} days`
//                                             : "Expired"}
//                                         </small>
//                                       </div>
//                                     </td>
//                                     <td>
//                                       <div className="d-flex">
//                                         <Link
//                                           to={`/tutor/rooms/${room.id}/manage`}
//                                           className="btn btn-sm btn-primary"
//                                         >
//                                           <FiSettings />
//                                         </Link>
//                                       </div>
//                                     </td>
//                                   </tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TutorRoomsDashboard;
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import TutorSideBar from "../layouts/SideBars/TutorSideBar";
import NavBar from "../layouts/NavBar";
import {
  FiBook,
  FiUsers,
  FiClock,
  FiDollarSign,
  FiEye,
  FiSettings,
  FiPlus,
  FiAlertTriangle,
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

const TutorRoomsDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    active: 0,
    expiring: 0,
    expired: 0,
    total: 0,
  });
  const [showCharts, setShowCharts] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosClient.get("/rooms/my-rooms");
        setRooms(response.data || []); // Ensure we always have an array

        // Calculate stats
        const now = new Date();
        const statsData = {
          active: 0,
          expiring: 0,
          expired: 0,
          total: response.data?.length || 0,
        };

        (response.data || []).forEach((room) => {
          if (!room.endDate) return; // Skip if no end date

          const daysRemaining = getDaysRemaining(room.endDate);

          if (daysRemaining > 3) {
            statsData.active++;
          } else if (daysRemaining >= 1) {
            statsData.expiring++;
          } else {
            statsData.expired++;
          }
        });

        setStats(statsData);
      } catch (err) {
        setError("Failed to fetch rooms. Please try again later.");
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

  const getDaysRemaining = (endDate) => {
    if (!endDate) return -1; // Treat missing dates as expired
    try {
      const end = new Date(endDate);
      const now = new Date();
      return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    } catch {
      return -1; // Treat invalid dates as expired
    }
  };

  const getStatusVariant = (days) => {
    if (days > 3) return "success";
    if (days >= 1) return "warning";
    return "danger";
  };

  const getStatusText = (days) => {
    if (days > 3) return "Active";
    if (days >= 1) return "Expiring Soon";
    return "Expired";
  };

  // Data for pie chart
  const statusData = [
    { name: "Active", value: stats.active, color: "#28a745" },
    { name: "Expiring Soon", value: stats.expiring, color: "#ffc107" },
    { name: "Expired", value: stats.expired, color: "#dc3545" },
  ];

  // Data for bar chart - classroom capacities
  const capacityData = rooms.map((room) => ({
    name: room.name || "Unnamed",
    students: room.capacity || 0,
  }));

  // Data for revenue bar chart
  const revenueData = rooms.map((room) => ({
    name: room.name || "Unnamed",
    amount: room.amount || 0,
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
      <TutorSideBar />
      <NavBar />

      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card card-block card-stretch card-height">
                  <div className="card-header d-flex justify-content-between align-items-center border-bottom pb-3">
                    <div>
                      <h4 className="card-title mb-1">Classroom Management</h4>
                      <p className="mb-0 text-muted">
                        Overview of all your classrooms
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
                      <Link
                        to="/tutor/rooms/request"
                        className="btn btn-primary"
                      >
                        <FiPlus className="me-1" /> New Classroom
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    {error && (
                      <div className="alert alert-danger mb-4">
                        <FiAlertTriangle className="me-2" />
                        {error}
                      </div>
                    )}

                    {!error && rooms.length === 0 ? (
                      <div className="text-center py-5">
                        <FiBook className="display-4 text-muted mb-3" />
                        <h5>No Classrooms Found</h5>
                        <p className="text-muted mb-4">
                          You don't have any active classrooms yet
                        </p>
                        <Link
                          to="/tutor/rooms/request"
                          className="btn btn-primary"
                        >
                          <FiPlus className="me-1" /> Request Your First
                          Classroom
                        </Link>
                      </div>
                    ) : (
                      <>
                        {/* Stats Overview */}
                        <div className="row mb-4">
                          <div className="col-md-3">
                            <div className="card bg-light-primary border-0 mb-0">
                              <div className="card-body p-3">
                                <h5 className="mb-1">Total Classrooms</h5>
                                <h2 className="mb-0">{stats.total}</h2>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card bg-light-success border-0 mb-0">
                              <div className="card-body p-3">
                                <h5 className="mb-1">Active</h5>
                                <h2 className="mb-0">{stats.active}</h2>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card bg-light-warning border-0 mb-0">
                              <div className="card-body p-3">
                                <h5 className="mb-1">Expiring Soon</h5>
                                <h2 className="mb-0">{stats.expiring}</h2>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card bg-light-danger border-0 mb-0">
                              <div className="card-body p-3">
                                <h5 className="mb-1">Expired</h5>
                                <h2 className="mb-0">{stats.expired}</h2>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Charts Section */}
                        {showCharts && rooms.length > 0 && (
                          <div className="row mb-4">
                            {/* Classroom Status Distribution */}
                            <div className="col-md-4 mb-4">
                              <div className="card h-100">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    <FiPieChart className="me-2" />
                                    Classroom Status Distribution
                                  </h5>
                                  <div
                                    className="d-flex justify-content-center align-items-center"
                                    style={{ height: "250px" }}
                                  >
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
                                      </PieChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Classroom Capacity */}
                            <div className="col-md-8 mb-4">
                              <div className="card h-100">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    <FiUsers className="me-2" />
                                    Student Capacity by Classroom
                                  </h5>
                                  <div style={{ height: "250px" }}>
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <BarChart
                                        data={capacityData}
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
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                          dataKey="students"
                                          fill="#4286f4"
                                          name="Number of Students"
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Revenue Chart */}
                            <div className="col-12">
                              <div className="card">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    Classroom Revenue (MAD)
                                  </h5>
                                  <div style={{ height: "250px" }}>
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <BarChart
                                        data={revenueData}
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
                                        <YAxis />
                                        <Tooltip
                                          formatter={(value) => `${value} MAD`}
                                        />
                                        <Legend />
                                        <Bar
                                          dataKey="amount"
                                          fill="#28a745"
                                          name="Revenue (MAD)"
                                        />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rooms List */}
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead>
                              <tr>
                                <th>Classroom Name</th>
                                <th>Status</th>
                                <th>Students</th>
                                <th>Amount</th>
                                <th>Period</th>
                                <th>Time Remaining</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rooms.map((room) => {
                                const daysRemaining = getDaysRemaining(
                                  room.endDate
                                );
                                const progressPercentage =
                                  daysRemaining > 0
                                    ? Math.min(
                                        100,
                                        Math.max(0, (daysRemaining / 30) * 100)
                                      )
                                    : 0;

                                return (
                                  <tr key={room.id || Math.random()}>
                                    <td>
                                      <strong>
                                        {room.name || "Unnamed Classroom"}
                                      </strong>
                                    </td>
                                    <td>
                                      <Badge
                                        bg={getStatusVariant(daysRemaining)}
                                      >
                                        {getStatusText(daysRemaining)}
                                      </Badge>
                                    </td>
                                    <td>
                                      <FiUsers className="me-1 text-primary" />
                                      {room.capacity || 0}
                                    </td>
                                    <td>{room.amount || 0} MAD</td>
                                    <td>
                                      <FiClock className="me-1 text-info" />
                                      {formatDate(room.startDate)} -{" "}
                                      {formatDate(room.endDate)}
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 me-2">
                                          <ProgressBar
                                            now={progressPercentage}
                                            variant={getStatusVariant(
                                              daysRemaining
                                            )}
                                            className="rounded-pill"
                                            style={{ height: "6px" }}
                                          />
                                        </div>
                                        <small>
                                          {daysRemaining > 0
                                            ? `${daysRemaining} days`
                                            : "Expired"}
                                        </small>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="d-flex">
                                        <Link
                                          to={`/tutor/rooms/${room.id}/manage`}
                                          className="btn btn-sm btn-primary"
                                        >
                                          <FiSettings />
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
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

export default TutorRoomsDashboard;
