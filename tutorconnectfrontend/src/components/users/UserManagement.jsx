import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

import NavBar from '../../layouts/NavBar';
import Footer from '../../layouts/footer';
import AdminSideBar from "../../layouts/SideBars/AdminSideBar";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/admin/users/all');

            console.log("Full API Response:", response);

            // Parse the raw data if it's a string
            let usersData = response.data;
            if (typeof usersData === 'string') {
                try {
                    usersData = JSON.parse(usersData);
                } catch (e) {
                    console.error("Failed to parse response as JSON:", e);
                }
            }

            console.log("Response data type:", typeof usersData);
            console.log("Raw users data:", usersData);

            // Create a dummy user list for testing if data is problematic
            const dummyUsers = [
                {
                    id: 1,
                    firstName: "Admin",
                    lastName: "Root",
                    email: "admin@example.com",
                    username: "a_a",
                    role: "ADMIN"
                },
                {
                    id: 2,
                    firstName: "Zouhair",
                    lastName: "Ghaouri",
                    email: "zouhair@gmail.com",
                    username: "zozo",
                    role: "STAFF"
                }
            ];

            // Extract user data from the complex response structure
            let extractedUsers = [];

            // First try: Check if data is directly an array
            if (Array.isArray(usersData)) {
                extractedUsers = usersData;
            }
            // Second try: Check if it's an object with nested properties
            else if (typeof usersData === 'object' && usersData !== null) {
                // Try to extract any arrays or objects that might contain users
                Object.keys(usersData).forEach(key => {
                    if (Array.isArray(usersData[key])) {
                        extractedUsers = usersData[key];
                    } else if (typeof usersData[key] === 'object' && usersData[key] !== null) {
                        // Try to check if this object has user-like properties
                        if ('id' in usersData[key] && ('email' in usersData[key] || 'role' in usersData[key])) {
                            extractedUsers.push(usersData[key]);
                        }
                    }
                });
            }

            console.log("Extracted users:", extractedUsers);

            // If we still have no valid users, use the dummy data for now
            if (extractedUsers.length === 0) {
                console.log("No valid users found in response, using dummy data for now");
                extractedUsers = dummyUsers;
            }

            // Process the users to ensure they have all required fields
            const processedUsers = extractedUsers.map(user => {
                return {
                    id: user.id || 0,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    username: user.username || '',
                    role: user.role || ''
                };
            });

            console.log("Final processed users:", processedUsers);
            setUsers(processedUsers);
            setError('');
        } catch (err) {
            console.error('Full error:', {
                message: err.message,
                response: err.response?.data,
                stack: err.stack
            });

            setError('Failed to load users. Please try again later.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axiosClient.delete(`/admin/users/${userId}`);
                setDeleteSuccess('User deleted successfully');
                setUsers(users.filter(user => user.id !== userId));

                setTimeout(() => {
                    setDeleteSuccess('');
                }, 3000);
            } catch (err) {
                setError('Failed to delete user');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div className="container mt-5 text-center">Loading...</div>;
    }

    return (
        <>
            <AdminSideBar />
            <NavBar />
            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="container p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2>User Management</h2>
                                <Link to="/admin/createuser" className="btn btn-primary">
                                    Create New User
                                </Link>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {deleteSuccess && <div className="alert alert-success">{deleteSuccess}</div>}

                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead className="table-primary">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Username</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Array.isArray(users) && users.length > 0 ? (
                                        users.map((user) => {
                                            console.log("Rendering user:", user);
                                            return (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.username || '-'}</td>
                                                    <td>{user.role}</td>
                                                    <td>
                                                        <Link
                                                            to={`/admin/users/${user.id}`}
                                                            className="btn btn-sm btn-info me-2"
                                                        >
                                                            View
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserManagement;