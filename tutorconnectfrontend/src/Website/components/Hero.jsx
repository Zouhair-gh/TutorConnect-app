import React from "react";
import { useState, useEffect } from 'react';
import heroImage from "../assets/img/hero.png";
import "../assets/landingpagestyle/hero.css";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
      <section className="hero">
        <div className="container">
          <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
            <h1>Grow Your Skills With <span className="highlight">Tutor Connect</span></h1>
            <p>
              Personalized learning experiences designed to help you achieve your academic
              and professional goals with expert guidance at every step
            </p>
            <div className="hero-buttons">
              <a href="#contact" className="btn-secondary">Become a Tutor</a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Expert Tutors</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Courses</span>
              </div>
            </div>
          </div>
          <div className={`hero-image ${isVisible ? 'visible' : ''}`}>
            <img src={heroImage} alt="Professional tutors" />
            <div className="shape-1"></div>
            <div className="shape-2"></div>
          </div>
        </div>
      </section>
  );
};

export default Hero;
