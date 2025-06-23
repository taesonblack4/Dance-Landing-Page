// Import React core library and useState hook
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



// Login component handling admin authentication
const UserLogin = ({onLogin}) => {
    const navigate = useNavigate();
    const Login_HOST = 'http://localhost:4004/auth/user/login';

    // State management for form fields and error messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleLogin = async () => {
        const loginData = {
            username: username,
            password: password
        }
        console.log(loginData);
        try {
            const response = await axios.post(Login_HOST, loginData);
            console.log('Login response:', response.data);
            if(response) {
                localStorage.setItem("isUser", "true");
                const token = response.data.token;
                localStorage.setItem("accessToken", token); // assuming token is returned
                // Fetch the correct user immediately
                const userRes = await axios.get('http://localhost:4004/basic/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const user = userRes.data;
                localStorage.setItem("userId", user.id); // <-- store user ID
                console.log("Logged in as:", user);

                onLogin();// sets isUser to true
                navigate('/user', {replace: true}) // go to user dashboard
            }
        } catch {
            setError('invalid username or password');
        }

    };


    // Login form UI
    return (
        <div style={styles.container}>
            <h2>User Login</h2>
            
            {/* Username input field */}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
            />
            
            {/* Password input field */}
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            
            {/* Error message display */}
            {error && <p style={styles.error}>{error}</p>}
            
            {/* Login submission button */}
            <button onClick={handleLogin} style={styles.button}>
                Login
            </button>
            <button onClick={() => navigate('/')}>
                Cancel
            </button>
        </div>
    );
};

// CSS-in-JS styles for the component
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',  // Full viewport height
        background: '#222',  // Dark background
        color: '#fff',  // White text
    },
    input: {
        width: '200px',
        padding: '10px',
        margin: '5px 0',
        borderRadius: '5px',
        border: '1px solid #ccc'  // Light gray border
    },
    button: {
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        cursor: 'pointer',
        borderRadius: '5px',
        marginTop: '10px'  // Spacing above button
    },
    error: {
        color: 'red',  // Error message styling
        fontSize: '14px',
    }
};

export default UserLogin;