
import React, {useState, useContext} from 'react';
import { UserContext } from './UserContext';
import UserForm from '../../../Common/Auth/UserForm';
import axios from 'axios';
import {USER_ROUTES} from '../../../Common/db-urls';
{/*
  - [x] edit account info 
  - [] reset password
  - [x] delete account
*/}

// update user info happens after refresh
const AccountDetails = () => {
  const {user, loading, setUser, fetchUser} = useContext(UserContext);
  if(loading) return <p>Loading account details...</p>
  if(!user) return <p>Unable to load user...</p>;
  //const [activeView, setActiveView] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  console.log("User in AccountDetails:", user);

  //delete user account
  const deleteUser = async (id) => {
    try {

      const confirmDelete = window.confirm('Are you sure you want to delete your account?');
      if(!confirmDelete) return;

      const token = localStorage.getItem('accessToken');
      if(!token) {
        alert('No access token found. Please log in again.');
        return;
      }

      await axios.delete(USER_ROUTES.me, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      alert('Account deleted successfully');
      localStorage.removeItem('accessToken');
      setUser(null); // Clear user context immediately
      localStorage.clear();
      window.location.href = '/user-login';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again later.');
    }
  }

  const handleUpdateSuccess = async () => {
    try {
      // Use the context's fetchUser to ensure consistent state
      await fetchUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Error refreshing user after update:', error);
      alert('Profile updated but there was an error refreshing the data');
    }
  }

  return (
    <div>
      <>
      {/* Toggle between view and edit */}
      {!isEditing ? (
        <div>
          <h2>Welcome, {user.username}</h2>
          <p>Email: {user.email}</p>
          <p>Name: {user.full_name}</p>
          <p>Phone #: {user.phone_number}</p>
          <p>Location: {user.location}</p>
          <p>Birthday: {new Date(user.birthday).toLocaleDateString()}</p>
          <p>Age: {user.age}</p>
          <p>title: <ul>
            {Array.isArray(user.title) && user.title.map((occupation, i) => (
              <li key={i}>{occupation}</li>
            ))}
          </ul></p>
          <p>Techniques:</p>
          <ul>
            {Array.isArray(user.technique) && user.technique.map((tech, i) => (
              <li key={i}>{tech}</li>
            ))}
          </ul>
          <p>experience: {user.experience}</p>

          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <UserForm 
        user={user} 
        onCancel={() => setIsEditing(false)}
        onSuccess={handleUpdateSuccess} 
        />
      )}
      
      <button>Reset Password</button>
      <button onClick={()=> deleteUser(user.id)}>Delete Account</button>
      </>
    </div>
  )
}

export default AccountDetails;
