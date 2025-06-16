import React from 'react'
import { useNavigate } from 'react-router-dom'

const AuthHub = () => {
    const navigate = useNavigate();
  return (
    <div>
        <div className="login-buttons">
            <button onClick={() => navigate('/admin/login')} style={styles.loginButton}>Admin Login</button>
            <button onClick={() => navigate('/user-login')} style={styles.loginButton}>User Login</button>
            <button onClick={() => navigate('/signup')} style={styles.loginButton}>Sign Up</button>
            <button onClick={() => navigate('/')} style={styles.loginButton}>Cancel</button>
      </div>
    </div>
  )
}

export default AuthHub
