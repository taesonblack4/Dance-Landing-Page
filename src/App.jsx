import { useState,useRef } from 'react';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App() {

  const services = useRef(null);
  const about = useRef(null);
  const contact = useRef(null);

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior:'smooth'
    });
  };

  return (
    <>
    <ScrollToTop />
    <div className='hero'>
      <nav>
        <ul>
          <li onClick={() => scrollToSection(services)} className='Link'>Services</li>
          <li onClick={() => scrollToSection(about)} className='Link'>About Me</li>
          <li onClick={() => scrollToSection(contact)} className='Link'>Contact</li>
        </ul>
      </nav>
    </div>
    <div ref={services} className='services'>
      <h3>Services</h3>
    </div>
    <div ref={about} className='about'>
      <h3>About Me</h3>
    </div>
    <div ref={contact} className='contact'>
      <h3>Contact Me</h3>
    </div>
    </>
  );
};

export default App;
