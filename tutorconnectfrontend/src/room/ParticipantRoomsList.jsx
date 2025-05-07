import Footer from "../layouts/footer";
import Navbar from "../layouts/NavBar";
import ParticipantSidebar from "../layouts/SideBars/ParticipantSidebar";
import { Link } from "react-router-dom";

const ParticipantRoomsList = () => {
    // Hardcoded static data
    const error = null;
    const deleteSuccess = null;

    const rooms = [
        {
            id: 1,
            name: "Room A",
            capacity: 10,
            amount: 200,
            startDate: "2025-05-01",
            endDate: "2025-05-05"
        },
        {
            id: 2,
            name: "Room B",
            capacity: 5,
            amount: 150,
            startDate: "2025-06-01",
            endDate: "2025-06-05"
        }
    ];

    const colorClasses = ["primary", "success", "danger", "warning", "info"];

    // Simple static helpers
    const getRandomColorClass = (index) => colorClasses[index % colorClasses.length];

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = (roomId) => {
        alert(`Delete room with ID: ${roomId}`);
    };

    return (
        <>
            <ParticipantSidebar />
            <Navbar />
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">




                            <div className="row">
                                {rooms.length > 0 ? (
                                    rooms.map((room, index) => {
                                        const colorClass = getRandomColorClass(index);
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
                                                                    <Link to={`/participant/rooms/${room.id}/1`} className="btn btn-sm btn-info me-2">
                                                                        <i className="fa fa-eye"></i> View
                                                                    </Link>



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

export default ParticipantRoomsList;
