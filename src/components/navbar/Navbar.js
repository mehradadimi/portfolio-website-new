// Navbar.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';
import { Sun, Moon, Menu,X } from 'react-feather';
import { Link } from 'react-scroll';
import { useClickable } from '../../context/ClickableContext';


export default function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isClickable } = useClickable();
  const [ isScrolling , setIsScrolling] = useState(false);


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

    window.addEventListener('scroll', handleScrollStart);

    return () => {
      window.removeEventListener('scroll', handleScrollStart);
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling]);
  

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };


  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light'); 
    handleCloseNav();
  };

  const refreshPage = () => {
    window.location.href = '/';
  };

  const [activeItem, setActiveItem] = useState('');
  
  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  const handleCloseNav = () => {
    setIsNavOpen(false);
  };
  
  
  return (
    <div className='navbar'>
      <div className='navbar-container'>
      
        <div className='logo' onClick={refreshPage}>
           Mehrad Adimi
        </div>

        <div className='navbar-hamburger' onClick={toggleNav}>
          {isNavOpen ? <X/> : <Menu/>}
        </div>
       
        <ul className={`navbar-menu ${isNavOpen ? 'active' : ''} ${isScrolling ? 'scroll' : ''}`}>

          <li className={activeItem === 'home' ? 'active' : ''} onClick={() => handleItemClick('home')} style={{ pointerEvents: isClickable ? 'auto' : 'none' }}>
            <a href="/about">
              <Link activeClass="active"  to="landing" spy={true} smooth={true} duration={500} onClick={handleCloseNav} >// Home</Link>
            </a>
          </li>

          <li className={activeItem === 'about' ? 'active' : ''} onClick={() => handleItemClick('about')} style={{ pointerEvents: isClickable ? 'auto' : 'none' }}>
            <a href="/about">
              <Link activeClass="active"  to="about" spy={true} smooth={true} duration={500} onClick={handleCloseNav} >// Skills</Link>
            </a>
          </li>

          <li className={activeItem === 'project' ? 'active' : ''} onClick={() => handleItemClick('project')} style={{ pointerEvents: isClickable ? 'auto' : 'none' }}>
            <a href="/project">
              <Link activeClass="active"  to="projects" spy={true} smooth={true} duration={500} onClick={handleCloseNav} >// Projects</Link>
            </a>
          </li>

          <li className={activeItem === 'contactme' ? 'active' : ''} onClick={() => handleItemClick('contactme')} style={{ pointerEvents: isClickable ? 'auto' : 'none' }}>
            <a href="/contactme">
              <Link activeClass="active"  to="contactMe" spy={true} smooth={true} duration={500} onClick={handleCloseNav}>// Contact Me</Link>
            </a>
          </li>

          <li className="navbar-theme-toggle-mobile" onClick={toggleTheme}>
            {theme === 'light' ? <Sun /> : <Moon />}
          </li>
        </ul>
        
        <div onClick={toggleTheme} className="navbar-theme-toggle">
          {theme === 'light' ? <Sun /> : <Moon />}
        </div>

        </div>
    </div>
  );
}
