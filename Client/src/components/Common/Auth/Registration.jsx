import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {USER_ROUTES} from '../db-urls'


const Registration = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    const userId = Number(routerLocation.state?.userId || localStorage.getItem('registeredUserId'));
    //console.log("routerLocation.state: ", routerLocation.state);
    //console.log("userId after fallback:", userId);  


    //const HOST = 'http://localhost:4004/basic/users/register/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('')
    const [birthday, setBirthDay] = useState('');
    const [age, setAge] = useState();
    const [occupation, setOccupation] = useState([]);
    const [experience, setExperience] = useState('');

    const [techniques, setTechniques] = useState([]);

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

    const cleanArray = (arr) => {
        return Array.isArray(arr)
          ? [...new Set(arr.map(item => item?.trim()).filter(Boolean))]
          : [];
    };

    const addUserInfo = async (id) => {
        const userData = {
            full_name: name,
            email: email,
            phone_number: phoneNumber,
            location: location,
            birthday: birthday,
            age: Number(age),
            title: cleanArray(occupation),
            experience: experience,
            technique: cleanArray(techniques),
        }

        if(!userId) {
            alert('User ID is missing');
            return;
        }

        console.log(id);

        try {
            const response = await axios.put(USER_ROUTES.registerById(id), userData, {
                headers: {"Content-Type": "application/json"}
            });
            console.log("User Info Added: ", response.data);
            alert("you are successfully Signed up!!!");
            navigate('/user-login'); //Redirect to LoginPage
        } catch (error) {
            console.log("submission error: ", error);
            alert("error submitting registration");
        }

    }

    const onSubmit = (e) => {
        e.preventDefault(); //prevent default form behavior
        addUserInfo(userId); //trigger submission
    }
  
    return (
    <>
        <h1>FILL IN THE BLANKS</h1>

        <div className='form-container'>
            <form onSubmit={onSubmit}>

                {/* Full Name Input */}
                <div className='input-group'>
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id='name' placeholder='john doe' value={name} onChange={(e)=> handleInputChange(e, setName)}/>
                </div>

                {/* Email Input */}
                <div className='input-group'>
                    <label htmlFor="email">Email</label>
                    <input type="email"  id='email' placeholder='johndoe@gmail.com' value={email} onChange={(e)=> handleInputChange(e, setEmail)}/>
                </div>

                {/* Phone Number Input */}
                <div className='input-group'>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id='phoneNumber' placeholder='xxx-xxx-xxxx' value={phoneNumber} onChange={(e)=> handleInputChange(e, setPhoneNumber)}/>
                </div>

                {/* Location Input */}
                <div className='input-group'>
                    <label htmlFor="location">Location</label>
                    <input type="text" id='location' placeholder='city/state' value={location} onChange={(e)=> handleInputChange(e, setLocation)}/>
                </div>

                {/* Birthday Input */}
                <div className='input-group'>
                    <label htmlFor="birthday">Birthday</label>
                    <input type="date" id='birthday' value={birthday} onChange={(e)=> handleInputChange(e, setBirthDay)}/>
                </div>

                {/* Age Input */}
                <div className='input-group'>
                    <label htmlFor="age">Age</label>
                    <input type="number" id='age' placeholder='17' value={age} onChange={(e)=> handleInputChange(e, setAge)}/>
                </div>

                {/* Experience Select Group*/}
                <div className='input-group'>
                    <label htmlFor="experience">Experience</label>
                    <select name="experience" id="experience" value={experience} onChange={(e) => setExperience(e.target.value)}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Professional">Professional</option>
                    </select>
                </div>

                {/* Occupation Checkbox Group */}
                <div className='checkbox-group'> 
                    <label htmlFor="occupation">Occupation</label>
                    <div className='checkbox-items'>
                    {["Student", "Instructor", "Choreographer", "Administrator", "Performer"].map((title, index) => (
                        <label key={index} className="checkbox-label">
                            <input type="checkbox" value={title} checked={occupation.includes(title)} onChange={(e) => handleCheckboxChange(e, setOccupation, occupation)}/>
                            {title}
                        </label>
                    ))}
                    </div>
                </div>

                {/* Technique Checkbox Group */}
                <div className='checkbox-group'>
                    <label htmlFor="techniques">Techniques</label>
                    <div className='checkbox-items'>
                    {["Hip Hop", "Jazz", "Modern", "Ballet", "Contemporary"].map((technique, index) => (
                        <label key={index} className="checkbox-label">
                            <input type="checkbox" value={technique} checked={techniques.includes(technique)} onChange={(e) => handleCheckboxChange(e, setTechniques, techniques)}/>
                            {technique}
                        </label>
                    ))}
                    </div>
                </div>

            {/* Registration submission button */}
            <button type='submit'>
                Regsister
            </button>
            {/* Cancel sign up process ans return to LP */}
            <button type='button' onClick={() => navigate('/')}>
                Cancel
            </button>

            </form>

        </div>

    </>
  )
}

export default Registration
