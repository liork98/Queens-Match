import "./MenteeDashboard.css";
import React, { useState } from "react";
import Appointments from "../components/Dashboard/Appointments.jsx";

// Components for different sections of the dashboard
function DashboardOverview() {
  return <h2>Welcome to your Dashboard</h2>;
}

function SentEmails() {
  return <h2>Your Sent Emails</h2>;
}

function ProfileSettings() {
  return <h2>Profile Settings</h2>;
}

// Main Dashboard Component
export default function MenteeDashboardPage() {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard-container">
      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <ul>
          <li>
            <button
              className={activeTab === "overview" ? "active-tab" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
          </li>
          <li>
            <button
              className={activeTab === "emails" ? "active-tab" : ""}
              onClick={() => setActiveTab("emails")}
            >
              Sent Emails
            </button>
          </li>
          <li>
            <button
              className={activeTab === "appointments" ? "active-tab" : ""}
              onClick={() => setActiveTab("appointments")}
            >
              Appointments
            </button>
          </li>
          <li>
            <button
              className={activeTab === "settings" ? "active-tab" : ""}
              onClick={() => setActiveTab("settings")}
            >
              Profile Settings
            </button>
          </li>
        </ul>
      </nav>

      {/* Tab Content */}
      <main className="dashboard-content">
        {activeTab === "overview" && <DashboardOverview />}
        {activeTab === "emails" && <SentEmails />}
        {activeTab === "appointments" && <Appointments />}
        {activeTab === "settings" && <ProfileSettings />}
      </main>
    </div>
  );
}
