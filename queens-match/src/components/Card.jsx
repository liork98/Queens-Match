import "./Card.css";

const Card = ({
  firstName,
  lastName,
  username,
  profilePicture,
  email,
  details,
  onClick,
}) => {
  return (
    <div className="card-container" onClick={onClick}>
      {profilePicture ? (
        <img
          src={profilePicture}
          alt={`${firstName}'s profile`}
          className="profile-picture"
        />
      ) : (
        <div className="profile-picture-placeholder">Loading...</div>
      )}
      <h2 className="card-name">
        {firstName} {lastName}
      </h2>
      <p className="card-email">{email}</p>
      <p className="card-details">{details}</p>
    </div>
  );
};

export default Card;
