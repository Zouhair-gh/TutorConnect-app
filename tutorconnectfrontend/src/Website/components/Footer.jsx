import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <div className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-5">
                        <div className="footer-about">
                            <h2>About Us</h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet metus sit amet diam varius commodo. Aliquam at nisl interdum
                            </p>
                            <br />
                            <p><FontAwesomeIcon icon={faMapMarkerAlt} /> 123 Street, New York, USA</p>
                            <p><FontAwesomeIcon icon={faPhoneAlt} /> +012 345 67890</p>
                            <p><FontAwesomeIcon icon={faEnvelope} /> info@example.com</p>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="footer-link">
                                    <h2>Useful Link</h2>
                                    <a href="">About Us</a>
                                    <a href="">Our Story</a>
                                    <a href="">Our Services</a>
                                    <a href="">Our Portfolio</a>
                                    <a href="">Our Projects</a>
                                    <a href="">Contact Us</a>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="footer-link">
                                    <h2>Useful Link</h2>
                                    <a href="">Our Clients</a>
                                    <a href="">Clients Review</a>
                                    <a href="">Ongoing Customer</a>
                                    <a href="">Customer Support</a>
                                    <a href="">FAQs</a>
                                    <a href="">Site Map</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container copyright">
                <div className="row">
                    <div className="col-md-6">
                        <p>&copy; <a href="https://htmlcodex.com">HTML Codex</a>, All Right Reserved.</p>
                    </div>
                    <div className="col-md-6">
                        <p>Template By <a href="https://htmlcodex.com">HTML Codex</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
