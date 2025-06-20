import React, {useRef} from 'react';
import { useNavigate } from 'react-router-dom';

//Public Components
import ScrollToTop from '../Common/Utils/ScrollToTop';
import Navbar from './Navbar';
import Home from './Home';
import Services from './Services';
import About from './About';
import Gallery from './Gallery';
import Contact from './Contact';
import Footer from './Footer';

const LandingPage = () => {
    const navigate = useNavigate();
    // Refs for scrolling to different sections
    const servicesRef = useRef(null);
    const aboutRef = useRef(null);
    const galleryRef = useRef(null);
    const contactRef = useRef(null);

    const scrollToSection = (elementRef) => {
        if (elementRef.current) {
          window.scrollTo({
            top: elementRef.current.offsetTop,
            behavior: 'smooth',
          });
        }
      };
  
    return (
    <div>
        <ScrollToTop />
        <div className="app-container">
            <div className="hero-section-container">
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
            <Gallery ref={galleryRef} />
            <Contact ref={contactRef} />
            <Footer />
        </div>
    </div>
  )
}

const styles = {
    loginButton: {
      backgroundColor: 'blue',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer',
      borderRadius: '5px',
      marginTop: '20px'
    },
    logoutButton: {
      backgroundColor: 'red',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer',
      borderRadius: '5px',
      position: 'absolute',  // Fixed positioning for easy access
      top: '10px',
      right: '10px'
    }
  };

export default LandingPage
