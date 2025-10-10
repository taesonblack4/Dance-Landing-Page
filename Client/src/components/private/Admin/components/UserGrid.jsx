import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterBar from '../../../Common/Utils/FilterBar';
import useFilterSort from '../../../Common/Hooks/useFilterSort';
import SearchBar from '../../../Common/Utils/SearchBar';
import '../../../../styles/private/Admin/UserGrid.css';
import {USER_ROUTES, ADMIN_ROUTES} from '../../../Common/db-urls';

//const HOST = 'http://localhost:4004/basic/users/';
{/*
  - [x] filters (occupation / techniques / experience)
  - [x] sort (date joined)
  - [x] delete users
  - [x] search bar
  - [] change views (table/cells)
*/}

export default function UserGrid() {
  // -----------------------
  // Section: Data Fetching
  // -----------------------
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return window.location.href = '/admin/login';

        const response = await axios.get(USER_ROUTES.all, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    }
    fetchUsers();
  }, []);

  // -------------------------------
  // Section: Set up Viewing User
  // -------------------------------

  const [selectedUser, setSelectedUser] = useState(null); // For viewing [the selected user]
  const [isEditMode, setIsEditMode] = useState(false); // For editing [flag for edit state]

  function UserDetailPanel({ user, onClose, isEditMode, setIsEditMode, onSave }) {
    const [editedUser, setEditedUser] = useState(user);
  
    useEffect(() => {
      setEditedUser(user); // Reset form when a new user is selected
    }, [user]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedUser(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSave = () => {
      onSave(editedUser);
      setIsEditMode(false);
    };
  
    if (!user) return null;
  
    return (
      <div className='detail-panel'>
        <button onClick={onClose}>Close</button>
  
        <h2>{user.full_name}</h2>
  
        {isEditMode ? (
          <>
            <label>Username:
              <input name="username" value={editedUser.username} onChange={handleChange} />
            </label>
            <label>Phone:
              <input name="phone_number" value={editedUser.phone_number || ''} onChange={handleChange} />
            </label>
            <label>Location:
              <input name="location" value={editedUser.location || ''} onChange={handleChange} />
            </label>
            {/* Add more fields as needed */}
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <div>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Phone:</strong> {user.phone_number}</p>
            <p><strong>Location:</strong> {user.location}</p>
            {/* Display more fields */}
          </div>
        )}
  
        <button onClick={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? 'Cancel Edit' : 'Edit'}
        </button>
      </div>
    );
  }

  // ----------------------
  // Section: CRUD Handlers
  // ----------------------

  const deleteUser = async (id) => {

    try {
      const confirmDelete = window.confirm('Delete this user?');
      if(!confirmDelete) return;

      await axios.delete(ADMIN_ROUTES.userById(id));

      //remove locally without re-fetch
      setUsers(prev => prev.filter(usr => usr.id !== id))
      alert(`User with ID: ${id} , has been deleted`)
    } catch (error) {
      console.error('Unable to delete user: ', error);
      alert('Failed to delete user')
    }
  }

  // ------------------------------------
  // Section: Filtering & Sorting Setup
  // ------------------------------------
  // useFilterSort returns:
  //   filteredData: Array, --> Data after filtering, searching, & sorting
  //   filters: Object,   -->  Current filter values per field
  //   setFilters: Function,   -->  Update filters
  //  sortDirection: string,   -->    Current sort direction
  //   setSortDirection: Function, --> Toggle sort direction
  //  searchQuery: string,   -->   Current search string
  //   setSearchQuery: Function  -->  Set search string
  const {
    filteredData,
    filters,
    setFilters,
    sortDirection,
    setSortDirection,
    searchQuery,
    setSearchQuery
  } = useFilterSort(
    users,
    ['location','technique', 'experience', 'age', 'birthday','services', 'title' ],
    ['username','full_name'],
    'creationDate',
    'desc'
  );

  // --------------------------------
  // Section: Render JSX
  // --------------------------------
  return (
    <div className='grid-container'>
      
      <div>
        <h2>Count: {filteredData.length}</h2>
        <button onClick={()=> setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}>
          Sort by Date: {sortDirection === 'asc' ? 'Oldest' : 'Newest'}
        </button>
      </div>
      <SearchBar value={searchQuery} onChange={setSearchQuery}/>
      <FilterBar 
        data={users}
        filters={filters}
        setFilters={setFilters}
        fieldsToFilter={
          ['location', 'technique', 
          'experience', 'age', 'birthday', 
          'services', 'title']
        }
      />

      {filteredData.map(user => (
        <div key={user.id} className="user-card">
          
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
          <p>phone: {user.phone_number}</p>
          <p>location: {user.location}</p>
          {/* Action Buttons */}
          <button onClick={() => {
            setSelectedUser(user);
            setIsEditMode(false); 
          }}>
            View
          </button>

          <button onClick={() => deleteUser(user.id)}>
            Delete
          </button>

        </div>
      ))}
      {selectedUser && (
        <UserDetailPanel
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          onSave={async (updatedUser) => {
            try {
              const token = localStorage.getItem('accessToken');
              //quick fix since the api endpoint has changed and need to name new routes
              await axios.put(USER_ROUTES.registerById(updatedUser.id), updatedUser, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
              setSelectedUser(updatedUser); // Refresh view
            } catch (err) {
              alert("Failed to save user.");
              console.error(err);
            }
          }}
        />
)}
    </div>
    
  );
}

