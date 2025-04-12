import React, { useState } from 'react';
import faqs from '../assets/img/faqs.jpg'; // Import the image

const Faqs = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null); // Collapse the open section
        } else {
            setActiveIndex(index); // Open the clicked section
        }
    };

    const faqsData = [
        { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non." },
        { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non." },
        { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non." },
        { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non." }
    ];

    return (
        <div className="faqs">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <div id="accordion">
                            {faqsData.map((faq, index) => (
                                <div key={index} className="card">
                                    <div className="card-header">
                                        <button
                                            className="card-link"
                                            onClick={() => handleToggle(index)}
                                            aria-expanded={activeIndex === index ? "true" : "false"}
                                        >
                                            {faq.question}
                                        </button>
                                    </div>
                                    <div
                                        className={`collapse ${activeIndex === index ? "show" : ""}`}
                                        id={`collapse${index}`}
                                    >
                                        <div className="card-body">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <a className="btn" href="#">Ask more</a>
                    </div>
                    <div className="col-md-6">
                        <img src={faqs} alt="FAQs" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faqs;
