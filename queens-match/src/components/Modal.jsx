import React, { useState } from "react";
import "./Modal.css";
import Button from "./Button.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for the calendar

const Modal = ({ isOpen, onClose, user }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);

  if (!isOpen || !user) {
    return null;
  }

  const whatsappLink = `https://wa.me/${user.phone_number}`;
  const mailtoLink = `mailto:${user.email}`;

  const handleCreateAppointment = () => {
    setAppointmentModalOpen(true); // Open the appointment scheduling modal
  };

  const handleScheduleAppointment = () => {
    if (selectedDate) {
      // Show the new confirmation message for the mentor's acceptance
      alert(`An invitation email has been sent to ${user.first_name}. 
      The mentor will need to accept the invitation before the appointment is confirmed.`);

      // Here you would typically handle sending the email (e.g., using an API or backend logic)
      // For now, we are just displaying a message

      setAppointmentModalOpen(false); // Close the modal after appointment is scheduled
    } else {
      alert("Please select a date and time.");
    }
  };

  const handleCloseAppointmentModal = () => {
    setAppointmentModalOpen(false);
  };

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
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button>Chat on WhatsApp</Button>
        </a>
        <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
          <Button>Send Email</Button>
        </a>

        <Button onClick={handleCreateAppointment}>Schedule Appointment</Button>
      </div>

      {isAppointmentModalOpen && (
        <div className="modal-overlay" onClick={handleCloseAppointmentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseAppointmentModal}>
              X
            </button>
            <h2>Schedule Appointment with {user.first_name}</h2>

            <div className="appointment-date-time">
              <label>Select Appointment Date and Time</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                showTimeSelect
                dateFormat="Pp"
                timeFormat="HH:mm"
                timeIntervals={15}
                minDate={new Date()}
                showMonthYearDropdown
              />
            </div>

            <Button onClick={handleScheduleAppointment}>
              Confirm Appointment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
