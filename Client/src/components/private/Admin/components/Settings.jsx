import React from 'react'

const Settings = () => {
  return (
    <div>
      <h1>Settings</h1>
      {/* Admin related controls 
        - [] view admin list
        - [] add new admins 
        - [] delete admins
        - [] update admins (usernames, passwords, permissions)
      */}
      <div className="admin-controls">
      <button className='btn'>View Admins</button>
      <button className='btn'>Create New Admin</button>
      <button className='btn'>Update Admin Info</button>
      <button className='btn'>Delete Admin</button>

      </div>

    </div>
  )
}

export default Settings
