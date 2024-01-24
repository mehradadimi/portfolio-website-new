import React, { useState, useEffect, useRef } from "react";
import "./Projects.css";
import { motion, useInView, useAnimation } from "framer-motion";

const cardData = [
  {
    id: 1,
    title: "UVic Scheduler",
    imgUrl: "https://i.ibb.co/vv39pLM/Browser.png",
    description: (
      <>
        <h3>UVic Scheduler Web App, University of Victoria</h3>
        <h4>
          <strong>Timeframe:</strong> May 2023 - Sep 2023
        </h4>
        <p>
          Key front-end developer in the UVic Scheduler Web App, a course
          scheduling tool. Used React TypeScript to develop the Front-end and
          Django for the Back-End. Implemented CI/CD pipeline with GitHub
          Actions and deployed with GitHub Pages. ALso, contributed to the Agile
          development processes and practiced Agile Methodology.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "ProteinPursuit",
    imgUrl: "https://i.ibb.co/G9r8npT/Group-67.png",
    description: (
      <>
        <h3>ProteinPursuit Mobile App</h3>
        <h4>
          <strong>Timeframe:</strong> Dec 2023 - Present
        </h4>
        <p>
          Integral role in the development of ProteinPursuit, a user-centric
          mobile application that helps individuals find nearby restaurants
          based on the nutrition and calorie of the meal they want. Using NestJS
          for the back-end functionality, handling all aspects of APIs,
          databases, and class management. The mobile application, designed for
          both Android and iOS platforms, is being developed using React Native
          and seamlessly integrated with the back-end APIs. Key features include
          application dockerization for efficient deployment, comprehensive
          version control, and CI/CD managed through GitHub Actions and GitHub
          Pages.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: "Whisp",
    imgUrl: "https://i.ibb.co/nQKF6QD/Group-1882frame.png",
    description: (
      <>
        <h3>Wisp Mobile App</h3>
        <h4>
          <strong>Timeframe:</strong> Jan 2024 - Present
        </h4>
        <p>
          Key role in the development of Wisp, a user-centric mobile application
          that helps students post anonymously on this platform and share their
          concerns/confessions. Using NestJS for the back-end functionality,
          handling all aspects of APIs, databases, and class management. The
          mobile application, designed for both Android and iOS platforms, is
          being developed using React Native and seamlessly integrated with the
          back-end APIs.
        </p>
      </>
    ),
  },
  {
    id: 4,
    title: "SEQ-Bio",
    imgUrl: "https://i.ibb.co/3CBhXBX/Screenshot-2024-01-22-at-9-22-37-AM.png",
    description: (
      <>
        <h3>Rust Bio to SEQ</h3>
        <h4>
          <strong>Timeframe:</strong> Sep 2023 - Dec 2023
        </h4>
        <p>
          Key role in creating 'rust-bio-seq-public', a dynamic and powerful
          toolkit with algorithms and data structures specifically crafted for
          the complex world of bioinformatics. Our toolbox includes string
          matching solutions like BNDM and BOM, making DNA and protein sequence
          analysis a breeze. It's also packed with tools for sequence alignment
          and suffix tree construction, like the PSSM and Ukkonen's Algorithm.
          Plus, there's a trove of data structures – think Bit Trees and Wavelet
          Matrices – all designed for handling those tricky bioinformatics
          challenges. And, for the icing on the cake, we've added utilities for
          Hidden Markov Models and PSSMs, turning complex sequence data into
          something a bit more manageable.
        </p>
      </>
    ),
  },
];

const Projects = () => {
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

  const [selectedId, setSelectedId] = useState(null);
  const containerRefs = useRef([]);

  useEffect(() => {
    // Function to handle outside click
    const handleClickOutside = (event) => {
      if (selectedId !== null && containerRefs.current[selectedId]) {
        if (!containerRefs.current[selectedId].contains(event.target)) {
          setSelectedId(null);
        }
      }
    };

    // Add event listener
    if (selectedId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedId]);

  const handleClick = (card) => {
    setSelectedId(selectedId === card ? null : card);
  };

  return (
    <div className="projects" name="projects">
      <div className="layout-cards">
        {cardData.map((card) => (
          <motion.div
            className={selectedId === card.id ? "opened-card" : "closed-card"}
            key={card.id}
            layout
            onClick={() => handleClick(card.id)}
            ref={(el) => (containerRefs.current[card.id] = el)}
            transition={{ duration: 1, type: "tween" }}
          >
            {selectedId === card.id ? (
              <div className="project-card-description">{card.description}</div>
            ) : (
              <>
                <div className="grid-card-title">{card.title}</div>{" "}
                <img
                  src={card.imgUrl}
                  alt={`Project ${card.id}`}
                  className="card-image"
                />
              </>
            )}
          </motion.div>
        ))}
        <motion.div
          className="dim-layer"
          animate={{ opacity: selectedId ? 0.3 : 0 }}
        />
      </div>
    </div>
  );
};

export default Projects;
