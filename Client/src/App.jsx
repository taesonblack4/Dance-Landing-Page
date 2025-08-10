// Import React hooks and utilities
import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

//Public Pages
import LandingPage from './components/public/LandingPage';
import UserLogin from './components/Common/Auth/UserLogin';
import SignUp from './components/Common/Auth/SignUp';
import AdminLogin from './components/Common/Auth/AdminLogin';
import Registration from './components/Common/Auth/Registration';
import LoginHub from './components/Common/Auth/LoginHub';

//User-area Pages & Layout
import { UserProvider } from './components/private/User/components/UserContext';
import UserDashboard from './components/private/User/UserDashboard';
import UserLayout from './components/private/User/components/UserLayout';
import AccountDetails from './components/private/User/components/AccountDetails';
import Announcements from './components/private/User/components/Announcements';
import Promos from './components/private/User/components/Promos';
import Scheduling from './components/private/User/components/Scheduling';
import GoalsPage from './components/private/User/components/GoalsPage';


// Import private  components
import AdminDashboard from './components/private/Admin/AdminDashboard';
import AdminLayout from './components/private/Admin/components/AdminLayout';
import Posts from './components/private/Admin/components/Posts';
import LeadGrid from './components/private/Admin/components/LeadGrid';
import UserGrid from './components/private/Admin/components/UserGrid';
import Settings from './components/private/Admin/components/Settings';

// Import global styles
import './styles/App.css';

function App() {
  const [isUser, setIsUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); 

  //verify token and role on app load
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

        {/* Public Auth Routes */}
        <Route path="/user-login" element={<UserLogin onLogin={() => setIsUser(true)} />} />
        <Route path="/signup" element={<SignUp onSignUp={() => setIsUser(true)} />} />
        <Route path="/signup/register" element={<Registration onSignUp={() => setIsUser(true)}/>} />
        <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAdmin(true)} />} />
        <Route path="/login-hub" element={<LoginHub />}/>
        

        {/* Protected User Area */} 
        {/* Use replace on redirects (especially auth redirects) 
        to keep your users from cycling back into protected or obsolete URLs */}
        <Route
          path="/user"
          element={
            isUser
              ? (
              <UserProvider>
                <UserLayout />
              </UserProvider>
            ) : <Navigate to="/user-login" replace />
          }
        >

          {/* /user */}
          <Route
            index
            element={<UserDashboard onLogout={handleLogout} />}
          />
          {/* /user/announcements */}
          <Route
            path="announcements"
            element={<Announcements />}
          />
          {/* /user/promos */}
          <Route
            path="promos"
            element={<Promos />}
          />
          {/* /user/scheduling */}
          <Route
            path="scheduling"
            element={<Scheduling />}
          />
          {/* /user/goals */}
          <Route 
          path="goals"
          element={<GoalsPage/>}
          />
          
          {/* /user/account */}
          <Route
            path="account"
            element={<AccountDetails />}
          />
        </Route>


        {/* Protected Admin Area */}
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminLayout />
            ) : (
              <Navigate to="/admin/login" replace/>
            )
          }
        > 
        {/* /admin */}
        <Route 
          index
          element={<AdminDashboard onLogout={handleLogout} />}
        />
        {/* /admin/leads */}
        <Route 
          path='leads'
          element={<LeadGrid />}
        />
        {/* /admin/users */}
        <Route 
          path='users'
          element={<UserGrid />}
        />
        {/* /admin/posts */}
        <Route 
          path='posts'
          element={<Posts />}
        />
        {/* /admin/settings */}
        <Route 
          path='settings'
          element={<Settings />}
        />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace/>} />
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