import { useNavigate } from "react-router-dom";
import BaseSideBar from "./BaseSideBar";
import { Link } from "react-router-dom";

const TutorSideBar = () => {
  const navigate = useNavigate();

  return (
    <BaseSideBar>
      <li className="active">
        <a
          onClick={() => navigate("/tutor/TutorDashboard")}
          className="svg-icon"
        >
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
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1={12} y1="22.08" x2={12} y2={12} />
          </svg>
          <span className="ml-4">Dashboards</span>
        </a>
      </li>

      {/* Rooms Section */}
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
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
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
            <polyline points="10 15 15 20 20 15" />
            <path d="M4 4h7a4 4 0 0 1 4 4v12" />
          </svg>
        </a>
        <ul
          id="rooms"
          className="iq-submenu collapse"
          data-parent="#iq-sidebar-toggle"
        >
          <li className="list-rooms">
            <a onClick={() => navigate("/tutor/rooms")}>
              <i className="las la-list" />
              <span>List Rooms</span>
            </a>
          </li>
          <li className="room-request">
            <a onClick={() => navigate("/tutor/rooms/request")}>
              <i className="las la-envelope-open-text" />
              <span>Room Requests</span>
            </a>
          </li>
        </ul>
      </li>

      {/* Sessions Section */}
      <li className=" ">
        <a
          href="#sessions"
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
            <rect x={9} y={9} width={13} height={13} rx={2} ry={2} />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span className="ml-4">Sessions</span>
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
            <polyline points="10 15 15 20 20 15" />
            <path d="M4 4h7a4 4 0 0 1 4 4v12" />
          </svg>
        </a>
        <ul
          id="sessions"
          className="iq-submenu collapse"
          data-parent="#iq-sidebar-toggle"
        >
          <li className="manage-sessions">
            <a onClick={() => navigate("/tutor/rooms")}>
              <i className="las la-calendar" />
              <span>Manage Sessions</span>
            </a>
          </li>
        </ul>
      </li>

      {/* Deliverables Section */}
      <li className=" ">
        <a
          href="#deliverables"
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
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <span className="ml-4">Deliverables</span>
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
            <polyline points="10 15 15 20 20 15" />
            <path d="M4 4h7a4 4 0 0 1 4 4v12" />
          </svg>
        </a>
        <ul
          id="deliverables"
          className="iq-submenu collapse"
          data-parent="#iq-sidebar-toggle"
        >
          <li className="list-deliverables">
            <a onClick={() => navigate("/tutor/rooms")}>
              <i className="las la-file-alt" />
              <span>Manage Deliverables</span>
            </a>
          </li>
        </ul>
      </li>

      {/* Participants Section */}
      <li className=" ">
        <a
          href="#participants"
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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span className="ml-4">Participants</span>
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
            <polyline points="10 15 15 20 20 15" />
            <path d="M4 4h7a4 4 0 0 1 4 4v12" />
          </svg>
        </a>
        <ul
          id="participants"
          className="iq-submenu collapse"
          data-parent="#iq-sidebar-toggle"
        >
          <li className="manage-participants">
            <a onClick={() => navigate("/tutor/rooms")}>
              <i className="las la-users" />
              <span>Manage Participants</span>
            </a>
          </li>
        </ul>
      </li>

      {/* Tickets Section */}
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
            <path d="M3 3h18v18H3z" />
            <path d="M8 8h8v8H8z" />
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
            <polyline points="10 15 15 20 20 15" />
            <path d="M4 4h7a4 4 0 0 1 4 4v12" />
          </svg>
        </a>
        <ul
          id="tickets"
          className="iq-submenu collapse"
          data-parent="#iq-sidebar-toggle"
        >
          <li className="list-tickets">
            <a onClick={() => navigate("/tutor/tickets")}>
              <i className="las la-list" />
              <span>List Tickets</span>
            </a>
          </li>
          <li className="create-ticket">
            <a onClick={() => navigate("/tutor/tickets/create")}>
              <i className="las la-plus" />
              <span>Create Ticket</span>
            </a>
          </li>
        </ul>
      </li>

      {/* Messages Section */}
      <li className=" ">
        <a
          href="#messages"
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span className="ml-4">Messages</span>
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
            <polyline points="10 15 15 20 20 15" />
            <path d="M4 4h7a4 4 0 0 1 4 4v12" />
          </svg>
        </a>
        <ul
          id="messages"
          className="iq-submenu collapse"
          data-parent="#iq-sidebar-toggle"
        >
          <li className="direct-messages">
            <a onClick={() => navigate("/tutor/messages")}>
              <i className="las la-comments" />
              <span>Direct Messages</span>
            </a>
          </li>
        </ul>
      </li>
    </BaseSideBar>
  );
};

export default TutorSideBar;
