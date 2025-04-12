import React from 'react';
import testimonial1 from '../assets/img/testimonial-1.jpg';
import testimonial2 from '../assets/img/testimonial-2.jpg';
import testimonial3 from '../assets/img/testimonial-3.jpg';
import testimonial4 from '../assets/img/testimonial-4.jpg';

const Testimonials = () => {
    const testimonialsData = [
        { name: 'Customer Name', profession: 'Profession', review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus.', image: testimonial1 },
        { name: 'Customer Name', profession: 'Profession', review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus.', image: testimonial2 },
        { name: 'Customer Name', profession: 'Profession', review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus.', image: testimonial3 },
        { name: 'Customer Name', profession: 'Profession', review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus.', image: testimonial4 },
    ];

    return (
        <div className="testimonial">
            <div className="container">
                <div className="section-header">
                    <h2>Clients Review</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium ornare velit non</p>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="testimonial-slider-nav">
                            {testimonialsData.map((testimonial, index) => (
                                <div key={index} className="slider-nav">
                                    <img src={testimonial.image} alt={`Testimonial ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="testimonial-slider">
                            {testimonialsData.map((testimonial, index) => (
                                <div key={index} className="slider-item">
                                    <h3>{testimonial.name}</h3>
                                    <h4>{testimonial.profession}</h4>
                                    <p>{testimonial.review}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
