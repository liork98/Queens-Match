import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import axios from "axios";
import Button from "../components/Button.jsx";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    userType: "Mentee",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    company: "",
    jobTitle: "",
    details: "",
    additionalInfo: "",
    phone: "",
    programmingLanguages: [],
    linkedin: "",
    profilePicture: "",
  });

  const animatedComponents = makeAnimated();
  const [languagesOptions, setLanguagesOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewPicture, setPreviewPicture] = useState("");
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    phone: false,
    programmingLanguages: false,
    linkedin: false,
    profilePicture: false,
    jobTitle: false,
    additionalInformation: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData({
          additionalInformation: response.data.additional_info || "",
          company: response.data.company || "",
          details: response.data.details || "",
          firstName: response.data.first_name || "",
          jobTitle: response.data.job_title || "",
          username: response.data.username || "",
          email: response.data.email || "",
          phone: response.data.phone_number || "",
          programmingLanguages: response.data.programing_languages || [],
          linkedin: response.data.linkedin || "",
          profilePicture: response.data.profile_picture || "",
          userType: response.data.user_type === 1 ? "Mentor" : "Mentee",
        });
        console.log("USER DATA: ", response.data);

        setPreviewPicture(
          response.data.profile_picture ? response.data.profile_picture : "",
        );
      } catch (error) {
        console.error("Error fetching profile data:", error.response?.data);
      }
    };

    fetchProfile();
  }, []);

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
        console.log("Fetched languages:", languagesOptions);
      } catch (error) {
        console.error("Error fetching programming languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    console.log("File selected:", file); // Check if file is selected

    // Show a preview of the selected image
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewPicture(reader.result); // Preview the new uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("email", profileData.email);
      formData.append("username", profileData.username);
      formData.append("phone", profileData.phone);
      formData.append(
        "programmingLanguages",
        JSON.stringify(profileData.programmingLanguages),
      );
      formData.append("company", profileData.company);
      formData.append("details", profileData.details);
      formData.append(
        "additionalInformation",
        profileData.additionalInformation,
      );
      formData.append("jobTitle", profileData.jobTitle);
      formData.append("linkedin", profileData.linkedin);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5001/api/changeProfile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    }
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleLanguagesChange = (selectedOptions) => {
    setProfileData((prevData) => ({
      ...prevData,
      programmingLanguages: selectedOptions.map((option) => option.value),
    }));
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <div className="profile-container">
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          {previewPicture && (
            <img
              src={`/assets/Avatars/${previewPicture}`}
              alt="Profile Preview"
              className="profile-picture-large"
            />
          )}
          <div className="form-group">
            <label>Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group">
            <label>Username:</label>
            {isEditing.username ? (
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleChange}
              />
            ) : (
              <div>{profileData.username}</div>
            )}
            <Button type="button" onClick={() => toggleEdit("username")}>
              {isEditing.username ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="form-group">
            <label>Email:</label>
            {isEditing.email ? (
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
              />
            ) : (
              <div>{profileData.email}</div>
            )}
            <Button type="button" onClick={() => toggleEdit("email")}>
              {isEditing.email ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="form-group">
            <label>Phone:</label>
            {isEditing.phone ? (
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
              />
            ) : (
              <div>{profileData.phone}</div>
            )}
            <Button type="button" onClick={() => toggleEdit("phone")}>
              {isEditing.phone ? "Save" : "Edit"}
            </Button>
          </div>
          {profileData.userType === "Mentor" && (
            <div className="form-group">
              <label>Job Title:</label>
              {isEditing.jobTitle ? (
                <input
                  type="jobTitle"
                  name="jobTitle"
                  value={profileData.jobTitle}
                  onChange={handleChange}
                />
              ) : (
                <div>{profileData.jobTitle}</div>
              )}
              <Button type="button" onClick={() => toggleEdit("jobTitle")}>
                {isEditing.jobTitle ? "Save" : "Edit"}
              </Button>
            </div>
          )}

          <div className="form-group">
            <label>Details:</label>
            {isEditing.details ? (
              <input
                type="details"
                name="details"
                value={profileData.details}
                onChange={handleChange}
              />
            ) : (
              <div>{profileData.details}</div>
            )}
            <Button type="button" onClick={() => toggleEdit("details")}>
              {isEditing.details ? "Save" : "Edit"}
            </Button>
          </div>
          {profileData.userType === "Mentor" && (
            <div className="form-group">
              <label>Programming Languages:</label>
              <CreatableSelect
                value={languagesOptions.filter((option) =>
                  profileData.programmingLanguages.includes(option.value),
                )}
                isMulti
                onChange={handleLanguagesChange}
                options={languagesOptions}
                components={animatedComponents}
              />
            </div>
          )}

          <div className="form-group">
            <label>Additional Information:</label>
            {isEditing.additionalInformation ? (
              <input
                type="additionalInformation"
                name="additionalInformation"
                value={profileData.additionalInformation}
                onChange={handleChange}
              />
            ) : (
              <div>{profileData.additionalInformation}</div>
            )}
            <Button
              type="button"
              onClick={() => toggleEdit("additionalInformation")}
            >
              {isEditing.additionalInformation ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="form-group">
            <label>LinkedIn:</label>
            {isEditing.linkedin ? (
              <input
                type="url"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleChange}
              />
            ) : (
              <div>{profileData.linkedin}</div>
            )}

            <Button type="button" onClick={() => toggleEdit("linkedin")}>
              {isEditing.linkedin ? "Save" : "Edit"}
            </Button>
          </div>

          {/* Save Changes Button */}
          <Button type="submit" className="save-button">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
