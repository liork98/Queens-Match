// src/pages/UserProfilePage.js
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './HomePage.css'; // Make sure to import your CSS file

const HomePage = () => {
    const [userProfiles, setUserProfiles] = useState([]); // State to hold user profiles
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch user profiles from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/users');
                console.log('Response before json:', response);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();  // This should only be called once
                console.log('Received user data:', data);  // Log received data

                setUserProfiles(data);  // Set user profiles state
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleCardClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="user-profile-page">
            <h1>User Profiles</h1>
            <div className="card-list">
                {userProfiles.length > 0 ? (
                    userProfiles.map(user => (
                        <Card
                            key={user.id} // Unique key for each card
                            profilePicture={user.profile_picture} // Map profile_picture field
                            name={user.name}                      // Map name field
                            email={user.email}                    // Map email field
                            phoneNumber={user.phone_number} // Map phone
                            details={user.details}                // Map details field
                            onClick={() => handleCardClick(user)} // Handle click event
                        />
                    ))
                ) : (
                    <p>No user profiles available.</p>
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                user={selectedUser}
            />
        </div>
    );

};

export default HomePage;
