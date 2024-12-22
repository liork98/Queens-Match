// src/pages/UserProfilePage.js
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './HomePage.css'; // Make sure to import your CSS file

const HomePage = () => {
    const [userProfiles, setUserProfiles] = useState([]); // State to hold user profiles
    const [filteredProfiles, setFilteredProfiles] = useState([]); // State for filtered profiles based on search
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

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
                setFilteredProfiles(data); // Set initial filtered profiles
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUsers();
    }, []);

    // Handle search input change
    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase(); // Convert to lowercase for case-insensitive search
        setSearchQuery(query);

        // If the search query is empty, show all user profiles
        if (query === '') {
            setFilteredProfiles(userProfiles);
        } else {
            // Filter user profiles by name based on search query
            const filtered = userProfiles.filter(user =>
                user.first_name && user.first_name.toLowerCase().includes(query) // Check if user.name is defined
            );
            setFilteredProfiles(filtered); // Update the filtered profiles
        }
    };

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
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by first name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>
            <div className="card-list">
                {filteredProfiles.length > 0 ? (
                    filteredProfiles.map(user => (
                        <Card
                            key={user.id} // Unique key for each card
                            profilePicture={user.profile_picture} // Map profile_picture field
                            firstName={user.first_name}                      // Map name field
                            lastName={user.last_name} // Map name field
                            email={user.email}                    // Map email field
                            phoneNumber={user.phone_number} // Map phone
                            details={user.details}                // Map details field
                            onClick={() => handleCardClick(user)} // Handle click event
                        />
                    ))
                ) : (
                    <p>No user profiles found.</p>
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
