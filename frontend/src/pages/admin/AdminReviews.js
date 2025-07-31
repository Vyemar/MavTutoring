import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import styles from '../../styles/Feedback.module.css';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(console.error);
  }, []);

  return (
    <div className="admin-layout" style={{ display: 'flex' }}>
      <AdminSidebar selected="admin-reviews" />
      <main className={styles.reviewsBackground}>
        {/* Left Review List */}
        <div className={styles.reviewsContainer}>
          <h1 className={styles.reviewsTitle}>Tutor Reviews</h1>
          {reviews.length === 0 ? (
            <p>No reviews found.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className={styles.reviewCard}
                onClick={() => setSelectedReview(review)}
                style={{ cursor: 'pointer' }}
              >
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
                  <span className={styles.starsDisplay}>
                    {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                  </span>
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

        {/* Right Expanded Review Panel */}
        {selectedReview && (
          <div className={styles.detailCard}>
            <h2>Review Details</h2>
            <p>
              <strong>Tutor:</strong>{' '}
              {selectedReview.tutorUniqueId
                ? `${selectedReview.tutorUniqueId.firstName || ''} ${selectedReview.tutorUniqueId.lastName || ''}`.trim()
                : 'Unknown'}
            </p>
            <p>
              <strong>Student:</strong>{' '}
              {selectedReview.studentUniqueId
                ? `${selectedReview.studentUniqueId.firstName || ''} ${selectedReview.studentUniqueId.lastName || ''}`.trim()
                : 'Unknown'}
            </p>
            <p>
              <strong>Rating:</strong>{' '}
              <span className={styles.starsDisplay}>
                {'★'.repeat(selectedReview.rating) + '☆'.repeat(5 - selectedReview.rating)}
              </span>
            </p>
            <p>
              <strong>Feedback:</strong><br />
              {selectedReview.feedbackText}
            </p>
            <p>
              <strong>Submitted on:</strong>{' '}
              {new Date(selectedReview.createdAt).toLocaleString()}
            </p>
            <button onClick={() => setSelectedReview(null)} style={{ marginTop: '15px' }}>
              Close
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReviews;
