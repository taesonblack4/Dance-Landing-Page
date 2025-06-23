import React from 'react'
import { Outlet } from 'react-router-dom';
import AdminNav from './AdminNav';

const AdminLayout = () => {
  return (
    <div>
        <h1>Admin Layout</h1>
        <AdminNav />
        <main style={{ padding: '1rem' }}>
            <Outlet />
        </main>
    </div>
  )
}

export default AdminLayout
