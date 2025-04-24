import { useNavigate } from "react-router-dom";

const SideBar = ({ role }) => {
  const navigate = useNavigate();

  return (
    <div>
      &lt;&gt;
      <div className="wrapper">
        <div className="iq-sidebar  sidebar-default ">
          <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
            <a href="../backend/index.html" className="header-logo">
              <img
                src="../assets/images/logo.png"
                className="img-fluid rounded-normal light-logo"
                alt="logo"
              />
              <h5 className="logo-title light-logo ml-3">POSDash</h5>
            </a>
            <div className="iq-menu-bt-sidebar ml-0">
              <i className="las la-bars wrapper-menu" />
            </div>
          </div>

          <div className="data-scrollbar" data-scroll={1}>
            <nav className="iq-sidebar-menu">
              <ul id="iq-sidebar-toggle" className="iq-menu">
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
                {/* ADMIN NON FONCTIONNEL  */}
                {/* {role === "admin" && ( */}
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
                      <a onClick={() => navigate("/rooms")}>
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

                {/* Admin Section */}
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
                {/* )} */}
                {role === "tutor" && (
                    <>
                      {/* session info*/}
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
                            <rect
                                x={9}
                                y={9}
                                width={13}
                                height={13}
                                rx={2}
                                ry={2}
                            />
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

                      {/* students info*/}
                      <li className=" ">
                        <a
                            href="   "
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

                      {/* dms info*/}
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

                      {/* classes info*/}
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
                          <span className="ml-4">My classes</span>
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
                            id=""
                            className="iq-submenu collapse"
                            data-parent="#iq-sidebar-toggle"
                        >
                          <li className>
                            <a href="">
                              <i className="las la-minus"/>
                              <span>Customers</span>
                            </a>
                          </li>
                          <li className>
                            <a href="">
                              <i className="las la-minus"/>
                              <span>Add Customers</span>
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
                              id="p-dash8"
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
                            <circle cx={9} cy={7} r={4}/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                          <span className="ml-4">My claaes</span>
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
                            id="people"
                            className="iq-submenu collapse"
                            data-parent="#iq-sidebar-toggle"
                        >
                          <li className>
                            <a href="">
                              <i className="las la-minus"/>
                              <span>Classe 1</span>
                            </a>
                          </li>
                          <li className>
                            <a href="">
                              <i className="las la-minus"/>
                              <span> Classe 2</span>
                            </a>
                          </li>
                          <li className>
                            <a href="">
                              <i className="las la-minus"/>
                              <span>Classe 3</span>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </>
                )}
              </ul>
            </nav>
            <div className="p-3"/>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SideBar;
