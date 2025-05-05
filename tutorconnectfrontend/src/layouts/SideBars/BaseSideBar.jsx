import { useNavigate } from "react-router-dom";

const BaseSideBar = ({ children }) => {
  return (
      <div>
        <div className="wrapper">
          <div className="iq-sidebar sidebar-default">
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
                  {children}
                </ul>
              </nav>
              <div className="p-3" />
            </div>
          </div>
        </div>
      </div>
  );
};

export default BaseSideBar;