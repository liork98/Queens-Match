import React, { useContext, useState } from "react";
import "./Modal.css";
import Button from "./Button.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext.js";

const AppointmentModal = ({ isOpen, onClose, user, currentUserId }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(AuthContext);

  if (!isOpen || !user) {
    return null;
  }

  // Schedule an appointment and send data to the backend
  const handleScheduleAppointment = async () => {
    if (!selectedDate) {
      alert("Please select a date and time.");
      return;
    }

    setLoading(true); // Start loading
    console.log(userData);
    try {
      console.log({
        menteeId: userData.id, // The logged-in user (mentee)
        mentorId: currentUserId, // The mentor
        appointmentDate: selectedDate.toISOString(), // Send date as ISO string
      });

      const response = await axios.post(
        "http://localhost:5001/api/scheduleAppointment",
        {
          menteeId: userData.id, // The logged-in user (mentee)
          mentorId: currentUserId, // The mentor
          appointmentDate: selectedDate.toISOString(), // Send date as ISO string
        },
      );

      if (response.status === 201) {
        alert("Appointment scheduled successfully!");
      } else {
        alert("Failed to schedule appointment. Please try again.");
      }

      onClose(); // Close the appointment modal
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Failed to schedule appointment. Please try again.");
    } finally {
      setLoading(false); // End loading
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
            dateFormat="Pp" // Combines the date and time format
            timeFormat="HH:mm"
            timeIntervals={15} // Time selection in intervals of 15 minutes
            minDate={new Date()} // Prevent past dates
            filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6} // Optional: Disable weekends
            showMonthYearDropdown
          />
        </div>

        <Button onClick={handleScheduleAppointment} disabled={loading}>
          {loading ? "Scheduling..." : "Confirm Appointment"}
        </Button>
      </div>
    </div>
  );
};

export default AppointmentModal;
