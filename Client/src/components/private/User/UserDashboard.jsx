import React , {useContext, useEffect, useState} from 'react';
import { UserContext } from './components/UserContext';

//view account information
//book sessions
//inquiry box - questions to owner
//track progress ; goals and current level
//feedback from sessions 
//newsletter with ability to mark interested for future contact from owner
//view promotions based on being a member 


const HOST = `http://localhost:4004/basic/users/me`;

const UserDashboard = () => {
  const {user, loading} = useContext(UserContext)
  if (loading) return <p>Loading Dashboard...</p>

  
  return (
    <div>
      <h1>User Dashboard</h1>
      <h2>welcome {user.full_name}!</h2>
    </div>
  )
}

export default UserDashboard;
