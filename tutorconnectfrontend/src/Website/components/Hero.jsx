import React from 'react';
import heroImage from '../assets/img/hero.png';  // Import the image

const Hero = () => {
    return (
        <div className="hero">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h2>Creative & Responsive</h2>
                        <h2><span>HTML5</span> Template</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare</p>
                        <a className="btn" href="https://htmlcodex.com/bootstrap-agency-template">Download Now</a>
                    </div>
                    <div className="col-md-6">
                        <img src={heroImage} alt="Hero" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
