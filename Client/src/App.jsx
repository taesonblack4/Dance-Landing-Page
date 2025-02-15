import { useState,useRef } from 'react';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import './styles/App.css';

function App() {

  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const galleryRef = useRef(null);
  const contactRef = useRef(null);
  

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior:'smooth'
    });
  };
//home is supposed to house the navbar component ideally 
  return (
    <>
      <ScrollToTop />
      <div className='app-container'>
        <div className='hero-section-container'>
          <Navbar 
                scrollToSection={scrollToSection} 
                servicesRef={servicesRef} 
                aboutRef={aboutRef}
                galleryRef={galleryRef}
                contactRef={contactRef} 
          />
          <Home /> 
        </div>
        <Services ref={servicesRef} />
        <About ref={aboutRef} />
        <Gallery ref={galleryRef}/>
        <Contact ref={contactRef} />
        <Footer />
      </div>
    </>
  );
};

export default App;
