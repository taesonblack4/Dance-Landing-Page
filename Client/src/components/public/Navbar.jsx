import React from 'react';



const Navbar = ({ scrollToSection, servicesRef, aboutRef, galleryRef, contactRef }) => {
    return (
      <div className="navbar-container">
        <div>
          <h1>Vibes By Valentine</h1>
        </div>
        <nav className='link-container'>
          <ul>
            <li onClick={() => scrollToSection(servicesRef)} className="Link">Services</li>
            <li onClick={() => scrollToSection(aboutRef)} className="Link">About Me</li>
            <li onClick={() => scrollToSection(galleryRef)} className="Link">Gallery</li>
            <li onClick={() => scrollToSection(contactRef)} className="Link">Contact</li>
          </ul>
        </nav>
      </div>
    
    );
  };

export default Navbar;
