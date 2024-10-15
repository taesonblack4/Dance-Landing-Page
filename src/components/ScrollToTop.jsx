/* supposed to show a button to scroll to the top 
after the user scrolls or click to a section */ 

import React, { useState,useEffect } from 'react';
import {FaAngleDoubleUp} from 'react-icons/fa';

const ScrollToTop = () => {
    const [scrollButton, setScrollButton] = useState(false);

    useEffect(()=> {
        window.addEventListener('scroll', () => {
            if (window.screenY > 300) {
                setScrollButton(true);
            } else {
                setScrollButton(false);
            }
        });
    }, []);

    const scrollTop = () => {
        window.scrollTo({
          top: 0,
          behavior:'smooth'
        });
    };
    
    return (
        <div>
            {scrollButton && 
            (<FaAngleDoubleUp className='top-btn-position top-btn-style' onClick={scrollTop} />)}
        </div>
    )
};

export default ScrollToTop;
