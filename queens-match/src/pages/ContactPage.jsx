import React from "react";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <div className="contact-container">
        <h2>Get in Touch</h2>
        <p>
          If you have any questions, suggestions, or need assistance, feel free
          to reach out to us!
        </p>

        <h3>Contact Information</h3>
        <ul className="contact-info">
          <li>
            <strong>Email:</strong>
            <a href="mailto:info@queensmatch.com"> info@queensmatch.com</a>
          </li>
          <li>
            <strong>Phone:</strong>
            <a href="tel:+972 524641985"> +972524641985</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactPage;
