import React, { useState } from "react";
import "./Modal.css";
import Button from "./Button.jsx";
import AppointmentModal from "./AppointmentModal.jsx";

const Modal = ({ isOpen, onClose, user, currentUserId }) => {
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false); // For appointment modal

  if (!isOpen || !user) {
    return null;
  }

  const whatsappLink = `https://wa.me/${user.phone_number}`;
  const mailtoLink = `mailto:${user.email}`;

  // Open the appointment modal
  const handleCreateAppointment = () => {
    setAppointmentModalOpen(true);
  };

  // Close the appointment modal
  const handleCloseAppointmentModal = () => {
    setAppointmentModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Main Modal Content */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>{`${user.first_name}'s Profile`}</h2>
        <img
          src={`/assets/${user.profile_picture}`}
          alt={`${user.first_name}'s profile`}
          className="profile-picture-large"
        />
        <p>Email: {user.email}</p>
        <p>Phone Number: {user.phone_number}</p>
        <p>Details: {user.details}</p>
        <p>Additional Info: {user.additional_info}</p>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button>Chat on WhatsApp</Button>
        </a>
        <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
          <Button>Send Email</Button>
        </a>

        <Button onClick={handleCreateAppointment}>Schedule Appointment</Button>
      </div>

      {isAppointmentModalOpen && (
        <AppointmentModal
          isOpen={isAppointmentModalOpen}
          onClose={handleCloseAppointmentModal}
          user={user}
          currentUserId={user.id}
        />
      )}
    </div>
  );
};

export default Modal;
