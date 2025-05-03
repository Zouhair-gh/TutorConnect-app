import { useNavigate } from "react-router-dom";
import BaseSideBar from "./BaseSideBar";
import { Link } from "react-router-dom";

const TutorSideBar = () => {
    const navigate = useNavigate();

    return (
        <BaseSideBar>
            <li className="active">
                <a href="" className="svg-icon">
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
                        <path
                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1={12} y1="22.08" x2={12} y2={12}/>
                    </svg>
                    <span className="ml-4">Dashboards</span>
                </a>
            </li>

            <li className=" ">
                <a
                    href=""
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
                        <rect x={9} y={9} width={13} height={13} rx={2} ry={2}/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    <span className="ml-4">My Session</span>
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
            </li>

            <li className=" ">
                <a
                    href="#tickets"
                    className="collapsed"
                    data-toggle="collapse"
                    aria-expanded="false"
                >
                    <svg
                        className="svg-icon"
                        id="p-dash5"
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
                        <path d="M3 3h18v18H3z"/>
                        <path d="M8 8h8v8H8z"/>
                    </svg>
                    <span className="ml-4">Tickets</span>
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
                    id="tickets"
                    className="iq-submenu collapse"
                    data-parent="#iq-sidebar-toggle"
                >
                    <li className="list-tickets">
                        <a onClick={() => navigate("/tutor/tickets")}>
                            <i className="las la-list"/>
                            <span>List Tickets</span>
                        </a>
                    </li>
                    <li className="create-ticket">
                        <a onClick={() => navigate("/tutor/tickets/create")}>
                            <i className="las la-plus"/>
                            <span>Create Ticket</span>
                        </a>
                    </li>
                </ul>
            </li>


            <li className=" ">
                <a
                    href=""
                    className="collapsed"
                    data-toggle="collapse"
                    aria-expanded="false"
                >
                    <svg
                        className="svg-icon"
                        id="p-dash4"
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
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                        <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                    </svg>
                    <span className="ml-4">My Students</span>
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
            </li>

            <li className=" ">
                <a
                    href=""
                    className="collapsed"
                    data-toggle="collapse"
                    aria-expanded="false"
                >
                    <svg
                        className="svg-icon"
                        id="p-dash4"
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
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
                        <path d="M22 12A10 10 0 0 0 12 2v10z"/>
                    </svg>
                    <span className="ml-4">Direct messages</span>
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
                        <a onClick={() => navigate("/tutor/rooms")}>
                            <i className="las la-list"/>
                            <span>List Rooms</span>
                        </a>
                    </li>

                    <li className="add-room">
                        <a onClick={() => navigate("/rooms/create")}>
                            <i className="las la-plus"/>
                            <span>Add Room</span>
                        </a>
                    </li>
                </ul>
            </li>
            <li className="room-request">
                <a onClick={() => navigate("/tutor/rooms/request")}>
                    <i className="las la-envelope-open-text"/>
                    <span>Room Requests</span>
                </a>
            </li>

        </BaseSideBar>
    );
};

export default TutorSideBar;