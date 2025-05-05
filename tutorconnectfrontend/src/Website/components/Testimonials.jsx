import React, { useEffect, useState } from "react";
import testimonial1 from "../assets/img/testimonial-1.jpg";
import testimonial2 from "../assets/img/testimonial-2.jpg";
import testimonial3 from "../assets/img/testimonial-3.jpg";
import testimonial4 from "../assets/img/testimonial-4.jpg";

// const Testimonials = () => {
//     const testimonialsData = [
//         { name: 'Customer Name', profession: 'Profession', review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus.', image: testimonial1 },
//         { name: 'Customer Name', profession: 'Profession', review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus.', image: testimonial2 },
//         { name: 'Customer Name', profession: 'Profession', review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus.', image: testimonial3 },
//         { name: 'Customer Name', profession: 'Profession', review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus.', image: testimonial4 },
//     ];

//     return (
//         <div className="testimonial">
//             <div className="container">
//                 <div className="section-header">
//                     <h2>Clients Review</h2>
//                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium ornare velit non</p>
//                 </div>
//                 <div className="row">
//                     <div className="col-12">
//                         <div className="testimonial-slider-nav">
//                             {testimonialsData.map((testimonial, index) => (
//                                 <div key={index} className="slider-nav">
//                                     <img src={testimonial.image} alt={`Testimonial ${index + 1}`} />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-12">
//                         <div className="testimonial-slider">
//                             {testimonialsData.map((testimonial, index) => (
//                                 <div key={index} className="slider-item">
//                                     <h3>{testimonial.name}</h3>
//                                     <h4>{testimonial.profession}</h4>
//                                     <p>{testimonial.review}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Testimonials;

//version 2 :
import "../assets/landingpagestyle/testimonial.css"; // Import the CSS file
const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Web Development Student",
      image: testimonial1,
      text: "Tutor Connect has transformed my career path. The web development course was comprehensive and the instructor support was exceptional.",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Graphic Design Professional",
      image: testimonial2,
      text: "I've taken several design courses and the quality of instruction is consistently outstanding. The platform is intuitive and engaging.",
    },
    {
      id: 3,
      name: "Jessica Williams",
      role: "SEO Specialist",
      image: testimonial3,
      text: "The SEO course provided practical knowledge that I immediately applied to my work. My clients are seeing real results thanks to what I learned.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="testimonials">
      <div className="container">
        <h2>What Our Students Say</h2>

        <div className="testimonial-container">
          <div className="testimonial-image">
            <img
              src={testimonials[currentSlide].image}
              alt="Students learning together"
            />
          </div>

          <div className="testimonial-slider">
            {testimonials.map((testimonial, index) => (
              <div
                className={`testimonial-slide ${
                  currentSlide === index ? "active" : ""
                }`}
                key={testimonial.id}
              >
                <div className="testimonial-content">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-image">
                      <img src={testimonial.image} alt={testimonial.name} />
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentSlide === index ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
