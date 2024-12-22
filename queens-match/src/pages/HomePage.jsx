import React, { useState, useEffect } from "react";
import Card from "../components/Card.jsx";
import Modal from "../components/Modal.jsx";
import "./HomePage.css";

const HomePage = () => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/users");
        console.log("Response before json:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received user data:", data);

        setUserProfiles(data);
        setFilteredProfiles(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredProfiles(userProfiles);
    } else {
      const filtered = userProfiles.filter(
        (user) =>
          user.first_name && user.first_name.toLowerCase().includes(query),
      );
      setFilteredProfiles(filtered);
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
  console.log("filtered users: " + JSON.stringify(filteredProfiles, null, 2));

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
          filteredProfiles.map((user) => (
            <Card
              key={user.id}
              profilePicture={`/assets/Avatars/${user.profile_picture}`}
              firstName={user.first_name}
              lastName={user.last_name}
              email={user.email}
              phoneNumber={user.phone_number}
              details={user.details}
              username={user.username}
              onClick={() => handleCardClick(user)}
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
