import React, { useState } from 'react';
import axios from 'axios';



const UserForm = () => { 
  
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [age, setAge] = useState();

    return (
    <>
    
    <form action="">
      <div>
        <label>Username</label>
        <input type='text' />
      </div>
      
      <div>
        <label>Email</label>
        <input type='email' />
      </div>
        
      <div>
        <label>Phone Number</label>
        <input type='tel' />
      </div>
      
      <div>
        <label>Location</label>
        <input type='text' />
      </div>
       
      <div>
        <label>Age</label>
        <input type='number' />
      </div>
      
      <div>
        <label>Occupation</label>
        <select name="" id="">
          <option value=""></option>
          <option value=""></option>
          <option value=""></option>
        </select>
      </div>
      
      <div>
        <label>Technique</label>
        <input type='checkbox' />
        <input type='checkbox' />
        <input type='checkbox' />
        <input type='checkbox' />
        <input type='checkbox' />
      </div>
    </form>
    </>
  )
}

export default UserForm
