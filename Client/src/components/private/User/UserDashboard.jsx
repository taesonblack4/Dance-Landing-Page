import React , {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountDetails from './components/AccountDetails';
//view account information
//book sessions
//inquiry box - questions to owner
//track progress ; goals and current level
//feedback from sessions 
//newsletter with ability to mark interested for future contact from owner
//view promotions based on being a member 


const HOST = `http://localhost:4004/basic/users/me`;

const UserDashboard = ({ onLogout }) => {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //im fetching the right user but the data is wrong, confirmed with my test
  const FetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      if(!token) {
        console.error('Missing token');
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
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(()=> {
    FetchUser();

  },[])

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  
  return (
    <div>
      <h1>User Dashboard</h1>
      <button type='button' 
      onClick={handleLogout}>Log Out</button>
      {user ? (
        <AccountDetails user={user}/> 
      ) : (
        <p>Loading User Data...</p>
      )}
    </div>
  )
}

export default UserDashboard;
