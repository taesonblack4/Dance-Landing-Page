// Import React core library and useState hook
import React, { useState } from 'react';
// Import Axios for HTTP requests
import axios from 'axios';

// API endpoint configuration (⚠️ Should use environment variables)
const HOST = 'http://localhost:4004/clients/';

// ClientForm component handles form submission and state management
const ClientForm = () => {
    // State management for form fields
    const [fullName, setFullName] = useState(""); // Full name input
    const [email, setEmail] = useState(""); // Email input
    const [phoneNumber, setPhoneNumber] = useState(""); // Phone number input
    const [message, setMessage] = useState(""); // Optional message

    // State for checkbox groups (arrays store selected values)
    const [services, setServices] = useState([]); // Selected services
    const [techniques, setTechniques] = useState([]); // Selected techniques

    // Generic input handler for text inputs
    const handleInputChange = (e, setter) => {
        setter(e.target.value); // Update state with input value
    };

    // Checkbox state management handler
    const handleCheckboxChange = (e, setter, stateArray) => {
        const { checked, value } = e.target;
        // Add/remove value from array based on checkbox state
        checked ? setter([...stateArray, value]) : setter(stateArray.filter(item => item !== value));
    };

    // Form submission handler
    const addDancer = async () => {
        // Basic validation for required fields
        if (!fullName || !email || !phoneNumber) {
            alert("Please fill out all required fields.");
            return;
        }
    
        // Prepare data for API submission
        const requestData = {
            name: fullName, // Matches backend field name
            email: email,
            phone: phoneNumber, // Ensure matches backend schema
            services: services,
            technique: techniques,
            message: message
        };
    
        try {
            // POST request to backend API
            const response = await axios.post(HOST, requestData, {
                headers: { "Content-Type": "application/json" }
            });
    
            console.log("Client added:", response.data);
            alert("Success!"); // 🚨 Consider more user-friendly feedback
    
            // Reset form state
            setFullName(""); // Clear name
            setEmail(""); // Clear email
            setPhoneNumber(""); // Clear phone
            setMessage(""); // Clear message
            setServices([]); // Reset checkboxes
            setTechniques([]); // Reset checkboxes
    
        } catch (error) {
            console.error("Submission error:", error);
            alert("Error submitting form."); // Generic error message
        }
    };
    
    // Form submission handler
    const onSubmit = (e) => {
        e.preventDefault(); // Prevent default form behavior
        addDancer(); // Trigger submission
    };

    // Form UI
    return (
        <div className='form-container'>
            <form onSubmit={onSubmit}>
                {/* Full Name Input */}
                <label htmlFor="name">Full Name</label>
                <input 
                    type='text' 
                    id='name' 
                    placeholder='Firstname Lastname' 
                    value={fullName} 
                    onChange={(e) => handleInputChange(e, setFullName)}
                    required // HTML5 validation
                />

                {/* Email Input */}
                <label htmlFor="email">Email</label>
                <input 
                    type='email' 
                    id='email' 
                    placeholder='email@example.com' 
                    value={email} 
                    onChange={(e) => handleInputChange(e, setEmail)}
                    required
                />

                {/* Phone Number Input */}
                <label htmlFor="cell">Phone Number</label>
                <input 
                    type='tel' 
                    id='cell' 
                    placeholder='(xxx)-xxx-xxxxx' 
                    value={phoneNumber} 
                    onChange={(e) => handleInputChange(e, setPhoneNumber)}
                    required
                />

                {/* Services Checkbox Group */}
                <label htmlFor="service-type">Services</label>
                <div className='service-checkbox-container'>
                    {[
                        "Choreography", "Movement Coaching", "Private Coaching", 
                        "Performances", "Arts Administration", "Dance Education", 
                        "Other - please specify in message box"
                    ].map((service, index) => (
                        <label key={index}>
                            <input 
                                type='checkbox' 
                                value={service}
                                checked={services.includes(service)}
                                onChange={(e) => handleCheckboxChange(e, setServices, services)}
                            />
                            {service}
                        </label>
                    ))}
                </div>

                {/* Technique Checkbox Group */}
                <label htmlFor="dance-style">Technique</label>
                <div className='dance-checkbox-container'>
                    {["Hip Hop", "Jazz", "Modern", "Ballet"].map((technique, index) => (
                        <label key={index}>
                            <input 
                                type='checkbox' 
                                value={technique}
                                checked={techniques.includes(technique)}
                                onChange={(e) => handleCheckboxChange(e, setTechniques, techniques)}
                            />
                            {technique}
                        </label>
                    ))}
                </div>

                {/* Message Textarea */}
                <label htmlFor="message">Message</label>
                <textarea 
                    id='message' 
                    placeholder='Tell me more about you' 
                    value={message} 
                    onChange={(e) => handleInputChange(e, setMessage)}
                />

                {/* Submit Button */}
                <input type='submit' value="Submit"/>
            </form>
        </div>
    );
};

// Contact component with forwarded ref for scrolling
const Contact = React.forwardRef((props, ref) => {
    return (  
       <div ref={ref} className='contact-section-container'>
          <h3>Contact Me</h3>
          <ClientForm />
      </div>
    )
});
  
export default Contact;