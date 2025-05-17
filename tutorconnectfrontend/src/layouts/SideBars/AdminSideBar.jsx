import { useNavigate } from "react-router-dom";
import BaseSideBar from "./BaseSideBar";

const AdminSideBar = () => {
    const navigate = useNavigate();

    return (
        <BaseSideBar>
            <li className="active">
                <a href="/admin/dashboard" className="svg-icon">
                    <svg
                        className="svg-icon"
                        id="p-dash1"
                        width={20}
                        height={20}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1={12} y1="22.08" x2={12} y2={12}/>
                    </svg>
                    <span className="ml-4">Dashboards</span>
                </a>
            </li>

            <li className=" ">
                <a
                    href="#rooms"
                    className="collapsed"
                    data-toggle="collapse"
                    aria-expanded="false"
                >
                    <svg
                        className="svg-icon"
                        id="p-dash3"
                        width={20}
                        height={20}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span className="ml-4">Rooms</span>
                    <svg
                        className="svg-icon iq-arrow-right arrow-active"
                        width={20}
                        height={20}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="10 15 15 20 20 15"/>
                        <path d="M4 4h7a4 4 0 0 1 4 4v12"/>
                    </svg>
                </a>
                <ul
                    id="rooms"
                    className="iq-submenu collapse"
                    data-parent="#iq-sidebar-toggle"
                >
                    <li className="list-rooms">
                        <a onClick={() => navigate("/admin/rooms")}>
                            <i className="las la-list"/>
                            <span>List Rooms</span>
                        </a>
                    </li>
                    <li className="add-room">
                        <a onClick={() => navigate("/admin/rooms/create")}>
                            <i className="las la-plus"/>
                            <span>Add Room</span>
                        </a>
                    </li>
                </ul>
            </li>

            <li className=" ">
                <a
                    href="#demands"
                    className="collapsed"
                    data-toggle="collapse"
                    aria-expanded="false"
                >
                    <svg
                        className="svg-icon"
                        width={20}
                        height={20}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1={16} y1={13} x2={8} y2={13}/>
                        <line x1={16} y1={17} x2={8} y2={17}/>
                        <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <span className="ml-4">Tutor Demands</span>
                    <svg
                        className="svg-icon iq-arrow-right arrow-active"
                        width={20}
                        height={20}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="10 15 15 20 20 15"/>
                        <path d="M4 4h7a4 4 0 0 1 4 4v12"/>
                    </svg>
                </a>
                <ul
                    id="demands"
                    className="iq-submenu collapse"
                    data-parent="#iq-sidebar-toggle"
                >
                    <li className="list-demands">
                        <a onClick={() => navigate("/admin/demands")}>
                            <i className="las la-list"/>
                            <span>View Applications</span>
                        </a>
                    </li>
                    <li className="pending-demands">
                        <a onClick={() => navigate("/admin/demands?status=PENDING")}>
                            <i className="las la-clock"/>
                            <span>Pending Reviews</span>
                        </a>
                    </li>
                </ul>
            </li>

            <li className=" ">
                <a
                    href="#admin"
                    className="collapsed"
                    data-toggle="collapse"
                    aria-expanded="false"
                >
                    <svg
                        className="svg-icon"
                        width={20}
                        height={20}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span className="ml-4">Administration</span>
                    <svg
                        className="svg-icon iq-arrow-right arrow-active"
                        width={20}
                        height={20}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="10 15 15 20 20 15"/>
                        <path d="M4 4h7a4 4 0 0 1 4 4v12"/>
                    </svg>
                </a>
                <ul
                    id="admin"
                    className="iq-submenu collapse"
                    data-parent="#iq-sidebar-toggle"
                >
                    <li className="user-management">
                        <a onClick={() => navigate("/admin/usermanagement")}>
                            <i className="las la-user-cog"/>
                            <span>User Management</span>
                        </a>
                    </li>
                    <li className="create-user">
                        <a onClick={() => navigate("/admin/createuser")}>
                            <i className="las la-user-plus"/>
                            <span>Create User</span>
                        </a>
                    </li>
                </ul>
            </li>
        </BaseSideBar>
    );
};

export default AdminSideBar;