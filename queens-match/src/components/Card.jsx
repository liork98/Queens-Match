import React from 'react';
import './Card.css'; // Make sure the path to your CSS file is correct

const Card = ({ profilePicture, firstName, lastName,phoneNumber, email, details, onClick }) => {

    return (
        <div className="card-container" onClick={onClick}>
            <img src={profilePicture} alt={`${firstName}'s profile`} className="profile-picture"/>
            <h2 className="card-name">{firstName} {lastName}</h2>
            <p className="card-email">{email}</p>
            <p className="card-details">{details}</p>
        </div>
    );
};

export default Card;
