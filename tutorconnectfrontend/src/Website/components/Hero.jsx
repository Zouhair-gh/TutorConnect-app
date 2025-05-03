import React from "react";
import heroImage from "../assets/img/hero.png"; // Import the image
import "../assets/style/hero.css"; // Import the CSS file
// const Hero = () => {
//     return (
//         <div className="hero">
//             <div className="container-fluid">
//                 <div className="row align-items-center">
//                     <div className="col-md-6">
//                         <h2>Creative & Responsive</h2>
//                         <h2><span>HTML5</span> Template</h2>
//                         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare</p>
//                         <a className="btn" href="https://htmlcodex.com/bootstrap-agency-template">Download Now</a>
//                     </div>
//                     <div className="col-md-6">
//                         <img src={heroImage} alt="Hero" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Hero;

// V2
const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Grow up your skills by online courses with Tutor Connect</h1>
          <p>
            Personalized learning experiences to help you achieve your academic
            and professional goals
          </p>
          <button className="btn-primary">Join Us</button>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Professional tutors" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
