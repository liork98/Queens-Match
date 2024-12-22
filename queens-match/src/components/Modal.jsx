import React from "react";
import "./Modal.css";
import Button from "./Button.jsx";

const Modal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null; // Don't render anything if not open or user is null

  // Use template literals correctly with backticks
  const profileImage = `${user.profile_picture}`;

  // WhatsApp link with the phone number (make sure it's in the international format)
  const whatsappLink = `https://wa.me/${user.phone_number}`;
  const mailtoLink = `mailto:${user.email}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>{`${user.first_name}'s profile`}</h2>
        <img
          src={`/assets/Avatars/${user.profile_picture}`}
          alt={`${user.first_name}'s profile`}
          className="profile-picture-large"
        />
        <p>Email: {user.email}</p>
        <p>Phone Number: {user.phone_number}</p>
        <p>Details: {user.details}</p>
        <p>Additional Info: {user.additional_info}</p>
        {/* Button to open WhatsApp chat */}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button>Chat on WhatsApp</Button>
        </a>
        <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
          <Button>Send Email</Button>
        </a>
      </div>
    </div>
  );
};

export default Modal;
