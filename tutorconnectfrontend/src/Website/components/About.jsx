import React, { useEffect } from "react";
import "../assets/landingpagestyle/about.css"; // Import the CSS file


const About = () => {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-content">
          <h2>LEARN ABOUT US</h2>
          <p>
            Tutor Connect offers a wide range of online courses designed to help
            students master new skills in various fields. Our educational
            platform connects learners with qualified tutors in real-time,
            creating a personalized learning experience. Whether you're looking
            to develop career-oriented technical skills or personal enrichment,
            our expert instructors are here to guide you. With flexible
            scheduling and affordable pricing, we make quality education
            accessible to everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
