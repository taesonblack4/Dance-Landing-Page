// Import React hooks and utilities
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

//Public Components
import LandingPage from './components/public/LandingPage';
import UserLogin from './components/Common/Auth/UserLogin';
import SignUp from './components/Common/Auth/SignUp';
import AdminLogin from './components/Common/Auth/AdminLogin';
import Registration from './components/Common/Auth/Registration';
import LoginHub from './components/Common/Auth/LoginHub';

// Import private  components
import AdminDashboard from './components/private/Admin/AdminDashboard';
import UserDashboard from './components/private/User/UserDashboard';

// Import global styles
import './styles/App.css';

function App() {
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); 

    // Add this effect to verify token on app load
    useEffect(() => {
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role === 'user') {
            setIsUser(true);
            localStorage.setItem('isUser', 'true');
          } else if (payload.role === 'super') {
            setIsAdmin(true);
            localStorage.setItem('isAdmin', 'true');
          }
        } catch (e) {
          console.error("Token validation error:", e);
        }
      }
      
      setAuthChecked(true);
    }, []);
  
    // Only render routes after auth check completes
    if (!authChecked) {
      return <div>Loading...</div>;  // Or a loading spinner
    }


  // Logout handler 
  const handleLogout = () => {
    localStorage.clear();
    setIsUser(false);
    setIsAdmin(false);
  };



  // Main component rendering logic
  return (
    <>
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path='/' element={<LandingPage />}/>

        {/* Auth Routes */}
        <Route path="/user-login" element={<UserLogin onLogin={() => setIsUser(true)} />} />
        <Route path="/signup" element={<SignUp onSignUp={() => setIsUser(true)} />} />
        <Route path="/signup/register" element={<Registration onSignUp={() => setIsUser(true)}/>} />
        <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdmin(true)} />} />
        <Route path="/loginHub" element={<LoginHub />}/>

        {/* Protected User Dashboard */}
        <Route
          path="/user-dashboard"
          element={
            isUser ? (
              <UserDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/user-login" />
            )
          }
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            isAdmin ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  );
}

// Inline styles for buttons
const styles = {
  loginButton: {
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '20px'
  },
  logoutButton: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    position: 'absolute',  // Fixed positioning for easy access
    top: '10px',
    right: '10px'
  }
};

export default App;