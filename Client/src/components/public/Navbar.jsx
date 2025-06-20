import { useNavigate } from "react-router-dom";

const Navbar = ({ scrollToSection, servicesRef, aboutRef, galleryRef, contactRef }) => {
  const navigate = useNavigate();

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
          <li><a onClick={() => navigate('/login-hub')} className="Link">Login</a></li>
          <li><a onClick={() => navigate('/signup')} className="Link">SignUp</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
