import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faFile } from "@fortawesome/free-regular-svg-icons";

import "./Footer.css";

function Footer() {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScrollStart = () => {
      if (!isScrolling) setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollStop, 150);
    };

    const handleScrollStop = () => {
      setIsScrolling(false);
    };

    window.addEventListener("scroll", handleScrollStart);

    return () => {
      window.removeEventListener("scroll", handleScrollStart);
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling]);

  return (
    <footer className={`footer ${isScrolling ? "scrolled" : ""}`}>
      <a
        href="https://www.linkedin.com/in/mehradadimi2020/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faLinkedin} cursor="pointer" className="icon" />
      </a>
      <a
        href="https://github.com/mehradadimi/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faGithub} cursor="pointer" className="icon" />
      </a>
      <a
        href="mailto:mehradadimica@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faEnvelope} cursor="pointer" className="icon" />
      </a>
    </footer>
  );
}

export default Footer;
