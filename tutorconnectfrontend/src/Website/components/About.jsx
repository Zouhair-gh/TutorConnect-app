import React, { useEffect } from 'react';

const About = () => {

    useEffect(() => {
        // Simulate the DOMContentLoaded functionality
        const youtubePlayers = document.getElementsByClassName("youtube-player");
        Array.from(youtubePlayers).forEach(player => {
            const div = document.createElement("div");
            div.setAttribute("data-id", player.dataset.id);
            div.innerHTML = labnolThumb(player.dataset.id);
            div.onclick = labnolIframe;
            player.appendChild(div);
        });

        function labnolThumb(id) {
            const thumb = '<img src="img/poster.jpg" alt="Video Thumbnail">',
                play = '<div class="play"></div>';
            return thumb.replace("ID", id) + play;
        }

        function labnolIframe() {
            const iframe = document.createElement("iframe");
            const embed = `https://www.youtube.com/embed/${this.dataset.id}?autoplay=1`;
            iframe.setAttribute("src", embed);
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "1");
            this.parentNode.replaceChild(iframe, this);
        }

    }, []);

    return (
        <div className="about">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <div id="video-section">
                            <div className="youtube-player" data-id="jssO8-5qmag"></div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h2 className="section-title">Learn About Us</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus. Aenean consectetur convallis porttitor. Aliquam interdum at lacus non blandit.
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec pretium mi. Curabitur facilisis ornare velit non vulputate. Aliquam metus tortor, auctor id gravida condimentum, viverra quis sem. Curabitur non nisl nec nisi scelerisque maximus. Aenean consectetur convallis porttitor. Aliquam interdum at lacus non blandit.
                        </p>
                        <a className="btn" href="">Learn More</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
