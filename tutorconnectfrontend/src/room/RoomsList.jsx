import Footer from "../layouts/footer";
import Navbar from "../layouts/NavBar";
import SideBar from "../layouts/SideBar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

// const RoomsList = () => {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [deleteSuccess, setDeleteSuccess] = useState("");

//   useEffect(() => {
//     fetchRooms();
//   }, []);

//   const fetchRooms = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosClient.get("/rooms");
//       setRooms(response.data);
//       setError("");
//     } catch (err) {
//       setError("Failed to fetch rooms");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (roomId) => {
//     if (window.confirm("Are you sure you want to delete this room?")) {
//       try {
//         await axiosClient.delete(`/rooms/${roomId}`);
//         setDeleteSuccess("Room deleted successfully");
//         setRooms(rooms.filter((room) => room.id !== roomId));

//         setTimeout(() => {
//           setDeleteSuccess("");
//         }, 3000);
//       } catch (err) {
//         setError("Failed to delete room");
//         console.error(err);
//       }
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   if (loading) {
//     return <div className="container mt-5 text-center">Loading...</div>;
//   }

//   return (
//     <>
//       <SideBar />
//       <Navbar />
//       <div className="wrapper">
//         <div className="content-page">
//           <div className="container-fluid">
//             <div className="container p-4">
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h2>Room Management</h2>
//                 <Link to="/rooms/create" className="btn btn-primary">
//                   Create New Room
//                 </Link>
//               </div>

//               {error && <div className="alert alert-danger">{error}</div>}
//               {deleteSuccess && (
//                 <div className="alert alert-success">{deleteSuccess}</div>
//               )}

//               <div className="table-responsive">
//                 <table className="table table-striped">
//                   <thead className="table-primary">
//                     <tr>
//                       <th>ID</th>
//                       <th>Name</th>
//                       <th>Capacity</th>
//                       <th>Amount </th>
//                       <th>Start Date</th>
//                       <th>End Date</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {rooms.length > 0 ? (
//                       rooms.map((room) => (
//                         <tr key={room.id}>
//                           <td>{room.id}</td>
//                           <td>{room.name}</td>
//                           <td>{room.capacity}</td>
//                           <td>{room.amount}</td>
//                           <td>{formatDate(room.startDate)}</td>
//                           <td>{formatDate(room.endDate)}</td>
//                           <td>
//                             <Link
//                               to={`/rooms/${room.id}`}
//                               className="btn btn-sm btn-info me-2"
//                             >
//                               View
//                             </Link>
//                             <Link
//                               to={`/rooms/edit/${room.id}`}
//                               className="btn btn-sm btn-warning me-2"
//                             >
//                               Edit
//                             </Link>
//                             <button
//                               className="btn btn-sm btn-danger"
//                               onClick={() => handleDelete(room.id)}
//                             >
//                               Delete
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="7" className="text-center">
//                           No rooms found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default RoomsList;

// test 2

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/rooms");
      setRooms(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch rooms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axiosClient.delete(`/rooms/${roomId}`);
        setDeleteSuccess("Room deleted successfully");
        setRooms(rooms.filter((room) => room.id !== roomId));

        setTimeout(() => {
          setDeleteSuccess("");
        }, 3000);
      } catch (err) {
        setError("Failed to delete room");
        console.error(err);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // card background
  const getRandomColorClass = () => {
    const colors = ["primary", "success", "warning", "danger", "info"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <>
      <SideBar />
      <Navbar />
      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Room Management</h2>
                <Link to="/rooms/create" className="btn btn-primary">
                  Create New Room
                </Link>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {deleteSuccess && (
                <div className="alert alert-success">{deleteSuccess}</div>
              )}

              <div className="row">
                {rooms.length > 0 ? (
                  rooms.map((room) => {
                    const colorClass = getRandomColorClass();
                    return (
                      <div key={room.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card card-block card-stretch card-height-helf">
                          <div className="card-body card-item-right">
                            <div className="d-flex align-items-top">
                              <div
                                className={`bg-${colorClass}-light rounded p-3 me-3`}
                              >
                                <i
                                  className={`fa fa-building fa-2x text-${colorClass}`}
                                  aria-hidden="true"
                                ></i>
                              </div>
                              <div className="style-text text-left flex-grow-1">
                                <h5 className="mb-2">{room.name}</h5>
                                <p className="mb-1">
                                  Capacity: {room.capacity} people
                                </p>
                                <p className="mb-1">Amount: {room.amount}</p>
                                <p className="mb-1">
                                  Period: {formatDate(room.startDate)} -{" "}
                                  {formatDate(room.endDate)}
                                </p>
                                <div className="mt-3">
                                  <Link
                                    to={`/rooms/${room.id}`}
                                    className="btn btn-sm btn-info me-2"
                                  >
                                    <i className="fa fa-eye"></i> View
                                  </Link>
                                  <Link
                                    to={`/rooms/edit/${room.id}`}
                                    className="btn btn-sm btn-warning me-2"
                                  >
                                    <i className="fa fa-edit"></i> Edit
                                  </Link>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(room.id)}
                                  >
                                    <i className="fa fa-trash"></i> Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center">
                    <p className="text-muted">No rooms found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoomsList;
