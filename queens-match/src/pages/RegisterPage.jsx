import React, { useState, useEffect } from "react";
import "./RegisterPage.css";
import Button from "../components/Button.jsx";
import FieldToFill from "../components/FieldToFill.jsx";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [details, setDetails] = useState("");
  const [additional_info, setAdditionalInfo] = useState("");
  const [avatar, setAvatar] = useState("avatar1.jpg");
  const [userType, setUserType] = useState("Mentee");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [languages, setLanguages] = useState([]); // State for selected programming languages
  const [languagesOptions, setLanguagesOptions] = useState([]); // State for selected programming languages

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/languages");

        const options = response.data.map((lang) => ({
          key: lang.key,
          label: lang.name,
          value: lang.name,
        }));
        setLanguagesOptions(options);
      } catch (error) {
        console.error("Error fetching programming languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error message
    setSuccess(""); // Clear any previous success message

    if (
      username &&
      email &&
      password &&
      phone_number &&
      first_name &&
      last_name
    ) {
      try {
        const response = await axios.post("http://localhost:5001/register", {
          user_type: userType === "Mentor" ? 1 : 0, // 1 for mentor, 0 for mentee
          username,
          email,
          password,
          first_name,
          last_name,
          phone_number,
          linkedin,
          details,
          additional_info,
          profile_picture: avatar,
          languages: languages.map((lang) => lang.value),
        });

        setSuccess("Registration successful! You can now log in.");
        setUsername("");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setLinkedin("");
        setDetails("");
        setAdditionalInfo("");
        setAvatar("avatar1.jpg");
        setUserType("Mentor");
        setLanguages([]);
      } catch (error) {
        if (error.response) {
          console.error("Server responded with an error:", error.response.data);
          if (error.response.status === 400) {
            setError("Bad request. Please check your input.");
          } else if (error.response.status === 409) {
            setError("Username or email already exists. Please try another.");
          } else {
            setError("An error occurred. Please try again later.");
          }
        } else if (error.request) {
          console.error("No response received:", error.request);
          setError("No response from server. Please try again later.");
        } else {
          console.error("Error setting up request:", error.message);
          setError("An error occurred. Please try again later.");
        }
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <div className="register-page">
      <h1>Queen's Match</h1>
      <div className="register-container">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>User Type:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="Mentor"
                  name="user_type"
                  onChange={(e) => setUserType(e.target.value)}
                  required
                />
                Mentor
              </label>
              <label>
                <input
                  type="radio"
                  value="Mentee"
                  name="user_type"
                  onChange={(e) => setUserType(e.target.value)}
                  required
                />
                Mentee
              </label>
            </div>
          </div>
          <div className="form-group">
            <FieldToFill
              label="Username:"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              required
            />
          </div>
          <div className="form-group">
            <FieldToFill
              label="Email:"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
            />
          </div>
          <div className="form-group">
            <FieldToFill
              label="Password:"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
            />
          </div>
          <div className="form-group">
            <FieldToFill
              label="First Name:"
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder=""
              required
            />
          </div>
          <div className="form-group">
            <FieldToFill
              label="Last Name:"
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              placeholder=""
              required
            />
          </div>
          <div className="form-group">
            <FieldToFill
              label="Phone Number:"
              type="text"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder=""
              required
            />
          </div>
          {userType !== "Mentor" && (
            <div className="form-group">
              <FieldToFill
                label="Linkedin Profile:"
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder=""
              />
            </div>
          )}
          <div className="form-group">
            <FieldToFill
              label="Details:"
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder=""
              required
            />
          </div>
          {userType === "Mentor" && (
            <div className="form-group">
              <label>Programming Languages You Know:</label>
              <CreatableSelect
                isMulti
                name="languages"
                //name={userType}
                options={languagesOptions}
                components={animatedComponents}
              />
            </div>
          )}

          <div className="form-group">
            <FieldToFill
              label="Additional Info:"
              type="text"
              value={additional_info}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder=""
            />
          </div>
          <div className="form-group">
            <label htmlFor="avatar">Choose an Avatar:</label>
            <select
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            >
              <option value="avatar1.jpg">Avatar 1</option>
              <option value="avatar2.jpg">Avatar 2</option>
              <option value="avatar3.jpg">Avatar 3</option>
              <option value="avatar4.jpg">Avatar 4</option>
              <option value="avatar5.jpg">Avatar 5</option>
              <option value="avatar6.jpg">Avatar 6</option>
              <option value="avatar7.jpg">Avatar 7</option>
              <option value="avatar8.jpg">Avatar 8</option>
            </select>
          </div>

          <Button type="submit" className="submit-button">
            Register
          </Button>
        </form>
        <p>
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
