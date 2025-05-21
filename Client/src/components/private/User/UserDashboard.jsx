import React , {useEffect, useState} from 'react';
import axios from 'axios';
import AccountDetails from './components/AccountDetails';
//view account information
//book sessions
//inquiry box - questions to owner
//track progress ; goals and current level
//feedback from sessions 
//newsletter with ability to mark interested for future contact from owner
//view promotions based on being a member 

const userId = localStorage.getItem("userId");
const HOST = `http://localhost:4004/basic/basic/users/${userId}`;


const UserDashboard = () => {

  const [user, setUser] = useState([]);
  
  const FetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');
      //test
      console.log('fetching user with ID: ', userId);

      if(!token) {
        console.error('Missing token');
        return;
      } else if(!userId) {
        console.error('No user ID found in localStorage');
        return;
      }

      const response = await axios.get(HOST, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      setUser(response.data)
    } catch (error) {
      console.error('issue with fetching enrolled users', error);
    }
  }

  useEffect(()=> {
    FetchUser();

  },[])
  
  return (
    <div>
      <h1>User Dashboard</h1>
      {user ? (
        <AccountDetails user={user}/> 
      ) : (
        <p>Loading User Data...</p>
      )}
    </div>
  )
}

export default UserDashboard
