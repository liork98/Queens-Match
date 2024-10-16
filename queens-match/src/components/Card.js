import React from 'react';
import './Card.css'; // Make sure the path to your CSS file is correct

const Card = ({ profilePicture, name, email, details, onClick }) => {
    // Provide a default profile picture if profilePicture is null or undefined
    const profileImage = profilePicture
        ? `./assets/Avatars/${profilePicture}` // Adjust path based on your assets location
        : '/assets/Avatars/avatar1.jpg'; // Default avatar image

    return (
        <div className="card-container" onClick={onClick}>
            <img src={profileImage} alt={`${name}'s profile`} className="profile-picture" />
            <h2 className="card-name">{name}</h2>
            <p className="card-email">{email}</p>
            <p className="card-details">{details}</p>
        </div>
    );
};

export default Card;
