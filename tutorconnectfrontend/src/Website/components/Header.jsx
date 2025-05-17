import { useState, useEffect } from "react";
import logo from "../assets/img/logo.png";
import "../assets/landingpagestyle/header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
      <header className={`header ${isScrolled ? "scrolled" : ""}`} id="home">
        <div className="container">
          <div className="logo">
            <span className="logo-text">Tutor Connect</span>
          </div>

          <div className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <ul className="nav-links">
              <li>
                <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
              </li>
              <li>
                <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
              </li>
              <li>
                <a href="#about" onClick={() => setIsMenuOpen(false)}>About Us</a>
              </li>
              <li>
                <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact Us</a>
              </li>
            </ul>
          </nav>

          <div className="auth-buttons">
            <a href="/login" className="login-btn">Log In</a>
          </div>
        </div>
      </header>
  );
};

export default Header;
