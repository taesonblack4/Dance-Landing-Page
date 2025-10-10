// Import React core library and useState hook
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {USER_ROUTES} from '../db-urls'


// Login component handling admin authentication
const SignUp = () => {
    const navigate = useNavigate();

    //const HOST = 'http://localhost:4004/basic/users';

    // State management for form fields and error messages
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // For confirming password
    const [error, setError] = useState('');


    const handleSignUp = async () => {
        const UserData = {
            username: username,
            password: password
        }

        if(password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(USER_ROUTES.all, UserData, {
                headers: {"Content-Type": "application/json"}
            });

            console.log("User added:", response.data);
            const userId = response.data.data.id;
            alert("Username and Password is valid!!! Now redirecting to account registration");
            localStorage.setItem('registeredUserId', userId);
            navigate('/signup/register');
            //navigate('/signup/register', {state: {userId}}); //redirect to registration page
          
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

            {/* Confirm Password input field */}
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
            />
            
            {/* Error message display */}
            {error && <p style={styles.error}>{error}</p>}
            
            {/* Sign up submission button */}
            <button onClick={handleSignUp} style={styles.button}>
                Regsister
            </button>
            {/* Cancel sign up process ans return to LP */}
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

export default SignUp;