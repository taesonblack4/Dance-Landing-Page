// Core React imports
import React, { useState, useEffect } from 'react';
// HTTP client for making API requests
import axios from 'axios';

//Need to create view that seperates client intake form data from site users 
//users with have the ability book consultations through site 
//maybe calendly ??

const Dashboard = () => {
    // API endpoints - ⚠️ Should be moved to environment variables
    const HOST = 'http://localhost:4004/admin/leads/'; // Public client endpoint
    const Admin_HOST = 'http://localhost:4004/admin/leads/'; // Admin-only endpoint

    // Component state management
    const [state, setState] = useState([]); // Array of client objects
    const [editingLead, setEditingLead] = useState(null); // ID of client being edited
    const [updatedLead, setUpdatedLead] = useState({ // Stores edited values
        full_name: "",
        email: "",
        phone_number: "",
        services: [], // Array of selected services
        technique: [] // Array of selected techniques
    });

    // Fetch client data from API
    const FetchLeads = async () => {
        try {
            // Make GET request to public endpoint
            const response = await axios.get(HOST);
            // Update state with fetched data
            setState(response.data);
        } catch (error) {
            // Basic error handling - needs improvement
            console.error("Error fetching clients:", error);
            // 🚨 Consider adding user-facing error notification
        }
    };

    // Component lifecycle management
    useEffect(() => {
        // Fetch data when component mounts
        FetchLeads();
        // Cleanup function (none needed here)
        return () => {};
    }, []); // Empty dependency array = runs once on mount

    // Delete client handler
    const deleteLead = async (id) => {
        // Confirmation dialog for destructive action
        if (!window.confirm("Are you sure you want to delete this client?")) return;

        try {
            // Make DELETE request to admin endpoint
            await axios.delete(`${Admin_HOST}${id}`);
            // Optimistic UI update: Remove client from local state
            setState(prevState => prevState.filter(lead => lead.id !== id));
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
            // Send PUT request to admin endpoint
            await axios.put(`${Admin_HOST}${id}`, updatedLead);
            // Exit edit mode
            setEditingLead(null);
            // Refresh data from server - 🚨 Could use optimistic update instead
            FetchLeads();
        } catch (error) {
            console.error("Error updating client:", error);
            alert("Failed to update client.");
            // 🚨 Consider maintaining edit mode on failure
        }
    };

    // Component UI
    return (
        <div style={{ padding: '20px' }}>
            <h2>Lead Dashboard</h2>
            {/* Responsive grid layout */}
            <div style={styles.gridContainer}>
                {state.map((lead, index) => (
                    <div key={index} style={styles.card}>
                        {/* Conditional rendering: Edit mode vs View mode */}
                        {editingLead === lead.id ? (
                            /* EDIT MODE */
                            <>
                                {/* Editable text inputs */}
                                <input 
                                    type="text" 
                                    name="full_name" 
                                    value={updatedLead.full_name} 
                                    onChange={handleChange} 
                                    placeholder="Full Name" 
                                />
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={updatedLead.email} 
                                    onChange={handleChange} 
                                    placeholder="Email" 
                                />
                                <input 
                                    type="tel" 
                                    name="phone_number" 
                                    value={updatedLead.phone_number} 
                                    onChange={handleChange} 
                                    placeholder="Phone Number" 
                                />

                                {/* Services checkbox group */}
                                <p><strong>Services:</strong></p>
                                {["Choreography", "Movement Coaching", "Private Coaching", "Performances", "Arts Administration", "Teaching", "Workshops"].map(service => (
                                    <label key={service}>
                                        <input
                                            type="checkbox"
                                            value={service}
                                            checked={updatedLead.services.includes(service)}
                                            onChange={(e) => handleCheckboxChange(e, "services")}
                                        />
                                        {service}
                                    </label>
                                ))}

                                {/* Technique checkbox group */}
                                <p><strong>Technique:</strong></p>
                                {["Hip Hop", "Jazz", "Modern", "Ballet", "Contemporary"].map(technique => (
                                    <label key={technique}>
                                        <input
                                            type="checkbox"
                                            value={technique}
                                            checked={updatedLead.technique.includes(technique)}
                                            onChange={(e) => handleCheckboxChange(e, "technique")}
                                        />
                                        {technique}
                                    </label>
                                ))}

                                {/* Action buttons */}
                                <button onClick={() => updateLead(lead.id)} style={styles.updateButton}>
                                    Save
                                </button>
                                <button onClick={() => setEditingLead(null)} style={styles.cancelButton}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            /* VIEW MODE */
                            <>
                                {/* Client information display */}
                                <h3>{lead.full_name}</h3>
                                <p><strong>Email:</strong> {lead.email}</p>
                                <p><strong>Phone:</strong> {lead.phone_number}</p>
                                <p><strong>Services:</strong> {Array.isArray(lead.services) ? lead.services.join(", ") : lead.services}</p>
                                <p><strong>Technique:</strong> {Array.isArray(lead.technique) ? lead.technique.join(", ") : lead.technique}</p>
                                <p><strong>Message:</strong> {lead.message}</p>
                                
                                {/* Action buttons */}
                                <button onClick={() => startEditing(lead)} style={styles.updateButton}>
                                    Update
                                </button>
                                <button onClick={() => deleteLead(lead.id)} style={styles.deleteButton}>
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
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

export default Dashboard;