import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axiosClient from '../../api/axiosClient';
import AdminSideBar from "../../layouts/SideBars/AdminSideBar";
import NavBar from "../../layouts/NavBar";

const DemandsList = () => {
    const [demands, setDemands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState('PENDING');
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
            console.error('Error fetching demands:', err);
            setError('Failed to load subscription demands. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axiosClient.put(`/demands/${id}/status`, { status: newStatus });
            // Refresh the list
            fetchDemands();
        } catch (err) {
            console.error('Error updating demand status:', err);
            setError('Failed to update status. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    const filteredDemands = demands.filter(demand =>
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
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-2">Loading subscription demands...</p>
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
                                        <h4 className="card-title">Tutor Subscription Demands</h4>
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Search demands..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{ width: '250px', display: 'inline-block' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        {/* Status tabs */}
                                        <ul className="nav nav-tabs nav-tabs-custom mb-3">
                                            <li className="nav-item">
                                                <a
                                                    className={`nav-link ${activeTab === 'PENDING' ? 'active' : ''}`}
                                                    onClick={() => setActiveTab('PENDING')}
                                                    role="button"
                                                >
                                                    <span className="d-none d-sm-block">Pending</span>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className={`nav-link ${activeTab === 'APPROVED' ? 'active' : ''}`}
                                                    onClick={() => setActiveTab('APPROVED')}
                                                    role="button"
                                                >
                                                    <span className="d-none d-sm-block">Approved</span>
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className={`nav-link ${activeTab === 'REJECTED' ? 'active' : ''}`}
                                                    onClick={() => setActiveTab('REJECTED')}
                                                    role="button"
                                                >
                                                    <span className="d-none d-sm-block">Rejected</span>
                                                </a>
                                            </li>
                                        </ul>

                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        {filteredDemands.length === 0 ? (
                                            <div className="text-center py-5">
                                                <div className="mb-4">
                                                    <i className="ri-user-add-line text-muted" style={{ fontSize: '48px' }}></i>
                                                </div>
                                                <h5 className="mb-2">No demands found</h5>
                                                <p className="text-muted mb-4">
                                                    {searchTerm
                                                        ? "No subscription demands match your search criteria"
                                                        : `You don't have any ${activeTab.toLowerCase()} subscription demands`}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead>
                                                    <tr>
                                                        <th>ID</th>
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
                                                            <td>{demand.fullName}</td>
                                                            <td>{demand.email}</td>
                                                            <td>{demand.purpose}</td>
                                                            <td>
                                  <span className={getStatusBadge(demand.status)}>
                                    {demand.status}
                                  </span>
                                                            </td>
                                                            <td>{formatDate(demand.createdAt)}</td>
                                                            <td>
                                                                <div className="d-flex">
                                                                    {/* Detail view button */}
                                                                    <button
                                                                        onClick={() => navigate(`/admin/demands/${demand.id}`)}
                                                                        className="btn btn-sm btn-outline-primary me-2"
                                                                    >
                                                                        <i className="ri-eye-line"></i>
                                                                    </button>

                                                                    {/* Action buttons based on current status */}
                                                                    {activeTab === 'PENDING' && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => handleStatusChange(demand.id, 'APPROVED')}
                                                                                className="btn btn-sm btn-outline-success me-2"
                                                                                title="Approve"
                                                                            >
                                                                                <i className="ri-check-line"></i>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleStatusChange(demand.id, 'REJECTED')}
                                                                                className="btn btn-sm btn-outline-danger"
                                                                                title="Reject"
                                                                            >
                                                                                <i className="ri-close-line"></i>
                                                                            </button>
                                                                        </>
                                                                    )}

                                                                    {activeTab !== 'PENDING' && (
                                                                        <button
                                                                            onClick={() => handleStatusChange(demand.id, 'PENDING')}
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