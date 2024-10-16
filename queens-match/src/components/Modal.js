import React from 'react';
import './Modal.css'; // Assuming you have CSS for modal styling

const Modal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null; // Don't render anything if not open or user is null

    // Provide a default profile picture if profilePicture is null or undefined
    const profileImage = user.profilePicture
        ? `/assets/Avatars/${user.profilePicture}` // Adjust the path as needed
        : '/assets/Avatars/avatar3.jpg'; // Default avatar image

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{user.name}</h2>
                <img src={profileImage} alt={`${user.name}'s profile`} className="profile-picture-large" />
                <p>Email: {user.email}</p>
                <p>Details: {user.details}</p>
                <p>Additional Info: {user.additional_info}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
