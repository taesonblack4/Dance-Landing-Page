import React from 'react'

const Services = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className='services-section-container'>
        <div>
            <h3>Services</h3>
        </div>
        <div>
          <p>Choreography</p>
        </div>
    </div>
  )
});

export default Services
