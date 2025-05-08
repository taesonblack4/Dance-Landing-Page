import React from 'react';

const Services = React.forwardRef((props, ref) => {
  //turn this into a carosel
  //switching to focus on admin and user backboard

  const cardInfo = [
    {
      title: "Choreography",
      description: "Create and refine dance routines for performances" 
    },
    {
      title: "Movement Coaching",
      description: "Guide dancers in improving their movement quality" 
    },
    {
      title: "Private Coaching",
      description: "Offer one-on-one coaching for skill development" 
    },
    {
      title: "Performances",
      description: "Perform in various artistic and commercial settings" 
    },
    {
      title: "Arts Administration",
      description: "Manage and organize dance-related events and projects" 
    },
    {
      title: "Teaching",
      description: "Educate students on different dance styles and techniques" 
    },
    {
      title: "Workshops",
      description: "Work with students to improve their dance styles and techniques" 
    },
  ];

  
  return (
    <div ref={ref} className='services-section-container'>
      <div className='services-header'>
        <h2>Services</h2>
      </div>
      <div className='service-blocks'>
        {cardInfo.map((service, index) => (
          <div key={index} className='service-card'>
            <div className='card-content'>
              <h3 className="service-title">
                {service.title}
              </h3>
              <p className='service-description'>
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Services;
