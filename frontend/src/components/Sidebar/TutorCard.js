import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Feedback from "../../pages/student/Feedback";
import FindMyTutorProfile from "../../pages/student/FindmyTutorProfile";
import styles from "../../styles/component/TutorCard.module.css";
import { v4 as uuidv4 } from "uuid";

const TutorCard = ({ user }) => {
  const navigate = useNavigate(); //Define navigate

  // Get profile picture URL, fallback to default avatar if not available
  const getProfilePicture = () => {
    if (user.profile && user.profile.profilePicture) {
      return user.profile.profilePicture;
    }
    return "https://gravatar.com/avatar/3cee6af8588784b73feeca82f894957a?s=400&d=mp&r=x";
  };

  // Get courses from profile if available
  const getCourses = () => {
    if (user.profile && user.profile.courses) {
      return user.profile.courses.split(",").map((course) => course.trim());
    }
    return ["None"]; //Emptyr Array
  };

  return (
    <div className={styles.card}>
      <div className={styles.tutor}>
        <div className={styles.imageCrop}>
          <img
            className={styles.avatar}
            src={getProfilePicture()}
            alt={`${user.firstName} ${user.lastName}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://gravatar.com/avatar/3cee6af8588784b73feeca82f894957a?s=400&d=mp&r=x";
            }}
          />
        </div>
        <div className={styles.bio}>
          <div className={styles.name}>
            {user.firstName} {user.lastName}
          </div>
          <div className={styles.skills}>
            {getCourses().map((course) => (
              <div className={styles.skill} key={uuidv4()}>
                {course}
              </div>
            ))}
          </div>
          <div className={styles.ratings}>
            <i
              className={
                user.rating >= 1
                  ? `fa fa-star ${styles.color}`
                  : `fa-regular fa-star ${styles.color}`
              }
            ></i>
            <i
              className={
                user.rating >= 2
                  ? `fa fa-star ${styles.color}`
                  : `fa-regular fa-star ${styles.color}`
              }
            ></i>
            <i
              className={
                user.rating >= 3
                  ? `fa fa-star ${styles.color}`
                  : `fa-regular fa-star ${styles.color}`
              }
            ></i>
            <i
              className={
                user.rating >= 4
                  ? `fa fa-star ${styles.color}`
                  : `fa-regular fa-star ${styles.color}`
              }
            ></i>
            <i
              className={
                user.rating >= 5
                  ? `fa fa-star ${styles.color}`
                  : `fa-regular fa-star ${styles.color}`
              }
            ></i>
            <span className={styles.ratingNum}>{user.rating}</span>
          </div>
        </div>
      </div>
      <hr className={styles.separater}></hr>
      <div className={styles.tutorButtons}>
        <button
          className={styles.tutorButton}
          onClick={() => navigate("/feedback")}
        >
          Rate
        </button>
        <button
          className={styles.tutorButton}
          onClick={() => navigate(`/FindMyTutorProfile/${user._id}`)}
        >
          Profile
        </button>
      </div>
    </div>
  );
};

TutorCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    rating: PropTypes.number,
    profile: PropTypes.shape({
      profilePicture: PropTypes.string,
      courses: PropTypes.string,
    }),
  }).isRequired,
};

export default TutorCard;
