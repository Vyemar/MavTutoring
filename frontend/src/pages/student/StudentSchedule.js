import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import styles from '../../styles/StudentSchedule.module.css';
import StudentSidebar from '../../components/Sidebar/StudentSidebar';

// BookingModal component
const BookingModal = ({ tutor, onClose, onBookingComplete }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [duration] = useState(60);
  const studentId = localStorage.getItem('userID');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate]);

  const fetchAvailableTimeSlots = async () => {
    try {
      // Ensure we're passing the date in YYYY-MM-DD format
      const formattedDate = selectedDate;
      
      const response = await axios.get(
        `http://localhost:4000/api/sessions/availability/${tutor._id}/${formattedDate}`
      );
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        setAvailableTimeSlots(response.data);
        setBookingError('');
      } else {
        setAvailableTimeSlots([]);
        setBookingError('No availability for selected date');
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setBookingError('Failed to fetch available time slots');
      setAvailableTimeSlots([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    
    try {
      // Create date object with the correct timezone offset
      const localDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const utcDateTime = new Date(localDateTime.getTime() + localDateTime.getTimezoneOffset() * 60000);
      
      console.log('Booking time (local):', localDateTime.toLocaleString());
      console.log('Booking time (UTC):', utcDateTime.toISOString());
      
      const response = await axios.post('http://localhost:4000/api/sessions', {
        tutorId: tutor._id,
        studentId,
        sessionTime: utcDateTime.toISOString(),
        duration
      });

      if (response.data.success) {
        onBookingComplete();
        onClose();
      }
    } catch (error) {
      console.error('Error booking session:', error);
      const errorMessage = error.response?.data?.message || 'Error booking session';
      setBookingError(errorMessage);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Book a Session with {tutor.firstName} {tutor.lastName}</h2>
        {bookingError && <div className={styles.error}>{bookingError}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className={styles.formInput}
            />
          </div>

          {selectedDate && (
            <div className={styles.formGroup}>
              <label>Available Time Slots:</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                className={styles.formInput}
              >
                <option value="">Select a time</option>
                {availableTimeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Duration:</label>
            <input
              type="text"
              value={`${duration} minutes`}
              disabled
              className={styles.formInput}
            />
          </div>

          <div className={styles.modalButtons}>
            <button type="submit" className={styles.submitButton}>
              Book Session
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function StudentSchedule() {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  const studentId = localStorage.getItem('userID');

  useEffect(() => {
    fetchTutors();
    fetchUpcomingSessions();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/tutors');
      setTutors(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error loading tutors');
      setLoading(false);
    }
  };

  const fetchUpcomingSessions = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/sessions/student/${studentId}`);
      setUpcomingSessions(response.data);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
    }
  };

  const handleBookingComplete = () => {
    setSuccessMessage('Session booked successfully!');
    fetchUpcomingSessions(); // Refresh the sessions list
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const formatDateTime = (dateTime) => {
    // Create a date object and adjust for timezone
    const date = new Date(dateTime);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC'
      });
  };

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <StudentSidebar selected="Schedule" />
      <div className={styles.mainContent}>
        <div className={styles.scheduleContainer}>
          <h1 className={styles.heading}>Schedule a Session</h1>
          <hr className={styles.divider} />

          {error && <div className={styles.error}>{error}</div>}
          {successMessage && <div className={styles.success}>{successMessage}</div>}

          <div className={styles.upcomingSessions}>
            <h2>Upcoming Sessions</h2>
            {upcomingSessions.length > 0 ? (
              <div className={styles.sessionsList}>
                {upcomingSessions.map((session) => (
                  <div key={session._id} className={styles.sessionCard}>
                    <p><strong>Tutor:</strong> {session.tutorID.firstName} {session.tutorID.lastName}</p>
                    <p><strong>Date & Time:</strong> {formatDateTime(session.sessionTime)}</p>
                    <p><strong>Duration:</strong> {session.duration} minutes</p>
                    <p><strong>Status:</strong> {session.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No upcoming sessions</p>
            )}
          </div>

          <div className={styles.tutorsList}>
            <h2>Available Tutors</h2>
            <div className={styles.tutorsGrid}>
              {tutors.map((tutor) => (
                <div key={tutor._id} className={styles.tutorCard}>
                  <div className={styles.tutorInfo}>
                    <h3>{tutor.firstName} {tutor.lastName}</h3>
                    <p><strong>Rating:</strong> {tutor.rating || 'Not rated'}</p>
                    <p><strong>Courses:</strong> {tutor.courses || 'Not specified'}</p>
                    <button
                      className={styles.bookButton}
                      onClick={() => {
                        setSelectedTutor(tutor);
                        setShowBookingModal(true);
                      }}
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showBookingModal && (
            <BookingModal
              tutor={selectedTutor}
              onClose={() => {
                setShowBookingModal(false);
                setSelectedTutor(null);
              }}
              onBookingComplete={handleBookingComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentSchedule;