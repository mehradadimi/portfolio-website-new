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
    title: "NutriDine",
    imgUrl: "https://i.ibb.co/pbC2fwq/Screenshot-2024-10-25-at-9-02-36-PM.png",
    url: "https://nutridine.netlify.app",
    description: (
      <>
        <h3>NutriDine Progressive Web App</h3>
        <h4>
          <strong>Timeframe:</strong> Dec 2023 - Present
        </h4>
        <p>
          Developed a Progressive Web Application (PWA) that enables users to
          find restaurants based on meal nutrition and calorie content. Using
          React.js and TypeScript for the frontend, with Firebase as the
          Backend-as-a-Service (BaaS) to manage data and authentication.
          Integrated the NutritionX API for precise nutritional data, and built
          location-based restaurant suggestions using the Google API, allowing
          personalized recommendations based on user location and custom daily
          nutrition goals. Leveraged Firebase Firestore for secure data storage
          and integrated Firebase Authentication with options for Google,
          GitHub, and Twitter logins. Configured continuous integration and
          delivery through GitHub Actions and deployed the frontend on Netlify
          for streamlined, automated release cycles.
        </p>
        <a
          href="https://nutridine.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#000" }}
        >
          Visit NutriDine
        </a>
      </>
    ),
  },
  {
    id: 5,
    title: "PassedWords",
    imgUrl: "https://i.ibb.co/9nCG3NN/IMG-0732.jpg",
    url: "https://github.com/mehradadimi/PassedWords/",
    description: (
      <>
        <h3>PassedWords Mobile App</h3>
        <h4>
          <strong>Timeframe:</strong> Oct 2024 - Present
        </h4>
        <p>
          Developed a secure password management application using React Native
          (Expo) and the CryptoES library, implementing AES-256 encryption and
          hashing for robust data protection of sensitive passwords and notes.
          Integrated Ethereum blockchain storage via Web3 and ethers.js to
          decentralize encrypted password storage, enabling users to retain full
          ownership of their data on a secure, immutable platform. Configured
          Firebase Authentication for secure user login and profile management,
          with Firebase Firestore for encrypted data storage and access control
          to manage permissions effectively.
        </p>
        <a
          href="https://github.com/mehradadimi/PassedWords/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#000" }}
        >
          Visit PassedWords
        </a>
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
