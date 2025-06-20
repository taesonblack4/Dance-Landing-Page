import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginHub = () => {
    const navigate = useNavigate();
  return (
    <div>
        <div className="login-buttons">
            <button onClick={() => navigate('/admin/login')} style={styles.loginButton}>Admin Login</button>
            <button onClick={() => navigate('/user-login')} style={styles.loginButton}>User Login</button>
            <button onClick={() => navigate('/')} style={styles.loginButton}>Cancel</button>
      </div>
    </div>
  )
}

// define your styles object here
const styles = {
  loginButton: {
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    margin: '10px'
  }
};

export default LoginHub
