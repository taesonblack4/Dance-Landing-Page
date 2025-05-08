// Core React imports
import React, { useState, useEffect } from 'react';
// HTTP client for making API requests
import axios from 'axios';
import LeadGrid from './components/LeadGrid';
import UserGrid from './components/UserGrid';

//Need to create view that seperates client intake form data from site users 
//users with have the ability book consultations through site 
//maybe calendly ??

const AdminDashboard = () => {
    // API endpoints - ⚠️ Should be moved to environment variables
    const L_HOST = 'http://localhost:4004/admin/leads/';
    const U_HOST = 'http://localhost:4004/basic/basic/users/';

    // Component state management
    const [activeView, setActiveView] = useState('leads');
    //const [state, setState] = useState([]); // Array of client objects
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingLead, setEditingLead] = useState(null); // ID of client being edited
    const [updatedLead, setUpdatedLead] = useState({ // Stores edited values
        full_name: "",
        email: "",
        phone_number: "",
        services: [], // Array of selected services
        technique: [] // Array of selected techniques
    });

    // Fetch lead data from API
    const FetchLeads = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.error("No access token found - redirecting to login");
                // Redirect to login page
                window.location.href = '/admin-login';
                return;
            }

            // Make GET request to public endpoint
            const response = await axios.get(L_HOST, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            // Update state with fetched data
            setLeads(response.data.data);
        } catch (error) {
            // Basic error handling - needs improvement
            console.error("Error fetching leads:", error);
                // Handle token expiration
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Admin privileges required");
                localStorage.removeItem("accessToken");
                // Redirect to login
                window.location.href = '/admin-login';
            }
        }
    };

    const FetchUsers = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                console.error("No access token found - redirecting to login");
                // Redirect to login page
                window.location.href = '/admin-login';
                return;
            }

            // Make GET request to public endpoint
            const response = await axios.get(U_HOST, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            // Update state with fetched data
            setUsers(response.data.data);
        } catch (error) {
            // Basic error handling - needs improvement
            console.error("Error fetching enrolled users:", error);
                // Handle token expiration
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Admin privileges required");
                localStorage.removeItem("accessToken");
                // Redirect to login
                window.location.href = '/admin-login';
            }
        }
    };

    // Component lifecycle management
    useEffect(() => {
        // Fetch data when component mounts
        FetchLeads();
        FetchUsers();
        const token = localStorage.getItem("accessToken");
        if (!token) {
            window.location.href = '/admin-login';
        }
        // Cleanup function (none needed here)
        return () => {};
    }, []); // Empty dependency array = runs once on mount

    // Delete client handler
    const deleteLead = async (id) => {
        // Confirmation dialog for destructive action
        if (!window.confirm("Are you sure you want to delete this client?")) return;

        try {
            // Make DELETE request to admin endpoint
            await axios.delete(`${L_HOST}${id}`);
            // Optimistic UI update: Remove client from local state
            setLeads(prevState => prevState.filter(lead => lead.id !== id));
        } catch (error) {
            // Error handling needs improvement
            console.error("Error deleting client:", error);
            alert("Failed to delete client. Please try again.");
            // 🚨 Consider rolling back optimistic update on failure
        }
    };

    // Initialize edit mode for a client
    const startEditing = (lead) => {
        // Set which client we're editing
        setEditingLead(lead.id);
        // Pre-populate form with existing data
        setUpdatedLead({
            full_name: lead.full_name,
            email: lead.email,
            phone_number: lead.phone_number,
            services: lead.services || [], // Fallback for undefined
            technique: lead.technique || [] // Fallback for undefined
        });
    };

    // Handle text input changes
    const handleChange = (e) => {
        // Update corresponding field in state
        setUpdatedLead(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Handle checkbox group changes
    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        // Update array field (services/technique) based on checkbox state
        setUpdatedLead(prev => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value] // Add value if checked
                : prev[field].filter(item => item !== value) // Remove if unchecked
        }));
    };

    // Submit updated client data
    const updateLead = async (id) => {
        try {
            const token = localStorage.getItem("accessToken"); // Get token
            
            // Send PUT request to admin endpoint
            await axios.put(`${L_HOST}${id}`, updatedLead, {
                headers: {  // Add authorization headers
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
            });
        
            
            // Exit edit mode
            setEditingLead(null);
            // Refresh data from server - 🚨 Could use optimistic update instead
            FetchLeads();
        } catch (error) {
            console.error("Error updating client:", error);
            alert("Failed to update client.");
            // 🚨 Consider maintaining edit mode on failure

            // Handle expired/invalid token
            if (error.response?.status === 401) {
                localStorage.removeItem("accessToken");
                window.location.href = '/admin-login';
            }
        }
    };

    // Component UI
    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Dashboard</h2>
            {/* Responsive grid layout */}
            {/* View Toggle Buttons */}
            <div style={styles.buttonContainer}>
                <button 
                    onClick={() => setActiveView('leads')}
                    //style={{...}}
                >
                    Leads
                </button>
                <button
                    onClick={() => setActiveView('users')}
                    //style={{...}}
                >
                    Users
                </button>
            </div>

            {activeView === 'leads' ? (
                <LeadGrid
                    leads={leads}
                    editingLead={editingLead}
                    updatedLead={updatedLead}
                    handlers={{
                        startEditing,
                        setEditingLead,
                        handleChange,
                        handleCheckboxChange,
                        updateLead,
                        deleteLead
                    }}
                />
            ) : (
                <UserGrid users={users} />
            )}

        </div>
    );
};

// Component styling
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
    },
    deleteButton: {
        backgroundColor: 'red', // Danger color
        color: 'white', // Text color
        border: 'none', // Remove default border
        padding: '8px 12px', // Button size
        cursor: 'pointer', // Hover effect
        marginTop: '10px', // Spacing from content
        borderRadius: '5px' // Rounded corners
    },
    updateButton: {
        backgroundColor: 'blue', // Primary action color
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        cursor: 'pointer',
        marginTop: '10px',
        borderRadius: '5px'
    },
    cancelButton: {
        backgroundColor: 'gray', // Neutral color
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        cursor: 'pointer',
        marginTop: '10px',
        borderRadius: '5px'
    }
};

export default AdminDashboard;