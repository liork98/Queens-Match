import "./Footer.css";
import Button from "./Button.jsx";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
      <nav>
        <ul className="nav-list">
          {" "}
          {/* Added a class for styling the navigation */}
          <Button to="/contact">Contact</Button>
          <Button to="/about">About</Button>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
