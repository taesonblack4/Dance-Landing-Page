import React from 'react'

const About = React.forwardRef((props, ref) => {
  return (
  <div ref={ref} className='about-section-container'>
      <h3>About Me</h3>
  </div>
  )
});

export default About
