import React from "react";
import "./Header.css";
import Button from "./Button.jsx";

const logoPath = `${process.env.PUBLIC_URL}/assets/QueenB_Logo_white.svg`;
const Header = () => {
  return (
    <header>
      <div className="header-container">
        {" "}
        <img src={logoPath} alt="Queen B Logo" className="header-logo" />
        <nav>
          <ul className="nav-list">
            <Button to="/home">Home</Button>
            <Button to="/about">About</Button>
            <Button to="/contact">Contact</Button>
            <Button to="/profilepage">Profile</Button>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
