import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_ROUTES } from '../db-urls'



//const HOST = `http://localhost:4004/basic/users/me`;

// Update happens after user logs out and logs back in or refreshes page,
// checkboxes are being displayed of that already selected


const UserForm = ({user, onCancel, onSuccess}) => { 
  
  // Initialize with existing user data - use useEffect to handle prop changes
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phoneNumber: user?.phone_number || '',
    location: user?.location || '',
    age: user?.age || '',
    occupation: Array.isArray(user?.title) ? user.title : [],
    experience: user?.experience || '',
    techniques: Array.isArray(user?.technique) ? user.technique : [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
        location: user.location || '',
        age: user.age || '',
        occupation: Array.isArray(user.title) ? user.title : [],
        experience: user.experience || '',
        techniques: Array.isArray(user.technique) ? user.technique : [],
      });
    }
  }, [user]);

  // Generic input handler for text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleCheckboxChange = (e, field) => {
    const { checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value] 
        : prev[field].filter(item => item !== value)
    }));
  }

  const cleanArray = (arr) => {
    return Array.isArray(arr)
      ? [...new Set(arr.map(item => item?.trim()).filter(Boolean))]
      : [];
  };

  // Submit updated user data
  const updateUser = async () => {
    const userData = {
      username: formData.username,
      email: formData.email,
      phone_number: formData.phoneNumber,
      location: formData.location,
      age: Number(formData.age),
      title: cleanArray(formData.occupation),
      experience: formData.experience,
      technique: cleanArray(formData.techniques)
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No authentication token found');

      await axios.put(USER_ROUTES.me, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return true;
    } catch (error) {
      console.error('Update error: ', error);
      let errorMessage = 'Error updating profile information';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      throw error;
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateUser();
      alert('Profile has been successfully updated');
      
      // Let the parent component handle the success flow
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      // Error already handled in updateUser
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Username Input */}
      <div className='input-group'>
        <label>Username</label>
        <input 
          type='text' 
          name="username"
          value={formData.username} 
          onChange={handleInputChange}
        />
      </div>

      {/* Email Input */}
      <div className='input-group'>
        <label>Email</label>
        <input 
          type='email' 
          name="email"
          value={formData.email} 
          onChange={handleInputChange}
        />
      </div>

      {/* Phone# Input */} 
      <div className='input-group'>
        <label>Phone Number</label>
        <input 
          type='tel' 
          name="phoneNumber"
          value={formData.phoneNumber} 
          onChange={handleInputChange}
        />
      </div>

      {/* Location Input */}
      <div className='input-group'>
        <label>Location</label>
        <input 
          type='text' 
          name="location"
          value={formData.location} 
          onChange={handleInputChange}
        />
      </div>

      {/* Age Input */}
      <div className='input-group'>
        <label>Age</label>
        <input 
          type='number' 
          name="age"
          value={formData.age} 
          onChange={handleInputChange}
        />
      </div>

      {/* Experience Select Group */}
      <div className='input-group'>
        <label>Experience</label>
        <select 
          name="experience" 
          value={formData.experience} 
          onChange={handleInputChange}
        >
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
          {['Student', 'Instructor', 'Choreographer', 'Administrator', 'Performer'].map((title, index) => (
            <label key={index} className='checkbox-label'>
              <input 
                type="checkbox" 
                value={title} 
                checked={formData.occupation.includes(title)} 
                onChange={(e) => handleCheckboxChange(e, 'occupation')}
              />
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
              <input 
                type="checkbox" 
                value={technique} 
                checked={formData.techniques.includes(technique)} 
                onChange={(e) => handleCheckboxChange(e, 'techniques')}
              />
              {technique}
            </label>
          ))}
        </div>
      </div>

      <button type='submit' disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
      <button type='button' onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </button>
    </form>
  )
}

export default UserForm;