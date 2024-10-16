import React, { useState } from 'react';
import './RegisterPage.css'; // Ensure you create this CSS file to style the register page
import Button from "../components/Button"; // Import Button component
import FieldToFill from "../components/FieldToFill"; // Import FieldToFill component
import axios from "axios";

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [details, setDetails] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error message
        setSuccess(''); // Clear any previous success message

        if (username && email && password) {
            try {
                // Send a POST request to the backend API for registration
                console.log(username, email, password)
                const response = await axios.post('/register', {
                    username,
                    email,
                    password,
                });
                // Handle successful registration
                setSuccess('Registration successful! You can now log in.');
                setUsername('');
                setEmail('');
                setPassword('');
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
                            label="Name:"
                            type="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="Details::"
                            type="details"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FieldToFill
                            label="Additional Info:"
                            type="additional_info"
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <Button type="submit" className="submit-button">Register</Button>
                </form>
                <p>Already have an account? <a href="/login">Log In</a></p>
            </div>
        </div>
    );
};

export default RegisterPage;
