import React, {useState, useEffect} from 'react';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer'
import Landing from './pages/Landing/Landing';
import AboutPage from './pages/About/AboutPage';
import Projects from "./pages/Project/Projects";
import ContactMe from './pages/ContactMe/ContactMe';
import { motion,
    useScroll,
    useSpring } from "framer-motion";
import { useClickable } from './context/ClickableContext';
import './App.css'

const Content = () => {

  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      // Get the landing page element by its ID
      const landingPage = document.getElementById('landing-page');
  
      // Calculate the height of the landing page
      const landingPageHeight = landingPage ? landingPage.offsetHeight : 0;
  
      // Show footer when user scrolls past the landing page
      if (window.scrollY > landingPageHeight/2) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };
  
    // Add scroll event listener
    window.addEventListener('scroll', checkScroll);
  
    // Clean up function
    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);
  


  const { isClickable } = useClickable();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {isClickable && <motion.div className="progress-bar" style={{ scaleX }} />}
      <Navbar />
      <Landing />
      <AboutPage />
      <Projects />
      <ContactMe />
      {showFooter && <Footer />}
    </>
  );
};


export default Content;