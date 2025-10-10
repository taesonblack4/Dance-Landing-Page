import React , {useContext, useEffect, useState} from 'react';
import { UserContext } from './components/UserContext';
import { UserWidgets } from '../../Common/Widgets/DashboardWidgets';

//view account information
//delete and update account
//book sessions
//inquiry box - questions to owner
//track progress ; goals and current level
//feedback from sessions 
//newsletter with ability to mark interested for future contact from owner
//view promotions based on being a member

{/* 
  - [] leave site feedback
  - [] view FAQs
  - [] widgets
      [x] current goals
      [] inquiry box
      [] leave feedback on last appt
      [x] recent activity (latest promo/announcement)
*/}

const UserDashboard = () => {
  const {user, loading} = useContext(UserContext)
  if (loading) return <p>Loading Dashboard...</p>

  
  return (
    <div>
      <h1>User Dashboard</h1>
      <h2>welcome {user.full_name}!</h2>
      <UserWidgets />
    </div>
  )
}

export default UserDashboard;
