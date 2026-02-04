import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";

const RequestCard = ({ picture, bio, name, skills, rating, username }) => {
  console.log(skills);
  return (
    <div className="card-container">
      <img className="img-container" src={picture || "https://via.placeholder.com/150"} alt="user" />
      <h3>{name || "User"}</h3>
      <h6>Rating : {rating || 0}</h6>
      <p>{bio || "No bio available"}</p>
      <div className="prof-buttons">
        <Link to={`/profile/${username}`}>
          <button className="primary ghost">View Profile</button>
        </Link>
      </div>
      {skills && skills.length > 0 && (
        <div className="profskills">
          <h6>Skills</h6>
          <div className="profskill-boxes">
            {skills.map((skill, index) => (
              <div key={index} className="profskill-box">
                <span className="skill">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
