import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

const Button = ({
  children,
  to,
  type = "button",
  className = "",
  ...props
}) => {
  if (to) {
    return (
      <Link to={to} className={`custom-button ${className}`} {...props}>
        {children}
      </Link>
    );
  }

  // Render a regular button if no `to` prop is passed
  return (
    <button type={type} className={`custom-button ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
