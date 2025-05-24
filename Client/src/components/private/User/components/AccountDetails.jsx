import React, {useState, useEffect} from 'react';
import axios from 'axios';



const AccountDetails = ({user}) => {
  
  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Name: {user.full_name}</p>
      <p>Phone #: {user.phone_number}</p>
    </div>
  )
}

export default AccountDetails
