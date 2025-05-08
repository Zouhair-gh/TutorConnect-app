import React, { useState } from "react";
import logo from "../assets/img/logo.png";
import "../assets/landingpagestyle/header.css";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="Tutor Connect" />
          <span className="logo-text">Tutor Connect</span>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <ul className="nav-links">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
        </nav>

        <div className="contact-button">
          <a href="/login" className="btn">
            LOGIN
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
