import React from 'react';
import { useState, useEffect } from 'react';


import Navbar from '../layouts/NavBar';
import Order from './Order';
import AdminSideBar from "../layouts/SideBars/AdminSideBar";

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
    Legend
} from 'recharts';


const DashIndex = () => {
    const [dashboardStats, setDashboardStats] = useState({
        totalParticipants: 0,
        totalTutors: 0,
        totalUsers: 0,
        totalPayments: 0,
        totalRooms: 0
    });

    const [tutors, setTutors] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState(0);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        fetch('/api/admin/dashboard-stats')
            .then(response => response.json())
            .then(data => setDashboardStats(data))
            .catch(error => console.error('Error fetching dashboard stats:', error));

        fetch('/api/admin/tutors')
            .then(response => response.json())
            .then(data => setTutors(data))
            .catch(error => console.error('Error fetching tutors:', error));

        fetch('/api/admin/participants')
            .then(response => response.json())
            .then(data => setParticipants(data))
            .catch(error => console.error('Error fetching participants:', error));

        fetch('/api/admin/rooms')
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error('Error fetching rooms:', error));

        fetch('/api/admin/payments')
            .then(response => response.json())
            .then(data => setPayments(data))
            .catch(error => console.error('Error fetching payments:', error));

        fetch('/api/admin/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const chartData = [
        { name: 'Tutors', value: dashboardStats.totalTutors },
        { name: 'Participants', value: dashboardStats.totalParticipants },
        { name: 'Rooms', value: dashboardStats.totalRooms },
        { name: 'Payments', value: dashboardStats.totalPayments },
        { name: 'Users', value: dashboardStats.totalUsers }
    ];

    const tabs = ['Tutors', 'Participants', 'Rooms', 'Payments', 'Users'];

    const getCurrentData = () => {
        switch (activeTab) {
            case 0: return tutors;
            case 1: return participants;
            case 2: return rooms;
            case 3: return payments;
            case 4: return users;
            default: return [];
        }
    };

    const renderTableHeaders = () => {
        const currentData = getCurrentData();
        if (currentData.length === 0) return <tr><th>No data</th></tr>;
        return (
            <tr>
                {Object.keys(currentData[0]).map(key => (
                    <th key={key} className="border px-4 py-2 capitalize">{key}</th>
                ))}
            </tr>
        );
    };

    const renderTableRows = () => {
        const currentData = getCurrentData();
        if (currentData.length === 0) return <tr><td colSpan="100%">No data available</td></tr>;
        return currentData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
                {Object.values(item).map((value, i) => (
                    <td key={i} className="border px-4 py-2">{value}</td>
                ))}
            </tr>
        ));
    };

    return (
        <>
            <AdminSideBar />
            <Navbar />
            <Order />
            <div style={{ display: 'flex', height: '100vh' }}>
                <AdminSideBar />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Navbar />

                    <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                        <h1>Dashboard Overview</h1>
                        {/* Your charts / tabs / tables here */}

                    </div>
                </div>
            </div>

            <div className="wrapper p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

                {/* Charts section */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    {/* PieChart */}
                    <div className="bg-white p-4 rounded shadow w-full lg:w-1/2">
                        <h2 className="text-lg font-semibold mb-2">Data Distribution (Pie)</h2>
                        <PieChart width={400} height={300}>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>

                    {/* BarChart */}
                    <div className="bg-white p-4 rounded shadow w-full lg:w-1/2">
                        <h2 className="text-lg font-semibold mb-2">Data Overview (Bar)</h2>
                        <BarChart width={400} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-4">
                    <div className="flex border-b">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`py-2 px-4 ${activeTab === index ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-50">
                        {renderTableHeaders()}
                        </thead>
                        <tbody>
                        {renderTableRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default DashIndex;
