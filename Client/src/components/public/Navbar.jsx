const Navbar = ({ scrollToSection, servicesRef, aboutRef, galleryRef, contactRef }) => {
  return (
    <div className="navbar-container">
      <div>
        <h1>Rhythmic Alchemy</h1>
      </div>

      <nav className='link-container'>
        <ul>
          <li><a onClick={() => scrollToSection(servicesRef)} className="Link">Services</a></li>
          <li><a onClick={() => scrollToSection(aboutRef)} className="Link">About Me</a></li>
          <li><a onClick={() => scrollToSection(galleryRef)} className="Link">Gallery</a></li>
          <li><a onClick={() => scrollToSection(contactRef)} className="Link">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
