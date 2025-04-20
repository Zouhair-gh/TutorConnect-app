import React from 'react';
import SideBar from './SideBar';
import NavBar from './NavBar';
import Footer from './footer';

const DashboardLayout = ({ children, role }) => {

    return (
        <div className="dashboard-layout">
            <SideBar role={role} />
            <div className="main-content">
                <NavBar role={role} />
                <div className="content-wrapper">
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    );
};


export default DashboardLayout;
