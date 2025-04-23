import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SideBar from "../layouts/SideBar";
import Navbar from "../layouts/NavBar";
import Footer from "../layouts/footer";
import axiosClient from "../api/axiosClient";

const RoomView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/rooms/${id}`);
        setRoom(response.data);
      } catch (err) {
        setError("Failed to fetch room details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axiosClient.delete(`/rooms/${id}`);
        navigate("/rooms", { state: { message: "Room deleted successfully" } });
      } catch (err) {
        setError("Failed to delete room");
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <>
        <SideBar />
        <Navbar />
        <div className="wrapper">
          <div className="content-page">
            <div className="container-fluid">
              <div className="container p-4">
                <div className="alert alert-danger">{error}</div>
                <Link to="/rooms" className="btn btn-primary">
                  Back to Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!room) {
    return (
      <>
        <SideBar />
        <Navbar />
        <div className="wrapper">
          <div className="content-page">
            <div className="container-fluid">
              <div className="container p-4">
                <div className="alert alert-warning">Room not found</div>
                <Link to="/rooms" className="btn btn-primary">
                  Back to Rooms
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate days between start and end dates
  const startDate = new Date(room.startDate);
  const endDate = new Date(room.endDate);
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return (
    <>
      <SideBar />
      <Navbar />
      <div className="wrapper">
        <div className="content-page">
          <div className="container-fluid">
            <div className="container p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Room Details</h2>
                <div>
                  <Link to="/rooms" className="btn btn-secondary me-2">
                    Back to Rooms
                  </Link>
                  <Link
                    to={`/rooms/edit/${id}`}
                    className="btn btn-warning me-2"
                  >
                    Edit
                  </Link>
                  <button onClick={handleDelete} className="btn btn-danger">
                    Delete
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h4 className="mb-0">{room.name}</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Basic Information</h5>
                      <div className="table-responsive">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <th>ID:</th>
                              <td>{room.id}</td>
                            </tr>
                            <tr>
                              <th>Name:</th>
                              <td>{room.name}</td>
                            </tr>
                            <tr>
                              <th>Capacity:</th>
                              <td>{room.capacity} people</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h5>Reservation Details</h5>
                      <div className="table-responsive">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <th>Start Date:</th>
                              <td>{formatDate(room.startDate)}</td>
                            </tr>
                            <tr>
                              <th>End Date:</th>
                              <td>{formatDate(room.endDate)}</td>
                            </tr>
                            <tr>
                              <th>Duration on days :</th>
                              <td>{diffDays} </td>
                            </tr>
                            <tr>
                              <th>Amount:</th>
                              <td>{room.amount}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoomView;
