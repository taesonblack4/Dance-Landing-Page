import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HOST = 'http://localhost:4004/basic/users/';
{/*
  - [] filters (occupation / techniques / experience)
  - [] sort (date joined)
  - [] delete users
  - [] search bar
  - [] change views (table/cells)
*/}
export default function UserGrid() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return window.location.href = '/admin/login';

        const response = await axios.get(HOST, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div style={styles.gridContainer}>
      <div>
        Count: {users.length}
        <button>Filter</button>
        <button>Sort</button>
      </div>

      {users.map(user => (
        <div key={user.id} style={styles.card}>
          
          {/* Debug help
          
          {console.log('user ▶', user)}
          <pre style={{ whiteSpace: 'pre-wrap', color: '#0f0' }}>
            {JSON.stringify(user, null, 2)}
          </pre> */}

          <h3>{user.username}</h3>
          <p>ID #: {user.id}</p>
          {/* Add more user fields as needed */}
          <p>name: {user.full_name}</p>
          {/* get a complete view of user details */}
          <button>
            View
          </button>
          <button>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px'
  },
  card: {
    background: '#222',
    color: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    border: '1px solid #444'
  }
};
