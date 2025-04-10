import React from 'react';

const Services = React.forwardRef((props, ref) => {
  const services = [
    "Choreography",
    "Movement Coaching",
    "Private Coaching",
    "Performances",
    "Arts Administration",
    "Dance Education"
  ];

  const details = [
    "Create and refine dance routines for performances.",
    "Guide dancers in improving their movement quality.",
    "Offer one-on-one coaching for skill development.",
    "Perform in various artistic and commercial settings.",
    "Manage and organize dance-related events and projects.",
    "Educate students on different dance styles and techniques."
  ];

  return (
    <div ref={ref} className='services-section-container'>
      <div className='services-header'>
        <h2>Services</h2>
      </div>
      <div className='service-blocks'>
        {services.map((service, index) => (
          <div key={index} className='service-card'>
            <div className='card-content'>
              <h4 className="service-title">
                {service}
                <span className="tooltip">{details[index]}</span>
              </h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Services;
