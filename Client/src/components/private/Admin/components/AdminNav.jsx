import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const AdminNav = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.clear();
      // if you have a context or prop callback you can call that here
      navigate('/', { replace: true });
  };

    return (
    <div className='admin-navbar'>
      <div className='link-container'>
        <nav>
            <ul>
                <li><NavLink to='/admin' end>Home</NavLink></li>
                <li><NavLink to='/admin/posts'>Post</NavLink></li>
                <li><NavLink to='/admin/users'>Users</NavLink></li>
                <li><NavLink to='/admin/leads'>Leads</NavLink></li>
                <li><NavLink to='/admin/settings'>Settings</NavLink></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
      </div>
    </div>
  )
}

export default AdminNav
