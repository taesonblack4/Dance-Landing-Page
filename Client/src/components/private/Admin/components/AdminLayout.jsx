import React from 'react'
import { Outlet } from 'react-router-dom';
import AdminNav from './AdminNav';

const AdminLayout = () => {
  return (
    <div>
        <AdminNav />
        <main style={{ padding: '1rem' }}>
            <Outlet />
        </main>
    </div>
  )
}

export default AdminLayout
