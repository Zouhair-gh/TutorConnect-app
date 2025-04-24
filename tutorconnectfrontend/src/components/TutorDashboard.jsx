import React from 'react';
import TutorSideBar from "../layouts/SideBars/TutorSideBar";
import NavBar from "../layouts/NavBar";


const TutorDashboard = () => {
    return (
    <>
        <TutorSideBar />
        <NavBar />

            <div className="wrapper">
                <div className="content-page">
                    <div className="container-fluid">
                        <div className="row">
                            {/* Welcome Message */}
                            <div className="col-lg-4">
                                <div className="card card-transparent card-block card-stretch card-height border-none">
                                    <div className="card-body p-0 mt-lg-2 mt-0">
                                        <h3 className="mb-3">Hi Graham, Good Morning</h3>
                                        <p className="mb-0 mr-4">Here’s an overview of your tutoring performance and activities.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Key Metrics Cards */}
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-4 card-total-sale">
                                                    <div className="icon iq-icon-box-2 bg-info-light">
                                                        <i className="ri-calendar-check-line text-info h4"></i>
                                                    </div>
                                                    <div>
                                                        <p className="mb-2">Upcoming Sessions</p>
                                                        <h4>6</h4>
                                                    </div>
                                                </div>
                                                <div className="iq-progress-bar mt-2">
                                                    <span className="bg-info iq-progress progress-1" data-percent={85}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-4">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-4 card-total-sale">
                                                    <div className="icon iq-icon-box-2 bg-danger-light">
                                                        <i className="ri-file-list-3-line text-danger h4"></i>
                                                    </div>
                                                    <div>
                                                        <p className="mb-2">Pending Assignments</p>
                                                        <h4>3</h4>
                                                    </div>
                                                </div>
                                                <div className="iq-progress-bar mt-2">
                                                    <span className="bg-danger iq-progress progress-1" data-percent={60}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 col-md-4">
                                        <div className="card card-block card-stretch card-height">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center mb-4 card-total-sale">
                                                    <div className="icon iq-icon-box-2 bg-success-light">
                                                        <i className="ri-user-smile-line text-success h4"></i>
                                                    </div>
                                                    <div>
                                                        <p className="mb-2">Active Students</p>
                                                        <h4>12</h4>
                                                    </div>
                                                </div>
                                                <div className="iq-progress-bar mt-2">
                                                    <span className="bg-success iq-progress progress-1" data-percent={75}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Session Overview Chart */}
                            <div className="col-lg-6">
                                <div className="card card-block card-stretch card-height">
                                    <div className="card-header d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">Session Overview</h4>
                                        </div>
                                        <div className="card-header-toolbar d-flex align-items-center">
                                            <div className="dropdown">
                                    <span className="dropdown-toggle dropdown-bg btn" id="sessionDropdown" data-toggle="dropdown">
                                        This Month<i className="ri-arrow-down-s-line ml-1" />
                                    </span>
                                                <div className="dropdown-menu dropdown-menu-right shadow-none" aria-labelledby="sessionDropdown">
                                                    <a className="dropdown-item" href="#">Year</a>
                                                    <a className="dropdown-item" href="#">Month</a>
                                                    <a className="dropdown-item" href="#">Week</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div id="session-chart" />
                                    </div>
                                </div>
                            </div>

                            {/* Most Active Students */}
                            <div className="col-lg-6">
                                <div className="card card-block card-stretch card-height">
                                    <div className="card-header d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">Most Active Students</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-flex justify-content-between align-items-center mb-3">
                                                <span>Sarah Johnson</span><span className="badge badge-success">12 Sessions</span>
                                            </li>
                                            <li className="d-flex justify-content-between align-items-center mb-3">
                                                <span>Mark Allen</span><span className="badge badge-info">10 Sessions</span>
                                            </li>
                                            <li className="d-flex justify-content-between align-items-center">
                                                <span>Emma Brooks</span><span className="badge badge-warning">8 Sessions</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Assignment Stats */}
                            <div className="col-lg-12">
                                <div className="card card-block card-stretch card-height">
                                    <div className="card-header d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">Assignment Completion Rate</h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="progress" style={{ height: "20px" }}>
                                            <div
                                                className="progress-bar bg-success"
                                                role="progressbar"
                                                style={{ width: "76%" }}
                                                aria-valuenow="76"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                76%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Other useful widgets can go here */}
                        </div>
                    </div>
                </div>
            </div>
    </>



    );
};
export default TutorDashboard;


