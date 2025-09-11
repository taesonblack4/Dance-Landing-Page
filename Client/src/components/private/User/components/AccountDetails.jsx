
import React, {useState, useEffect, useContext} from 'react';
import { UserContext } from './UserContext';
import UserForm from '../../../Common/Auth/UserForm';


{/*
  - [] edit account info
  - [] reset password
  - [] delete account
*/}

const AccountDetails = () => {
  const {user, loading} = useContext(UserContext);

  if(loading) return <p>Loading account details...</p>
  if(!user) return <p>Unable to load user...</p>;

  //const [activeView, setActiveView] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  console.log("User in AccountDetails:", user);


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
          <p>title: {user.title}</p>
          <p>technique:</p>
          <p>experience: {user.experience}</p>

          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <UserForm user={user} 
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)} />
      )}

      </>
    </div>
  )
}

export default AccountDetails;
