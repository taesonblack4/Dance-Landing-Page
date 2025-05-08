import React from 'react'
//having issues with the name and phone# not updating
const LeadGrid = ({leads, editingLead, updatedLead, handlers}) => {
  return (
    <div style={styles.gridContainer}>
    {leads.map((lead, index) => (
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
                        onChange={handlers.handleChange} 
                        placeholder="Full Name" 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        value={updatedLead.email} 
                        onChange={handlers.handleChange} 
                        placeholder="Email" 
                    />
                    <input 
                        type="tel" 
                        name="phone_number" 
                        value={updatedLead.phone_number} 
                        onChange={handlers.handleChange} 
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
                                onChange={(e) => handlers.handleCheckboxChange(e, "services")}
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
                                onChange={(e) => handlers.handleCheckboxChange(e, "technique")}
                            />
                            {technique}
                        </label>
                    ))}

                    {/* Action buttons */}
                    <button onClick={() => handlers.updateLead(lead.id)} style={styles.updateButton}>
                        Save
                    </button>
                    <button onClick={() => handlers.setEditingLead(null)} style={styles.cancelButton}>
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
                    <button onClick={() => handlers.startEditing(lead)} style={styles.updateButton}>
                        Update
                    </button>
                    <button onClick={() => handlers.deleteLead(lead.id)} style={styles.deleteButton}>
                        Delete
                    </button>
                </>
            )}
        </div>
    ))}
</div>
  );
};

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
    }
}

export default LeadGrid
