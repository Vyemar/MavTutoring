import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/component/TutorCard.module.css";
import { v4 as uuidv4 } from "uuid";

const TutorCard = ({ user }) => {
  return (
    <div className={styles.card}>
      <div className={styles.tutor}>
        <div className={styles.imageCrop}>
          <img
            className={styles.avatar}
            src="https://gravatar.com/avatar/3cee6af8588784b73feeca82f894957a?s=400&d=mp&r=x"
            alt=" "
          ></img>
        </div>
        <div className={styles.bio}>
          <div className={styles.name}>
            {user.firstName} {user.lastName}
          </div>
          <div className={styles.skills}>
            <div className={styles.skill}>Computer Graphics</div>
            <div className={styles.skill}>Computer Networks</div>
            <div className={styles.skill}>Calculus 2</div>
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
      <div className={styles.tutorTimingButton}>
        <div className={styles.timings}>
          {user.availability.map((avail) => (
            <div className={styles.timing} key={uuidv4()}>
              {avail.day} - {avail.time}
            </div>
          ))}
        </div>
        <div className={styles.tutorButtons}>
          <button className={styles.tutorButton}>Rate</button>
          <button className={styles.tutorButton}>Profile</button>
        </div>
      </div>
    </div>
  );
};

TutorCard.propTypes = { user: PropTypes.object.isRequired };

export default TutorCard;
