import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';


import AdminSideBar from "../../layouts/SideBars/AdminSideBar";
import NavBar from '../../layouts/NavBar';
import Footer from '../../layouts/footer';


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
            const response = await axiosClient.get('/admin/users');
            setUsers(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
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
                                    {users.length > 0 ? (
                                        users.map((user) => (
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
                                        ))
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