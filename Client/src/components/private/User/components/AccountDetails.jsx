
import React, {useState, useEffect, useContext} from 'react';
import { UserContext } from './UserContext';


{/*
  - [] edit account info
  - [] reset password
  - [] delete account
*/}

const AccountDetails = () => {
  const {user, loading} = useContext(UserContext);
  if(loading) return <p>Loading account details...</p>
  if(!user) return <p>Unable to load user...</p>;
  const [activeView, setActiveView] = useState(null);

  console.log("User in AccountDetails:", user);


  return (
    <>
    <button>Profile Information</button>
    <button>Delete Account</button>

  
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Name: {user.full_name}</p>
      <p>Phone #: {user.phone_number}</p>
      <p>Location: {user.location}</p>
      <p>Birthday: {user.birthday}</p>
      <p>Age: {user.age}</p>
      <p>title:</p>
      <p>technique: </p>
      <p>experience: {user.experience}</p>
    </div>
    </>
  )
}

export default AccountDetails
