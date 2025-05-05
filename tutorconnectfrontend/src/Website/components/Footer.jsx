import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

// const Footer = () => {
//     return (
//         <div className="footer">
//             <div className="container">
//                 <div className="row">
//                     <div className="col-md-5">
//                         <div className="footer-about">
//                             <h2>About Us</h2>
//                             <p>
//                                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet metus sit amet diam varius commodo. Aliquam at nisl interdum
//                             </p>
//                             <br />
//                             <p><FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Street, New York, USA</p>
//                             <p><FontAwesomeIcon icon={faPhoneAlt} /> +012 345 67890</p>
//                             <p><FontAwesomeIcon icon={faEnvelope} /> info@example.com</p>
//                         </div>
//                     </div>
//                     <div className="col-md-7">
//                         <div className="row">
//                             <div className="col-md-6">
//                                 <div className="footer-link">
//                                     <h2>Useful Link</h2>
//                                     <a href="">About Us</a>
//                                     <a href="">Our Story</a>
//                                     <a href="">Our Services</a>
//                                     <a href="">Our Portfolio</a>
//                                     <a href="">Our Projects</a>
//                                     <a href="">Contact Us</a>
//                                 </div>
//                             </div>
//                             <div className="col-md-6">
//                                 <div className="footer-link">
//                                     <h2>Useful Link</h2>
//                                     <a href="">Our Clients</a>
//                                     <a href="">Clients Review</a>
//                                     <a href="">Ongoing Customer</a>
//                                     <a href="">Customer Support</a>
//                                     <a href="">FAQs</a>
//                                     <a href="">Site Map</a>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="container copyright">
//                 <div className="row">
//                     <div className="col-md-6">
//                         <p>&copy; <a href="https://htmlcodex.com">HTML Codex</a>, All Right Reserved.</p>
//                     </div>
//                     <div className="col-md-6">
//                         <p>Template By <a href="https://htmlcodex.com">HTML Codex</a></p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Footer;

//v2 :
import "../assets/landingpagestyle/footer.css"; // Import the CSS file
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ABOUT US</h3>
            <p>
              Tutor Connect is a leading online education platform connecting
              students with expert tutors across multiple disciplines.
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3>USEFUL LINKS</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
              <li>
                <a href="#">Courses</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Become a Tutor</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>LEGAL LINKS</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Cookie Policy</a>
              </li>
              <li>
                <a href="#">Refund Policy</a>
              </li>
              <li>
                <a href="#">Accessibility</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Tutor Connect. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
