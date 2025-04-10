import React from 'react';
import { FaInstagram } from 'react-icons/fa'; // Import Instagram icon from react-icons

const Footer = () => {
  return (
    <div className='footer-section-container'>
      <p>footer section</p>
      
      {/* Instagram Button with Logo */}
      <a href="https://www.instagram.com/i.am.minahv?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
         target="_blank" 
         rel="noopener noreferrer"
         className="instagram-btn">
        <FaInstagram className="instagram-icon" />
      </a>
    </div>
  );
}

export default Footer;
