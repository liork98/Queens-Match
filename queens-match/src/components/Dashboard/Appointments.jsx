import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext.js";
import "./Appointments.css";

export default function Appointments() {
  const { userData } = useContext(AuthContext); // Context for the logged-in user
  const [appointments, setAppointments] = useState([]); // State to store appointments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch appointments from the backend
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments for user:", userData.id);
        const response = await axios.get(
          `http://localhost:5001/api/appointments/${userData.id}`,
        );
        setAppointments(response.data); // Store appointments in state
        setLoading(false); // Stop loading
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again.");
        setLoading(false); // Stop loading even if there's an error
      }
    };
    console.log("About to fetch appointments");

    if (userData) {
      fetchAppointments();
    }
  }, [userData]); // Re-run if the user data changes

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
