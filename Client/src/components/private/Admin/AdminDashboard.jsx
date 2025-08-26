// Core React imports
import React, { useState, useEffect } from 'react';
import { AdminWidgets } from '../../Common/Widgets/DashboardWidgets';

{/*
    - [] widgets 
        [] user count
        [] lead count
        [] active promos
        [] bookings this week
        [] view inquiry box (questions from users)
        [] Recent acitivity (new signups that week , last post , etc)
*/}
const AdminDashboard = ({onLogout}) => {
    // Component UI
    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard</h2>
            <AdminWidgets />
        </div>
    );
};


export default AdminDashboard;