import React from 'react'

const UserGrid = ({users}) => {
  return (
    <div style={styles.gridContainer}>
      {users.map(user => (
        <div key={user.id} style={styles.card}>
            <h3>{user.username}</h3>
            <p>ID #: {user.id}</p>
            {/* Add more user fields */}
        </div>
        ))}
    </div>
  )
}

const styles = {
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsive grid
        gap: '20px', // Space between cards
        padding: '20px' // Container padding
    },
    card: {
        background: '#222', // Dark background
        color: '#fff', // White text
        padding: '15px', // Internal spacing
        borderRadius: '10px', // Rounded corners
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Drop shadow
        textAlign: 'left', // Text alignment
        border: '1px solid #444' // Border styling
    }
}

export default UserGrid
