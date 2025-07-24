import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import styles from '../../styles/Feedback.module.css';


const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('/api/feedback') // adjust endpoint as needed
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(console.error);
  }, []);

  return (
    <div className="admin-layout" style={{ display: 'flex' }}>
      <AdminSidebar selected="admin-reviews" />
      <main className={styles.reviewsBackground}>
        <div className={styles.reviewsContainer}>
          <h1 className={styles.reviewsTitle}>Tutor Reviews</h1>
          {reviews.length === 0 ? (
            <p>No reviews found.</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className={styles.reviewCard}>
                <p>
                  <span className={styles.reviewLabel}>Tutor: </span>
                  {review.tutorUniqueId
                    ? `${review.tutorUniqueId.firstName || ''} ${review.tutorUniqueId.lastName || ''}`.trim()
                    : 'Unknown'}
                </p>
                <p>
                  <span className={styles.reviewLabel}>Student: </span>
                  {review.studentUniqueId
                    ? `${review.studentUniqueId.firstName || ''} ${review.studentUniqueId.lastName || ''}`.trim()
                    : 'Unknown'}
                </p>
                <p>
                  <span className={styles.reviewLabel}>Rating: </span>
                  {review.rating} / 5
                </p>
                <p>
                  <span className={styles.reviewLabel}>Feedback: </span>
                  <span className={styles.reviewText}>{review.feedbackText}</span>
                </p>
                <p className={styles.reviewDate}>
                  Submitted on: {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReviews;
