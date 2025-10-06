import React, { useState } from 'react';
import axios from 'axios';
import { USER_ROUTES } from '../db-urls'

//const HOST = `http://localhost:4004/basic/users/me`;

// Update happens after user logs out and logs back in or refreshes page,
// checkboxes are being displayed of that already selected


const UserForm = ({user, onCancel, onSuccess}) => { 
    //initialize with existing user data
    const [username, setUserName] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
    const [location, setLocation] = useState(user?.location ||'');
    const [age, setAge] = useState(user?.age || '');
    const [occupation, setOccupation] = useState(user?.title || []);
    const [experience, setExperience] = useState(user?.experience || '');
    const [techniques, setTechniques] = useState(user?.technique || []);



    //generic input handler for text inputs
    const handleInputChange = (e,setter) =>{
      setter(e.target.value); //update state with input value
    }

    const handleCheckboxChange = (e, setter, stateArray) => {
      const {checked, value} = e.target;
      // add/remove value from array based on checkbox state
      checked ? setter([...stateArray, value]) : setter(stateArray.filter(item => item !== value));
    }

    // adjust array if issues
    const cleanArray = (arr) => {
        return Array.isArray(arr)
          ? [...new Set(arr.map(item => item?.trim()).filter(Boolean))]
          : [];
    };

    const updateUser = async () => {
      
      const userData = {
        username,
        email,
        phone_number: phoneNumber,
        location,
        age: Number(age),
        title: cleanArray(occupation),
        experience,
        technique: cleanArray(techniques)
      }

      try {
        const token = localStorage.getItem('accessToken');
        if(!token) throw new Error('No Token');

        await axios.put(USER_ROUTES.me, userData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert('Profile has been successfully updated')
        onSuccess()//toggle back to view 
      } catch (error) {
        console.log('Submission error: ', error);
        alert('Error updating profile information')
      }
    }

    const onSubmit = (e) => {
      e.preventDefault();
      updateUser();
    }

    return (
    <>
    <form onSubmit={onSubmit}>

      {/* Username Input */}
      <div className='input-group'>
        <label>Username</label>
        <input type='text' value={username} onChange={(e) => handleInputChange(e, setUserName)}/>
      </div>

      {/* Email Input */}
      <div className='input-group'>
        <label>Email</label>
        <input type='email' value={email} onChange={(e) => handleInputChange(e, setEmail)}/>
      </div>

      {/* Phone# Input */} 
      <div className='input-group'>
        <label>Phone Number</label>
        <input type='tel' value={phoneNumber} onChange={(e) => handleInputChange(e, setPhoneNumber)}/>
      </div>

      {/* Location Input */}
      <div className='input-group'>
        <label>Location</label>
        <input type='text' value={location} onChange={(e) => handleInputChange(e, setLocation)}/>
      </div>

      {/* Age Input */}
      <div className='input-group'>
        <label>Age</label>
        <input type='number' value={age} onChange={(e) => handleInputChange(e, setAge)}/>
      </div>

      {/* Experience Select Group */}
      <div className='input-group'>
        <label>Experience</label>
        <select name="experience" id="experience" value={experience} onChange={(e) => setExperience(e.target.value)}>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Professional">Professional</option>
        </select>
      </div>

      {/* Occupation Checkbox Group */}
      <div className='checkbox-group'>
        <label>Occupation</label>
        <div className='checkbox-items'>
          {['Student', 'Instructor', 'Choreographer', 'Administrator', 'Performer'].map((title,index) => (
            <label key={index} className='checkbox-label'>
              <input type="checkbox" value={title} checked={occupation.includes(title)} onChange={(e)=> handleCheckboxChange(e, setOccupation, occupation)}/>
              {title}
            </label>
          ))}
        </div>
      </div>

      {/* Technique Checkbox Group */}
      <div className='checkbox-group'>
        <label>Technique</label>
          <div className='checkbox-items'>
            {['Hip Hop', 'Jazz', 'Modern', 'Ballet', 'Contemporary'].map((technique, index) => (
              <label key={index} className='checkbox-label'>
                <input type="checkbox" value={technique} checked={techniques.includes(technique)} onChange={(e) => handleCheckboxChange(e, setTechniques, techniques)} />
                {technique}
              </label>
            ))}
          </div>
      </div>

      <button type='submit'>Save</button>
      <button type='button' onClick={onCancel}>Cancel</button>
    </form>
    </>
  )
}

export default UserForm
