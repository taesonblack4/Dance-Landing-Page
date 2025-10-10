import React from 'react'
import {InlineWidget} from 'react-calendly';
const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;

const Booking = () => {
  return (
    <div className='booking-container'>
      <h1>Book a Session</h1>
      <div className='calendly-widget'>
        <InlineWidget url={calendlyUrl} />
      </div> 
    </div>
  )
}

export default Booking
