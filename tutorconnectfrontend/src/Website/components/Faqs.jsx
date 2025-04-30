import React, { useState } from "react";
import faqs from "../assets/img/faqs.jpg"; // Import the image
import "../assets/style/faqs.css"; // Import the CSS file
// const Faqs = () => {
//     const [activeIndex, setActiveIndex] = useState(null);

//     const handleToggle = (index) => {
//         if (activeIndex === index) {
//             setActiveIndex(null); // Collapse the open section
//         } else {
//             setActiveIndex(index); // Open the clicked section
//         }
//     };

//     const faqsData = [
//         { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non." },
//         { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non." },
//         { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non." },
//         { question: "Lorem ipsum dolor sit amet?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non." }
//     ];

//     return (
//         <div className="faqs">
//             <div className="container-fluid">
//                 <div className="row align-items-center">
//                     <div className="col-md-6">
//                         <h2 className="section-title">Frequently Asked Questions</h2>
//                         <div id="accordion">
//                             {faqsData.map((faq, index) => (
//                                 <div key={index} className="card">
//                                     <div className="card-header">
//                                         <button
//                                             className="card-link"
//                                             onClick={() => handleToggle(index)}
//                                             aria-expanded={activeIndex === index ? "true" : "false"}
//                                         >
//                                             {faq.question}
//                                         </button>
//                                     </div>
//                                     <div
//                                         className={`collapse ${activeIndex === index ? "show" : ""}`}
//                                         id={`collapse${index}`}
//                                     >
//                                         <div className="card-body">
//                                             {faq.answer}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <a className="btn" href="#">Ask more</a>
//                     </div>
//                     <div className="col-md-6">
//                         <img src={faqs} alt="FAQs" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Faqs;

//version 2

const Faqs = () => {
  // const faqsData = [
  //   {
  //     question: "Question 1 text?",
  //     answer:
  //       "Answer to question 1. This text provides detailed information addressing the query.",
  //   },
  //   {
  //     question: "Question 2 text?",
  //     answer:
  //       "Answer to question 2. This text provides detailed information addressing the query.",
  //   },
  //   {
  //     question: "Question 3 text?",
  //     answer:
  //       "Answer to question 3. This text provides detailed information addressing the query.",
  //   },
  // ];

  // const [activeIndex, setActiveIndex] = useState(null);

  // const toggleAccordion = (index) => {
  //   setActiveIndex(activeIndex === index ? null : index);
  // };

  // return (
  //   <section className="faqs">
  //     <div className="container">
  //       <h2>Frequently Asked Questions</h2>
  //       <div className="faq-accordion">
  //         {faqsData.map((faq, index) => (
  //           <div
  //             className={`faq-item ${activeIndex === index ? "active" : ""}`}
  //             key={index}
  //           >
  //             <div
  //               className="faq-question"
  //               onClick={() => toggleAccordion(index)}
  //             >
  //               {faq.question}
  //               <span className="faq-icon">
  //                 {activeIndex === index ? "−" : "+"}
  //               </span>
  //             </div>
  //             <div
  //               className={`faq-answer ${activeIndex === index ? "show" : ""}`}
  //             >
  //               <p>{faq.answer}</p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //       <div className="faq-cta">
  //         <button className="btn-ask">Ask Now</button>
  //       </div>
  //     </div>
  //   </section>
  // );

  //version 3
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Show submission message after form submission
  };

  return (
    <section className="contact-form">
      <div className="container">
        <h2>Contact Us</h2>
        <div className="form-container">
          {isSubmitted ? (
            <div className="submission-message">
              <p>Thank you for reaching out! We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-submit">
                <button type="submit">Submit</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
