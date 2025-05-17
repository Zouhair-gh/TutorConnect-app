import Footer from "../layouts/footer";
import Navbar from "../layouts/NavBar";
import TutorSideBar from "../layouts/SideBars/TutorSideBar"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminSideBar from "../layouts/SideBars/AdminSideBar";


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
      const response = await axiosClient.get("/rooms/all");
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
     <AdminSideBar />
      <Navbar />
      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Room Management</h2>
                <Link to="/admin/rooms/create" className="btn btn-primary">
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
                                  <Link to={`/admin/rooms/${room.id}`} className="btn btn-sm btn-info me-2">
                                    <i className="fa fa-eye"></i> View
                                  </Link>
                                  <Link to={`/admin/rooms/edit/${room.id}`} className="btn btn-sm btn-warning me-2">
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
