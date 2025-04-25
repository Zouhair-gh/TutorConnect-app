import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import AdminSideBar from "../../layouts/SideBars/AdminSideBar";
import NavBar from "../../layouts/NavBar";

const DemandDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [demand, setDemand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processingAction, setProcessingAction] = useState(false);

    useEffect(() => {
        fetchDemandDetails();
    }, [id]);

    const fetchDemandDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/demands/${id}`);
            setDemand(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching demand details:", err);
            setError("Failed to load demand details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            setProcessingAction(true);
            await axiosClient.put(`/demands/${id}/status`, { status: newStatus });
            fetchDemandDetails(); // Refresh data
        } catch (err) {
            console.error("Error updating demand status:", err);
            setError("Failed to update status. Please try again.");
        } finally {
            setProcessingAction(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = {
            year: 'numeric',
            month: 'long',
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
                                            <p className="mt-2">Loading demand details...</p>
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

    if (error) {
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
                                        <div className="card-body">
                                            <div className="alert alert-danger" role="alert">
                                                {error}
                                            </div>
                                            <div className="text-center mt-4">
                                                <button
                                                    onClick={() => navigate('/admin/demands')}
                                                    className="btn btn-primary"
                                                >
                                                    Back to Demands
                                                </button>
                                            </div>
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
                        {/* Breadcrumb */}
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Subscription Demand Details</h4>
                                    <div className="page-title-right">
                                        <button
                                            onClick={() => navigate('/admin/demands')}
                                            className="btn btn-secondary"
                                        >
                                            <i className="ri-arrow-left-line me-1"></i> Back to List
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Demand #{demand?.id}</h5>
                                            <span className={getStatusBadge(demand?.status)}>
                        {demand?.status}
                      </span>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <div className="mb-4">
                                                    <h5 className="text-primary">Applicant Information</h5>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered mb-0">
                                                            <tbody>
                                                            <tr>
                                                                <th style={{ width: "35%" }}>Full Name</th>
                                                                <td>{demand?.fullName}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Email</th>
                                                                <td>{demand?.email}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Phone</th>
                                                                <td>{demand?.phone}</td>
                                                            </tr>

                                                            <tr>
                                                                <th>Experience</th>
                                                                <td>{demand?.experience}</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-4">
                                                    <h5 className="text-primary">Demand Status</h5>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered mb-0">
                                                            <tbody>
                                                            <tr>
                                                                <th style={{ width: "35%" }}>Status</th>
                                                                <td>
                                    <span className={getStatusBadge(demand?.status)}>
                                      {demand?.status}
                                    </span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>Created At</th>
                                                                <td>{formatDate(demand?.createdAt)}</td>
                                                            </tr>
                                                            <tr>
                                                                <th>Processed At</th>
                                                                <td>{demand?.processedAt ? formatDate(demand?.processedAt) : 'Not processed yet'}</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message section */}
                                        <div className="row mb-4">
                                            <div className="col-12">
                                                <h5 className="text-primary">Message</h5>
                                                <div className="card border">
                                                    <div className="card-body">
                                                        <p>{demand?.message || 'No additional message provided.'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="d-flex justify-content-end mt-4">
                                                    {demand?.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange('APPROVED')}
                                                                className="btn btn-success me-2"
                                                                disabled={processingAction}
                                                            >
                                                                {processingAction ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                                        Processing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="ri-check-line me-1"></i> Approve & Create Tutor Account
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange('REJECTED')}
                                                                className="btn btn-danger"
                                                                disabled={processingAction}
                                                            >
                                                                {processingAction ? (
                                                                    <>
                                                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                                        Processing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="ri-close-line me-1"></i> Reject
                                                                    </>
                                                                )}
                                                            </button>
                                                        </>
                                                    )}

                                                    {demand?.status !== 'PENDING' && (
                                                        <button
                                                            onClick={() => handleStatusChange('PENDING')}
                                                            className="btn btn-warning"
                                                            disabled={processingAction}
                                                        >
                                                            {processingAction ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                                    Processing...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="ri-refresh-line me-1"></i> Reset to Pending
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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

export default DemandDetail;