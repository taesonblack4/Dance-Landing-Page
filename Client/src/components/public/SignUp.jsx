// Import React core library and useState hook
import React, { useState, useEffect } from 'react';
import axios from 'axios';



// Login component handling admin authentication
const SignUp = ({ onSignUp, onCancel }) => {

    const HOST = 'http://localhost:4004/users';

    // State management for form fields and error messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleSignUp = async () => {
        const UserData = {
            username: username,
            password: password
        }

        try {
            const response = await axios.post(HOST, UserData, {
                headers: {"Content-Type": "application/json"}
            });

            console.log("User added:", response.data);
            alert("Sign up process is successful!!!");
            onSignUp();
          
        } catch {
            setError('error creating new user');
        }
    };


    // Login form UI
    return (
        <div style={styles.container}>
            <h2>Sign Up</h2>
            
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
            <button onClick={handleSignUp} style={styles.button}>
                Join
            </button>
            {/* Cancel sign up process ans return to LP */}
            <button onClick={onCancel}>
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

export default SignUp;