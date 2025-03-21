import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../../styles/FindMyTutorProfile.module.css";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || 'https';
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '4000';

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

const localizer = momentLocalizer(moment);

function ViewProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [adminSession, setAdminSession] = useState(null);

  // Get admin session info
  useEffect(() => {
    const fetchAdminSession = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/session`, {
          withCredentials: true
        });
        if (response.data && response.data.user && response.data.user.role === 'Admin') {
          setAdminSession(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching admin session:", error);
      }
    };

    fetchAdminSession();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `${BACKEND_URL}/api/users/${userId}`
        );
        setUser(userResponse.data);
        setNewRole(userResponse.data.role); // Initialize with current role
        return userResponse.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
        return null;
      }
    };

    const fetchProfileByRole = async (userRole, userId) => {
      try {
        const endpoint = getProfileEndpoint(userRole, userId);
        if (!endpoint) return null;
        
        const profileResponse = await axios.get(endpoint);
        return profileResponse.data;
      } catch (error) {
        console.error(`Error fetching ${userRole} profile:`, error);
        setError(`Failed to load ${userRole.toLowerCase()} profile`);
        return null;
      }
    };

    const fetchTutorAvailability = async (userId) => {
      try {
        const availabilityResponse = await axios.get(
          `${BACKEND_URL}/api/availability/${userId}`
        );

        // Convert availability data to calendar events
        const formattedEvents = [];
        // Start from Monday of current week
        const currentDate = moment().startOf('week').add(1, 'days');

        availabilityResponse.data.forEach((slot) => {
          // Skip slots with empty times
          if (slot.startTime === "00:00" && slot.endTime === "00:00") {
            return;
          }

          // Skip weekend days
          if (['Saturday', 'Sunday'].includes(slot.day)) {
            return;
          }
          
          // Get the day index (0-4 for Monday-Friday)
          const dayMapping = {
            'Monday': 0,
            'Tuesday': 1,
            'Wednesday': 2,
            'Thursday': 3,
            'Friday': 4
          };
          
          // Create date for this week's occurrence of the day
          const eventDate = currentDate.clone().add(dayMapping[slot.day], 'days');
          
          // Create start and end times
          const startDateTime = eventDate.clone()
            .set('hour', parseInt(slot.startTime.split(':')[0]))
            .set('minute', parseInt(slot.startTime.split(':')[1]));
          
          const endDateTime = eventDate.clone()
            .set('hour', parseInt(slot.endTime.split(':')[0]))
            .set('minute', parseInt(slot.endTime.split(':')[1]));

          formattedEvents.push({
            id: `${slot.day}-${slot.startTime}-${slot.endTime}`,
            start: startDateTime.toDate(),
            end: endDateTime.toDate(),
            title: 'Available'
          });
        });

        return formattedEvents;
      } catch (error) {
        console.error("Error fetching availability:", error);
        return [];
      }
    };

    // Helper function to get the appropriate endpoint for profile
    const getProfileEndpoint = (role, id) => {
      switch (role) {
        case 'Tutor':
          return `${BACKEND_URL}/api/profile/tutor/${id}`;
        case 'Student':
          return `${BACKEND_URL}/api/profile/student/${id}`;
        case 'Admin':
          return null; // Admins don't have profiles for now
        default:
          return `${BACKEND_URL}/api/profile/${id}`; // Fallback to general endpoint
      }
    };

    const fetchData = async () => {
      try {
        // First get the user data to determine role
        const userData = await fetchUserData();
        
        if (!userData) {
          setLoading(false);
          return;
        }
        
        // Then fetch the appropriate profile based on role
        const profileData = await fetchProfileByRole(userData.role, userId);
        setProfile(profileData);
        
        // Only fetch availability for tutors
        if (userData.role === 'Tutor') {
          const availabilityData = await fetchTutorAvailability(userId);
          setEvents(availabilityData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in data fetching:", error);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Custom day header component
  const customDayHeader = ({ label }) => {
    const dayName = label.split(" ")[0]; // Extract only the day name
    return <div style={{ textAlign: "center", fontWeight: "bold" }}>{dayName}</div>;
  };

  // Event style getter
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#4CAF50',
      borderRadius: '3px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block'
    }
  });

  // Handle role change
  const handleRoleChange = async () => {
    if (!user || !newRole || user.role === newRole) {
      return;
    }

    try {
      setLoading(true);
      
      // Call the API to update the user's role
      await axios.put(
        `${BACKEND_URL}/api/profile/update-role/${userId}`,
        { newRole },
        { withCredentials: true }
      );
      
      setSuccessMessage(`User role successfully changed from ${user.role} to ${newRole}`);
      setUser({ ...user, role: newRole });
      setIsChangingRole(false);
      
      // Refresh data to get the updated profile
      window.location.reload();
      
    } catch (error) {
      console.error("Error updating user role:", error);
      setError("Failed to update user role. " + 
        (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.mainContent}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.mainContent}>
          <p>User not found.</p>
        </div>
      </div>
    );
  }

  if (!profile && user.role !== 'Admin') {
    return (
      <div className={styles.container}>
        <AdminSidebar />
        <div className={styles.mainContent}>
          <p>Profile not found for this user.</p>
        </div>
      </div>
    );
  }

  const userName = profile?.name || `${user?.firstName} ${user?.lastName}`;

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}
        
        <div className={styles.profileContainer}>
          <div className={styles.profileSection}>
            <div className={styles.profileHeader}>
              <h1 className={styles.heading}>
                {userName}'s Profile <span className={styles.roleBadge}>{user.role}</span>
              </h1>
              
              {/* Role change controls for admin */}
              {adminSession && (
                <div className={styles.roleControls}>
                  {isChangingRole ? (
                    <div className={styles.roleChangeForm}>
                      <select 
                        value={newRole} 
                        onChange={(e) => setNewRole(e.target.value)}
                        className={styles.roleSelect}
                      >
                        <option value="Student">Student</option>
                        <option value="Tutor">Tutor</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <button 
                        onClick={handleRoleChange}
                        className={styles.saveButton}
                        disabled={user.role === newRole}
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setIsChangingRole(false);
                          setNewRole(user.role);
                        }}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsChangingRole(true)}
                      className={styles.changeRoleButton}
                    >
                      Change Role
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={userName}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profilePlaceholder}>
                <span>No Image</span>
              </div>
            )}
            
            <div className={styles.profileInfo}>
              <p><strong>Name:</strong> {userName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
              
              {/* Render fields based on user role */}
              {user.role === 'Tutor' && profile && (
                <>
                  <p><strong>Bio:</strong> {profile.bio || 'Not provided'}</p>
                  <p><strong>Courses:</strong> {profile.courses || 'Not provided'}</p>
                  <p><strong>Skills:</strong> {profile.skills || 'Not provided'}</p>
                  <p><strong>Major:</strong> {profile.major || 'Not Specified'}</p>
                  <p><strong>Year:</strong> {profile.currentYear || 'Not Specified'}</p>
                </>
              )}
              
              {user.role === 'Student' && profile && (
                <>
                  <p><strong>Bio:</strong> {profile.bio || 'Not provided'}</p>
                  <p><strong>Major:</strong> {profile.major || 'Not Specified'}</p>
                  <p><strong>Year:</strong> {profile.currentYear || 'Not Specified'}</p>
                  <p><strong>Learning Style:</strong> {profile.preferredLearningStyle || 'Not Specified'}</p>
                  <p><strong>Academic Goals:</strong> {profile.academicGoals || 'Not provided'}</p>
                  {profile.coursesEnrolled && profile.coursesEnrolled.length > 0 && (
                    <p><strong>Courses Enrolled:</strong> {profile.coursesEnrolled.join(', ')}</p>
                  )}
                  {profile.areasOfInterest && profile.areasOfInterest.length > 0 && (
                    <p><strong>Areas of Interest:</strong> {profile.areasOfInterest.join(', ')}</p>
                  )}
                </>
              )}
              
              {user.role === 'Admin' && (
                <p><strong>Role:</strong> Administrator</p>
              )}
            </div>
          </div>
        </div>

        {/* Only show availability calendar for tutors */}
        {user.role === 'Tutor' && (
          <div className={styles.calendarContainer}>
            <h2 className={styles.heading}>Availability</h2>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, width: "100%" }}
              views={["work_week"]}
              defaultView="work_week"
              date={moment().toDate()}
              toolbar={false}
              min={moment().hours(10).minutes(0).toDate()}
              max={moment().hours(18).minutes(0).toDate()}
              step={30}
              timeslots={2}
              eventPropGetter={eventStyleGetter}
              components={{
                work_week: {
                  header: customDayHeader,
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewProfile;