import { useState, useEffect } from "react";
import Card from "../components/Card.jsx";
import Modal from "../components/Modal.jsx";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [userProfiles, setUserProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/users");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("User already logged in, navigating to /home...");
      navigate("/");
    }
  }, [navigate]);

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

      <ul className="card-list">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((user) => (
            <li key={user.id}>
              <Card
                profilePicture={`assets/${user.profile_picture}`}
                firstName={user.first_name}
                lastName={user.last_name}
                email={user.email}
                phoneNumber={user.phone_number}
                details={user.details}
                username={user.username}
                onClick={() => handleCardClick(user)}
              />
            </li>
          ))
        ) : (
          <p>No user profiles found.</p>
        )}
      </ul>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
};

export default HomePage;
