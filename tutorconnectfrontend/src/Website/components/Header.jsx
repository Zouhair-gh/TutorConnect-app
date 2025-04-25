import React from "react";
import logo from "../assets/img/logo.png";

export default function Header() {
    return (
        <div className="header">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-lg-2">
                        <div className="brand">
                            <a href="/">
                                <img src={logo} alt="Logo" />
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-10">
                        <div className="topbar">
                            <div className="topbar-col">
                                <a href="tel:+01234567890">
                                    <i className="fa fa-phone-alt"></i>+012 345 67890
                                </a>
                            </div>
                            <div className="topbar-col">
                                <a href="mailto:info@example.com">
                                    <i className="fa fa-envelope"></i>info@example.com
                                </a>
                            </div>
                            <div className="topbar-col">
                                <div className="topbar-social">
                                    <a href="#"><i className="fab fa-twitter"></i></a>
                                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                                    <a href="#"><i className="fab fa-youtube"></i></a>
                                    <a href="#"><i className="fab fa-instagram"></i></a>
                                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                                </div>
                            </div>
                        </div>
                        <nav className="navbar navbar-expand-lg bg-light navbar-light">
                            <a href="#" className="navbar-brand">MENU</a>
                            <button
                                type="button"
                                className="navbar-toggler"
                                data-toggle="collapse"
                                data-target="#navbarCollapse"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                                <div className="navbar-nav ml-auto">
                                    <a href="/" className="nav-item nav-link active">Home</a>
                                    <a href="/about" className="nav-item nav-link">About Us</a>
                                    <a href="/services" className="nav-item nav-link">Services</a>
                                    <a href="/portfolio" className="nav-item nav-link">Portfolio</a>
                                    <a href="/single" className="nav-item nav-link">Single Page</a>
                                    <a href="/join-as-tutor" className="nav-item nav-link">Become a Tutor</a>
                                    <a href="/login" className="btn">
                                        <i className="fa fa-user"></i>Login
                                    </a>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}