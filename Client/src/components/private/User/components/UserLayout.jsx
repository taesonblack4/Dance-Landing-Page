import React from 'react'
import { Outlet } from 'react-router-dom';
import UserNav from './UserNav';

const UserLayout = () => {
  return (
    <div>
      <h1>user layout</h1>
      <UserNav />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default UserLayout
