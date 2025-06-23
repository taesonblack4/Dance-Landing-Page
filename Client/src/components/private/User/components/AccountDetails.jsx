import React, {useState, useEffect, useContext} from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';



const AccountDetails = () => {

  const {user, loading} = useContext(UserContext);
  if(loading) return <p>Loading account details...</p>
  if(!user) return <p>Unable to load user...</p>;

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Name: {user.full_name}</p>
      <p>Phone #: {user.phone_number}</p>
      <p>Location: {user.location}</p>
      <p>Birthday: {user.birthday}</p>
      <p>Age: {user.age}</p>
      <p>title: </p>
      <p>technique: </p>
      <p>experience: {user.experience}</p>
    </div>
  )
}

export default AccountDetails
