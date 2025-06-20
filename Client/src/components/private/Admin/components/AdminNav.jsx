import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminNav = () => {
    const navigate = useNavigate();

    return (
    <div className='admin-navbar'>
      <div className='link-container'>
        <nav>
            <ul>
                <li><a>Home</a></li>
                <li><a>Post</a></li>
                <li><a>Users</a></li>
                <li><a>Leads</a></li>
                <li><a>Logout</a></li>
            </ul>
        </nav>
      </div>
    </div>
  )
}

export default AdminNav
