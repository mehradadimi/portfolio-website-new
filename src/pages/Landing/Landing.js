// LandingPage.js
import React, {useState, useEffect, useRef} from 'react';
import tunnel from '../../assets/videos/tunnel.mp4'
import "./Landing.css"
import TypeIt from "typeit-react";
import { useClickable } from '../../context/ClickableContext';
import { animateScroll as scroll } from 'react-scroll';
import { motion, useAnimation, useInView } from "framer-motion";

const Landing = () => {
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    setFadeIn(true);
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 75 },
    visible: { opacity: 1, y: 0 },
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const mainConrtols = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainConrtols.start("visible");
    } else {
      mainConrtols.start("hidden");
    }
  }, [isInView]);

  const [buttonText, setButtonText] = useState("Let Me In");
  const [instance, setInstance] = useState(null);
  const [show3DText, setShow3DText] = useState(false);
  const [showButtonAndText, setShowButtonAndText] = useState(true);
  const { setIsClickable } = useClickable();

  useEffect(() => {
    document.body.classList.add("freeze-screen");
  }, []);

  const handle3DTextAnimationEnd = () => {
    setShow3DText(false); // Hide text
    handleArrowClick();
  };

  const handleArrowClick = () => {
    scroll.scrollTo(window.innerHeight, {
      duration: 1000,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  };

  const toggleFreeze = () => {
    if (instance && instance.is("frozen")) {
      // instance.unfreeze();
      setButtonText("Let Me In");
    } else if (instance) {
      // instance.freeze();
      setButtonText("You Are In");
    }

    // Remove scroll lock when button is clicked
    document.body.classList.remove("freeze-screen");
    setIsClickable(true);

    setShow3DText(true);
    setTimeout(handle3DTextAnimationEnd, 3000);
    setShowButtonAndText(false);
  };

  return (
    <div
      id="landing-page"
      name="landing"
      className={`landing ${fadeIn ? "fade-in" : ""} ${
        show3DText ? "dimmed" : ""
      }`}
    >
      {show3DText && <div className="text3D">YOU CAN SCROLL NOW</div>}
      <div className="overlay"></div>
      <video
        src={tunnel}
        autoPlay="autoplay"
        playsInLine="playsinline"
        loop="true"
        muted="true"
      ></video>
      <div className="container">
        <div className="top">
          <motion.div
            ref={ref}
            initial="hidden"
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={variants}
            animate={mainConrtols}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <TypeIt
              options={{ speed: 90, waitUntilVisible: true, loop: false }}
              getBeforeInit={(instance) => {
                instance
                  .type("Happiness is founs")
                  .pause(1000)
                  .delete(1)
                  .type("d")
                  .pause(500)
                  .type(" in ")
                  .pause(1)
                  .type("<em>doing<em>")
                  .pause(1)
                  .type(", not merelyy possessing")
                  .move(-11)
                  .delete(1)
                  .move(null, { to: "end" })
                  .type(" !<br/> - Mehrad A")
                  .pause(500)
                  .delete(8)
                  .type("Napoleon Hill");
                return instance;
              }}
              afterComplete={(instance) => {
                instance.destroy();
              }}
              getAfterInit={(instance) => {
                setInstance(instance);
                return instance;
              }}
            />
          </motion.div>
        </div>

        <div className="bottom">
          {showButtonAndText && (
            <TypeIt
              options={{ speed: 20, waitUntilVisible: true, loop: false }}
              getBeforeInit={(instance) => {
                instance
                  .type("If you want to scroll, click on the button below!")
                  .pause(750);
                return instance;
              }}
              getAfterInit={(instance) => {
                setInstance(instance);
                return instance;
              }}
            />
          )}
        </div>
        {showButtonAndText && (
          <button className="freezeButton" onClick={toggleFreeze}>
            {buttonText}
          </button>
        )}
        {!showButtonAndText && (
          <div className="landing-line-wrapper" onClick={handleArrowClick}>
            <p
              className="landing-line-text"
              style={{ fontSize: "1rem", fontWeight: "900" }}
            >
              Skills
            </p>
            <div className="landing-line-to-arrow"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
