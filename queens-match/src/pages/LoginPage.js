import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './LoginPage.css';
import Button from "../components/Button"; // Import Button component
import FieldToFill from "../components/FieldToFill"; // Import FieldToFill component
import axios from "axios";


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // Initialize navigate
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error message
        setSuccess(''); // Clear any previous success message

        if (username && password) {
            try {
                // Send a POST request to the backend API for login
                const response = await axios.post('/login', {
                    username,
                    password,
                });

                // Handle successful login
                const { token } = response.data; // Assuming your API returns a token
                setSuccess(`Logged in as ${username}. Token: ${token}`);
                localStorage.setItem('token', response.data.token);
                alert(`Logged in successfully!`);
                setTimeout(() => {}, 1000);
                navigate('/home');
                // Perform any other action after successful login, e.g., redirect or save token
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                    if (error.response.status === 401) {
                        setError('Invalid credentials. Please try again.');
                    } else if (error.response.status === 403) {
                        setError('You do not have permission to access this resource.');
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
            setError('Please enter both username and password.');
        }
    };

    return (
        <div className="login-page">
            <h1>Queens Match</h1>
            <div className="login-container">
                {error && <p className="error">{error}</p>}
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
                            label="Password:"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            required
                        />
                    </div>
                    <Button type="submit" className="submit-button">Login</Button>
                </form>
                <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </div>
        </div>
    );
};

export default LoginPage;
