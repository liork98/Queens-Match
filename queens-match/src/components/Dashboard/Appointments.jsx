import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext.js";
import "./Appointments.css";

export default function Appointments() {
  const { userData } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments for user:", userData.id);
        const response = await axios.get(
          `http://localhost:5001/api/appointments/${userData.id}`,
        );
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
        setLoading(false);
      }
    };
    console.log("About to fetch appointments");

    if (userData) {
      fetchAppointments();
    }
  }, [userData]);

  if (loading) {
    return <div>Loading your appointments...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <h2>Your Appointments</h2>
      <div className="appointments-container">
        {appointments.length === 0 ? (
          <p>You have no upcoming appointments.</p>
        ) : (
          <ul className="appointments-list">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="appointment-item">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appointment.appointment_date).toLocaleString()}
                </p>
                <p>
                  <strong>With:</strong>{" "}
                  {appointment.mentor_name || appointment.mentee_name}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
