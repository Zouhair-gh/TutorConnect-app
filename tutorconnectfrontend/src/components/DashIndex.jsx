import React, { useState, useEffect } from 'react';
import Navbar from '../layouts/NavBar';
import Footer from '../layouts/footer';
import AdminSideBar from "../layouts/SideBars/AdminSideBar";
import axiosClient from '../api/axiosClient';
import { LineChart, BarChart, PieChart, Bar, Line, Pie, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const DashIndex = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTutors: 0,
        totalParticipants: 0,
        totalRooms: 0,
        totalPayments: 0
    });
    const [loading, setLoading] = useState(true);

    //this code is wayyy importzant! i have added it so we can refresh dashboard every 30 seconds to ensure that anlytics are always updated!
 /*   useEffect(() => {
        const interval = setInterval(fetchDashboardStats, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []); */

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await axiosClient.get('/admin/dashboard-stats');
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const pieData = [
        { name: 'Tutors', value: stats.totalTutors, fill: '#ff6384' },
        { name: 'Participants', value: stats.totalParticipants, fill: '#36a2eb' }
    ];

    const barData = [
        { name: 'Users', value: stats.totalUsers, fill: '#4bc0c0' },
        { name: 'Tutors', value: stats.totalTutors, fill: '#ff6384' },
        { name: 'Participants', value: stats.totalParticipants, fill: '#36a2eb' },
        { name: 'Rooms', value: stats.totalRooms, fill: '#ffcd56' },
        { name: 'Payments', value: stats.totalPayments, fill: '#9966ff' }
    ];

    return (
        <>
            <AdminSideBar />
            <Navbar />

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="card card-transparent card-block card-stretch card-height border-none">
                                    <div className="card-body p-0 mt-lg-2 mt-0">
                                        <h3 className="mb-3">Welcome to TutorConnect Dashboard</h3>
                                        <p className="mb-0 mr-4">Your dashboard gives you views of key performance metrics and platform activity.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-4 card-total-sale">
                                                    <div className="icon iq-icon-box-2 bg-info-light">
                                                        <img src="../assets/images/product/1.png" className="img-fluid" alt="image" />
                                                    </div>
                                                    <div>
                                                        <p className="mb-2">Total Users</p>
                                                        <h4>{stats.totalUsers}</h4>
                                                    </div>
                                                </div>
                                                <div className="iq-progress-bar mt-2">
                                                    <span className="bg-info iq-progress progress-1" data-percent={85}>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-4 card-total-sale">
                                                    <div className="icon iq-icon-box-2 bg-danger-light">
                                                        <img src="../assets/images/product/2.png" className="img-fluid" alt="image" />
                                                    </div>
                                                    <div>
                                                        <p className="mb-2">Total Tutors</p>
                                                        <h4>{stats.totalTutors}</h4>
                                                    </div>
                                                </div>
                                                <div className="iq-progress-bar mt-2">
                                                    <span className="bg-danger iq-progress progress-1" data-percent={70}>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-4 card-total-sale">
                                                    <div className="icon iq-icon-box-2 bg-success-light">
                                                        <img src="../assets/images/product/3.png" className="img-fluid" alt="image" />
                                                    </div>
                                                    <div>
                                                        <p className="mb-2">Total Participants</p>
                                                        <h4>{stats.totalParticipants}</h4>
                                                    </div>
                                                </div>
                                                <div className="iq-progress-bar mt-2">
                                                    <span className="bg-success iq-progress progress-1" data-percent={75}>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Charts */}
                            <div className="col-lg-6">
                                <div className="card card-block card-stretch card-height">
                                    <div className="card-header d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">User Distribution</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div style={{ width: '100%', height: 300 }}>
                                            <PieChart width={400} height={300}>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                />
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="card card-block card-stretch card-height">
                                    <div className="card-header d-flex align-items-center justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">Platform Statistics</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div style={{ width: '100%', height: 300 }}>
                                            <BarChart width={500} height={300} data={barData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="value" />
                                            </BarChart>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Stats */}
                            <div className="col-lg-8">
                                <div className="card card-block card-stretch card-height">
                                    <div className="card-header d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">Platform Overview</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th>Metric</th>
                                                    <th>Value</th>
                                                    <th>Status</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>Users</td>
                                                    <td>{stats.totalUsers}</td>
                                                    <td>
                                                        <div className="badge bg-success">Active</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Tutors</td>
                                                    <td>{stats.totalTutors}</td>
                                                    <td>
                                                        <div className="badge bg-info">Growing</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Participants</td>
                                                    <td>{stats.totalParticipants}</td>
                                                    <td>
                                                        <div className="badge bg-warning">Stable</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Rooms</td>
                                                    <td>{stats.totalRooms}</td>
                                                    <td>
                                                        <div className="badge bg-primary">Active</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Payments</td>
                                                    <td>{stats.totalPayments}</td>
                                                    <td>
                                                        <div className="badge bg-success">Processing</div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card card-block card-stretch card-height-helf">
                                    <div className="card-body">
                                        <div className="d-flex align-items-top justify-content-between">
                                            <div>
                                                <p className="mb-0">Rooms</p>
                                                <h5>{stats.totalRooms}</h5>
                                            </div>
                                            <div className="card-header-toolbar d-flex align-items-center">
                                                <span className="text-primary">
                                                    <i className="ri-arrow-up-line"></i> Active
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card card-block card-stretch card-height-helf">
                                    <div className="card-body">
                                        <div className="d-flex align-items-top justify-content-between">
                                            <div>
                                                <p className="mb-0">Payments</p>
                                                <h5>{stats.totalPayments}</h5>
                                            </div>
                                            <div className="card-header-toolbar d-flex align-items-center">
                                                <span className="text-success">
                                                    <i className="ri-arrow-up-line"></i> Processing
                                                </span>
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
}

export default DashIndex;