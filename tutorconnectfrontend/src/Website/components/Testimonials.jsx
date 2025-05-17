import { useState, useEffect, useRef } from "react";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Web Developer",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "Tutor Connect completely transformed my learning experience. The instructors are highly knowledgeable and the course content is exceptionally well-structured. I was able to land my dream job after completing their web development course!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "UI/UX Designer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "I've tried many online learning platforms, but Tutor Connect stands out with their personalized approach. The one-on-one sessions with my mentor helped me understand complex design principles and apply them effectively in my projects.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "Digital Marketer",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "The SEO course offered by Tutor Connect was exactly what I needed to boost my career. The practical examples and case studies made it easy to understand and implement strategies. My website's traffic has increased by 200% since then!",
      rating: 4
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true);
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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextTestimonial();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, isAnimating]);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToTestimonial = (index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const renderStars = (rating) => {
    return Array(5)
        .fill()
        .map((_, index) => (
            <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
          ★
        </span>
        ));
  };

  return (
      <section className="testimonials" ref={sectionRef}>
        <div className="container">
          <div className={`testimonials-header ${isVisible ? "visible" : ""}`}>
            <span className="section-subtitle">Testimonials</span>
            <h2 className="section-title">What Our Students Say</h2>
            <p className="testimonials-description">
              Discover how Tutor Connect has helped students achieve their goals and
              transform their careers through personalized learning experiences.
            </p>
          </div>

          <div className={`testimonials-slider ${isVisible ? "visible" : ""}`}>
            <div className="testimonials-carousel">
              {testimonials.map((testimonial, index) => (
                  <div
                      key={testimonial.id}
                      className={`testimonial-card ${
                          index === activeIndex ? "active" : ""
                      }`}
                  >
                    <div className="quote-icon">❝</div>
                    <p className="testimonial-text">{testimonial.text}</p>
                    <div className="testimonial-rating">
                      {renderStars(testimonial.rating)}
                    </div>
                    <div className="testimonial-profile">
                      <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="testimonial-image"
                      />
                      <div className="testimonial-info">
                        <h4 className="testimonial-name">{testimonial.name}</h4>
                        <p className="testimonial-position">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            <div className="carousel-controls">
              <button className="prev-btn" onClick={prevTestimonial}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className="carousel-dots">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
                        onClick={() => goToTestimonial(index)}
                    />
                ))}
              </div>
              <button className="next-btn" onClick={nextTestimonial}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
  );
};

export default Testimonials;
