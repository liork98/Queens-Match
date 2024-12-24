import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import Button from "./Button.jsx";
import { AuthContext } from "../contexts/AuthContext.js";

const logoPath = `${process.env.PUBLIC_URL}/assets/QueenB_Logo_white.svg`;
const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header>
      <div className="header-container">
        <img src={logoPath} alt="Queen B Logo" className="header-logo" />
        <nav>
          <ul className="nav-list">
            {user ? (
              <Button to="/home">Home</Button>
            ) : (
              <Button to="/">Home</Button>
            )}
            <Button to="/about">About</Button>
            <Button to="/contact">Contact</Button>
            {user && <Button to="/profilepage">Profile</Button>}
            {user && <Button onClick={handleLogout}>Logout</Button>}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
