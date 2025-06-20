import React from 'react'

const UserNav = () => {
  return (
    <div className='user-navbar'>
      <div className='link-container'>
        <nav>
            <ul>
                <li><a>Home</a></li>
                <li><a>Announcements</a></li>
                <li><a>Promos</a></li>
                <li><a>Scheduling</a></li>
                <li><a>Settings</a></li>
                <li><a>Logout</a></li>
            </ul>
        </nav>
      </div>
    </div>
  )
}

export default UserNav
