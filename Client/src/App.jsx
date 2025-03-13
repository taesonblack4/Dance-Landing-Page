// Import React hooks and utilities
import { useState, useEffect, useRef } from 'react';

// Import public components
import ScrollToTop from './components/public/ScrollToTop';
import Navbar from './components/public/Navbar';
import Home from './components/public/Home';
import Services from './components/public/Services';
import About from './components/public/About';
import Contact from './components/public/Contact';
import Gallery from './components/public/Gallery';
import Footer from './components/public/Footer';

// Import private (admin) components
import Dashboard from './components/private/Dashboard';
import Login from './components/private/Login';

// Import global styles
import './styles/App.css';

function App() {
  // State management for admin authentication status
  const [isAdmin, setIsAdmin] = useState(false);
  // State to control login modal visibility
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Refs for scrolling to different sections
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const galleryRef = useRef(null);
  const contactRef = useRef(null);

  // Effect to persist admin session across page refreshes
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus === "true") {
      setIsAdmin(true);
    }
  }, []); // Empty dependency array runs only on mount

  // Smooth scroll functionality for navigation
  const scrollToSection = (elementRef) => {
    if (elementRef.current) {
      window.scrollTo({
        top: elementRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Logout handler clears authentication
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
  };

  // Main component rendering logic
  return (
    <>
      {/* Conditional rendering based on auth status */}
      {isAdmin ? (
        // Admin dashboard view
        <>
          <Dashboard />
          <button onClick={handleLogout} style={styles.logoutButton}>
            Log Out
          </button>
        </>
      ) : isLoggingIn ? (
        // Login form view
        <Login 
          onLogin={() => {
            setIsAdmin(true);
            setIsLoggingIn(false);
          }} 
          onCancel={() => setIsLoggingIn(false)} 
        />
      ) : (
        // Public-facing website view
        <>
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
            {/* Section components with refs for scrolling */}
            <Services ref={servicesRef} />
            <About ref={aboutRef} />
            <Gallery ref={galleryRef} />
            <Contact ref={contactRef} />
            <Footer />

            {/* Admin login trigger */}
            <div className="admin-login-container">
              <button 
                onClick={() => setIsLoggingIn(true)} 
                style={styles.loginButton}
              >
                Admin Login
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// Inline styles for buttons
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

export default App;