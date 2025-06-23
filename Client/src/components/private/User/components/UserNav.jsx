import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const UserNav = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.clear();
        // if you have a context or prop callback you can call that here
        navigate('/', { replace: true });
    };

    return (
        <div className='user-navbar'>
            <div className='link-container'>
                <nav>
                    <ul>
                        <li><NavLink to= '/user' end>Home</NavLink> </li>
                        <li><NavLink to= '/user/announcements'>Announcements</NavLink></li>
                        <li><NavLink to= '/user/promos'>Promos</NavLink></li>
                        <li><NavLink to= '/user/scheduling'>Scheduling</NavLink></li>
                        <li><NavLink to= '/user/account'>Account</NavLink></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                </nav>
            </div>
        </div>
  )
}

export default UserNav
