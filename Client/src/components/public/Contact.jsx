import React from 'react'


const ClientForm = () => {
    return (
        <div className='form-container'>
            <form>
                <label htmlFor="name">Full Name</label>
                <input type='text' id='name' placeholder='Firstname Lastname' />

                <label htmlFor="email">Email</label>
                <input type='email' id='email' placeholder='email@example.com'/>

                <label htmlFor="cell">Phone Number</label>
                <input type='tel' id='cell' placeholder='(xxx)-xxx-xxxxx'/>

                <label htmlFor="service-type">Services</label>
                <div className='service-checkbox-container'>
                    <label htmlFor="service-type">
                        <input type='checkbox' />
                        Choreography
                    </label>
                    <label htmlFor="service-type">
                        <input type='checkbox' />
                        Movement Coaching
                    </label>
                    <label htmlFor="service-type">
                        <input type='checkbox' />
                        Performances
                    </label>
                    <label htmlFor="service-type">
                        <input type='checkbox' />
                        Arts Administration
                    </label>
                    <label htmlFor="service-type">
                        <input type='checkbox' />
                        Dance Education
                    </label>
                    <label htmlFor="service-type">
                        <input type='checkbox' />
                        Other - please specify in message box
                    </label>
                </div>

                <label htmlFor="dance-style">Dance Style</label>
                <div className='dance-checkbox-container'>
                    <label htmlFor="dance-style">
                        <input type='checkbox' />
                        Hip Hop
                    </label>
                    <label htmlFor="dance-style">
                        <input type='checkbox' />
                        Jazz
                    </label>
                    <label htmlFor="dance-style">
                        <input type='checkbox' />
                        Modern
                    </label>
                    <label htmlFor="dance-style">
                        <input type='checkbox' />
                        Ballet
                    </label>
                </div>



                <label htmlFor="message">Message</label>
                <textarea type='text' id='message' placeholder='Tell me more about you'/>

                <input type='submit' />
            </form>
        </div>
    )
}

const Contact = React.forwardRef((props, ref) => {
  return (
    
     <div ref={ref} className='contact-section-container'>
        <h3>Contact Me</h3>
        <ClientForm />
    </div>
    
  )
});

export default Contact
