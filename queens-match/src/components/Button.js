import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css'; // Optional: Create a CSS file for button styling

const Button = ({ children, to, type = 'button', className = '', ...props }) => {
    // If a `to` prop is passed, render a `Link`; otherwise, render a button
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
