import React from "react";
import "../assets/style/services.css"; // Import the CSS file
// import icon1 from "../assets/img/icon-service-1.png";
// import icon2 from "../assets/img/icon-service-2.png";
// import icon3 from "../assets/img/icon-service-3.png";
// import icon4 from "../assets/img/icon-service-4.png";
// import icon5 from "../assets/img/icon-service-5.png";
// import icon6 from "../assets/img/icon-service-6.png";
// import icon7 from "../assets/img/icon-service-7.png";
// import icon8 from "../assets/img/icon-service-8.png";

// const Service = () => {
//     const services = [
//         { title: "Web Design", icon: icon1, description: "Lorem ipsum dolor sit amet elit pretium ornare" },
//         { title: "Development", icon: icon2, description: "Lorem ipsum dolor sit amet elit pretium ornare" },
//         { title: "UI Design", icon: icon3, description: "Lorem ipsum dolor sit amet elit pretium ornare" },
//         { title: "Programming", icon: icon4, description: "Lorem ipsum dolor sit amet elit pretium ornare" },
//         { title: "Graphic Design", icon: icon5, description: "Lorem ipsum dolor sit amet elit pretium ornare" },
//         { title: "Video Editing", icon: icon6, description: "Lorem ipsum dolor sit amet elit pretium ornare" },
//         { title: "SEO", icon: icon7, description: "Lorem ipsum dolor sit amet elit pretium ornare" },
//         { title: "Online Marketing", icon: icon8, description: "Lorem ipsum dolor sit amet elit pretium ornare" },
//     ];

//     return (
//         <div className="service">
//             <div className="container-fluid">
//                 <div className="section-header">
//                     <h2>Our Services</h2>
//                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium ornare velit non</p>
//                 </div>
//                 <div className="row">
//                     {services.map((service, index) => (
//                         <div key={index} className="col-lg-3 col-md-6">
//                             <div className="service-item">
//                                 <h3>{service.title}</h3>
//                                 <img src={service.icon} alt={service.title} />
//                                 <p>{service.description}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Service;

// version 2

import {
  FaLaptopCode,
  FaCode,
  FaServer,
  FaPalette,
  FaSearch,
  FaLayerGroup,
} from "react-icons/fa";

const Services = () => {
  const servicesData = [
    {
      icon: <FaLaptopCode />,
      title: "Web Design",
      description:
        "Learn about best practices for creating visually appealing and user-friendly websites.",
    },
    {
      icon: <FaCode />,
      title: "Development",
      description:
        "Master the latest web development frameworks and build responsive applications.",
    },
    {
      icon: <FaServer />,
      title: "Programming",
      description:
        "Enhance your coding skills with expert-led courses in various programming languages.",
    },
    {
      icon: <FaPalette />,
      title: "Graphic Design",
      description:
        "Develop creative skills to produce professional visual content and branding materials.",
    },
    {
      icon: <FaSearch />,
      title: "SEO",
      description:
        "Learn strategies to improve your website's visibility and drive organic traffic.",
    },
    {
      icon: <FaLayerGroup />,
      title: "UI Design",
      description:
        "Create intuitive user interfaces that enhance the user experience and engagement.",
    },
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="services-header">
          <h2>Our Services</h2>
          <p>
            Enhancing your skills with expert-led courses across multiple
            disciplines. Find the perfect course to meet your personal or
            professional goals.
          </p>
        </div>
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
