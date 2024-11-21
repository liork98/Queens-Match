import React, { useState } from 'react';
import './RegisterPage.css'; // Ensure you create this CSS file to style the register page
import Button from "../components/Button"; // Import Button component
import FieldToFill from "../components/FieldToFill"; // Import FieldToFill component
import axios from "axios";

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [first_name, setFirstName] = useState(''); // Correctly declared state for first name
    const [last_name, setLastName] = useState(''); // Added last name state
    const [phone_number, setPhoneNumber] = useState(''); // Added phone number state
    const [linkedin, setLinkedin] = useState(''); // Added linkedin state
    const [details, setDetails] = useState('');
    const [additional_info, setAdditionalInfo] = useState(''); // Updated to camel case
    const [avatar, setAvatar] = useState('avatar1.jpg'); // State for avatar selection
    const [userType, setUserType] = useState('mentee'); // State for user type (mentor or mentee)
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error message
        setSuccess(''); // Clear any previous success message

        if (username && email && password && phone_number && first_name && last_name) { // Check all required fields
            try {
                // Send a POST request to the backend API for registration
                const response = await axios.post('http://localhost:5001/register', {
                    user_type: userType === 'mentor' ? 1 : 0, // 1 for mentor, 0 for mentee
                    username,
                    email,
                    password,
                    first_name,
                    last_name,
                    phone_number,
                    linkedin,
                    details,
                    additional_info, // Corrected variable name to match state
                    profile_picture: avatar // Include selected avatar
                });

                // Handle successful registration
                setSuccess('Registration successful! You can now log in.');
                // Reset fields
                setUsername('');
                setEmail('');
                setPassword('');
                setFirstName('');
                setLastName('');
                setPhoneNumber('');
                setLinkedin(''); // Updated variable name to match state
                setDetails('');
                setAdditionalInfo('');
                setAvatar('avatar1.jpg'); // Reset avatar to default
                setUserType('mentee'); // Reset user type to default
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                    if (error.response.status === 400) {
                        setError('Bad request. Please check your input.');
                    } else if (error.response.status === 409) {
                        setError('Username or email already exists. Please try another.');
                    } else {
                        setError('An error occurred. Please try again later.');
                    }
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    setError('No response from server. Please try again later.');
                } else {
                    console.error('Error setting up request:', error.message);
                    setError('An error occurred. Please try again later.');
                }
            }
        } else {
            setError('Please fill in all fields.');
        }
    };

    return (
        <div className="register-page">
            <h1>Queen's Match</h1>
            <div className="register-container">
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <FieldToFill
                            label="Username:"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="Email:"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="Password:"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="First Name:"
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="Last Name:"
                            type="text"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="Phone Number:"
                            type="text"
                            value={phone_number}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="Linkedin Profile:"
                            type="text"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="Details:"
                            type="text"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="Additional Info:"
                            type="text"
                            value={additional_info}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    {/* Avatar Selection */}
                    <div className="form-group">
                        <label htmlFor="avatar">Choose an Avatar:</label>
                        <select
                            id="avatar"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                        >
                            <option value="avatar1.jpg">Avatar 1</option>
                            <option value="avatar2.jpg">Avatar 2</option>
                            <option value="avatar3.jpg">Avatar 3</option>
                            <option value="avatar4.jpg">Avatar 4</option>
                            <option value="avatar5.jpg">Avatar 5</option>
                            <option value="avatar6.jpg">Avatar 6</option>
                            <option value="avatar7.jpg">Avatar 7</option>
                            <option value="avatar8.jpg">Avatar 8</option>
                        </select>
                    </div>
                    {/* User Type Selection */}
                    <div className="form-group">
                        <label>User Type:</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    value="mentor"
                                    name="user_type"
                                    onChange={(e) => setUserType(e.target.value)} // Update the state with the selected user type
                                    required
                                />
                                Mentor
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="mentee"
                                    name="user_type"
                                    onChange={(e) => setUserType(e.target.value)} // Update the state with the selected user type
                                    required
                                />
                                Mentee
                            </label>
                        </div>
                    </div>
                    <Button type="submit" className="submit-button">Register</Button>
                </form>
                <p>Already have an account? <a href="/login">Log In</a></p>
            </div>
        </div>
    );
};

export default RegisterPage;
