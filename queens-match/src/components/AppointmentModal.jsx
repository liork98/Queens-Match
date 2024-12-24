import React, { useState } from "react";
import "./Modal.css";
import Button from "./Button.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for the calendar

const AppointmentModal = ({ isOpen, onClose, user, onScheduleAppointment }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  if (!isOpen || !user) {
    return null;
  }

  const handleScheduleAppointment = () => {
    if (selectedDate) {
      // Instead of directly scheduling, inform the user about the email
      alert(`An invitation email has been sent to ${user.first_name}. 
      The mentor will need to accept the invitation before the appointment is confirmed.`);

      // Call the callback function to handle any additional scheduling logic (like sending an email)
      onScheduleAppointment(selectedDate);
      onClose(); // Close the modal after scheduling
    } else {
      alert("Please select a date and time.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>Schedule Appointment with {user.first_name}</h2>

        <div className="appointment-date-time">
          <label>Select Appointment Date and Time</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            showTimeSelect
            dateFormat="Pp" // This combines the date and time format
            timeFormat="HH:mm"
            timeIntervals={15} // Time selection in intervals of 15 minutes
            minDate={new Date()} // Prevent past dates
            filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} // Disable weekends (optional)
            showMonthYearDropdown
          />
        </div>

        <Button onClick={handleScheduleAppointment}>Confirm Appointment</Button>
      </div>
    </div>
  );
};

export default AppointmentModal;
