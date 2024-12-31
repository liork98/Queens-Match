import { useContext, useState } from "react";
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

  const handleScheduleAppointment = async () => {
    if (!selectedDate) {
      alert("Please select a date and time.");
      return;
    }

    setLoading(true);
    console.log(userData);
    try {
      console.log({
        menteeId: userData.id,
        mentorId: currentUserId,
        appointmentDate: selectedDate.toISOString(),
      });

      const response = await axios.post(
        "http://localhost:5001/api/scheduleAppointment",
        {
          menteeId: userData.id,
          mentorId: currentUserId,
          appointmentDate: selectedDate.toISOString(),
        },
      );

      if (response.status === 201) {
        alert("Appointment scheduled successfully!");
      } else {
        alert("Failed to schedule appointment. Please try again.");
      }

      onClose();
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      alert("Failed to schedule appointment. Please try again.");
    } finally {
      setLoading(false);
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
            dateFormat="Pp"
            timeFormat="HH:mm"
            timeIntervals={15}
            minDate={new Date()}
            filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6}
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
