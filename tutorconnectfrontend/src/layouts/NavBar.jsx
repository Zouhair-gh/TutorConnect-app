import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../api/AuthService';
import NotificationComponent from '../components/Notification/NotificationComponent';
import { useAuth } from '../api/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get current user from auth context

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/login');
        }
    };

    return (
        <>
            <div className="iq-top-navbar">
                <div className="iq-navbar-custom">
                    <nav className="navbar navbar-expand-lg navbar-light p-0">
                        <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
                            <i className="ri-menu-line wrapper-menu" />
                            <a href="../backend/index.html" className="header-logo">
                                <img src="../assets/images/logo.png" className="img-fluid rounded-normal" alt="logo" />
                                <h5 className="logo-title ml-3">POSDash</h5>
                            </a>
                        </div>
                        <div className="iq-search-bar device-search">
                            <form action="#" className="searchbox">
                                <a className="search-link" href="#"><i className="ri-search-line" /></a>
                                <input type="text" className="text search-input" placeholder="Search here..." />
                            </form>
                        </div>
                        <div className="d-flex align-items-center">
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-label="Toggle navigation">
                                <i className="ri-menu-3-line" />
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav ml-auto navbar-list align-items-center">
                                    {/* Language dropdown - unchanged */}
                                    <li className="nav-item nav-icon dropdown">
                                        <a href="#" className="search-toggle dropdown-toggle btn border add-btn" id="dropdownMenuButton02" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src="../assets/images/small/flag-01.png" alt="img-flag" className="img-fluid image-flag mr-2" />En
                                        </a>
                                        <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                            {/* Language options - unchanged */}
                                        </div>
                                    </li>

                                    {/* Add Notification Component Here */}

                                        <li className="nav-item nav-icon">
                                            <NotificationComponent />
                                        </li>


                                    {/* User profile dropdown */}
                                    <li className="nav-item nav-icon dropdown caption-content">
                                        <a href="#" className="search-toggle dropdown-toggle" id="dropdownMenuButton4" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img src="../assets/images/user/1.png" className="img-fluid rounded" alt="user" />
                                        </a>
                                        <div className="iq-sub-dropdown dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <div className="card shadow-none m-0">
                                                <div className="card-body p-0 text-center">
                                                    <div className="media-body profile-detail text-center">
                                                        <img src="../assets/images/page-img/profile-bg.jpg" alt="profile-bg" className="rounded-top img-fluid mb-4" />
                                                        <img src="../assets/images/user/1.png" alt="profile-img" className="rounded profile-img img-fluid avatar-70" />
                                                    </div>
                                                    <div className="p-3">
                                                        <h5 className="mb-1">{currentUser?.email || 'User'}</h5>
                                                        <p className="mb-0">Since {new Date().toLocaleDateString()}</p>
                                                        <div className="d-flex align-items-center justify-content-center mt-3">
                                                            <a href="../app/user-profile.html" className="btn border mr-2">Profile</a>
                                                            <button onClick={handleLogout} className="btn border">Sign Out</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Navbar;