import React from 'react';
import './Modal.css'; // Assuming you have CSS for modal styling

const Modal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null; // Don't render anything if not open or user is null

    // Use template literals correctly with backticks
    const profileImage = `${user.profile_picture}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{`${user.first_name}'s profile`}</h2>
                <img
                    src={profileImage}
                    alt={`${user.first_name}'s profile`}
                    className="profile-picture-large"
                />
                <p>Email: {user.email}</p>
                <p>Phone Number: {user.phone_number}</p>
                <p>Details: {user.details}</p>
                <p>Additional Info: {user.additional_info}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Modal;
