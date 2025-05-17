import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  FaLaptopCode,
  FaCode,
  FaServer,
  FaPalette,
  FaSearch,
  FaLayerGroup,
} from "react-icons/fa";

const Services = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  const servicesData = [
    {
      icon: <FaLaptopCode />,
      title: "Web Design",
      description:
          "Learn about best practices for creating visually appealing and user-friendly websites that engage visitors.",
      color: "#4e73df",
    },
    {
      icon: <FaCode />,
      title: "Development",
      description:
          "Master the latest web development frameworks and build responsive applications that work on any device.",
      color: "#36b9cc",
    },
    {
      icon: <FaServer />,
      title: "Programming",
      description:
          "Enhance your coding skills with expert-led courses in various programming languages and problem-solving techniques.",
      color: "#1cc88a",
    },
    {
      icon: <FaPalette />,
      title: "Graphic Design",
      description:
          "Develop creative skills to produce professional visual content and branding materials that stand out.",
      color: "#f6c23e",
    },
    {
      icon: <FaSearch />,
      title: "SEO",
      description:
          "Learn strategies to improve your website's visibility and drive organic traffic through search engine optimization.",
      color: "#e74a3b",
    },
    {
      icon: <FaLayerGroup />,
      title: "UI Design",
      description:
          "Create intuitive user interfaces that enhance the user experience and engagement for web and mobile applications.",
      color: "#6f42c1",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const timer = setTimeout(() => {
              setVisibleCards(Array(servicesData.length).fill(true));
            }, 200);
            return () => clearTimeout(timer);
          }
        },
        { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [servicesData.length]);

  return (
      <section className="services" id="services" ref={sectionRef}>
        <div className="container">
          <div className="services-header">
            <span className="section-subtitle">What We Offer</span>
            <h2 className="section-title">Our Popular Courses</h2>
            <p className="services-description">
              Enhancing your skills with expert-led courses across multiple
              disciplines. Find the perfect course to meet your personal or
              professional goals.
            </p>
          </div>
          <div className="services-grid">
            {servicesData.map((service, index) => (
                <div
                    className={`service-card ${visibleCards[index] ? "visible" : ""}`}
                    key={index}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="service-icon" style={{ backgroundColor: `${service.color}20`, color: service.color }}>
                    {service.icon}
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a href="#" className="service-link">Learn More <i className="fas fa-arrow-right"></i></a>
                </div>
            ))}
          </div>
          <div className="services-cta">
            <a href="#contact" className="btn-primary">Explore All Courses</a>
          </div>
        </div>
      </section>
  );
};

export default Services;
