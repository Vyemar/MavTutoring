import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import styles from "../../styles/FindMyTutorProfile.module.css"; // Updated style import
import TutorSidebar from "../../components/Sidebar/TutorSidebar";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || 'https';
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost';
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || '4000';

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function TutorProfile() {
  const [profile, setProfile] = useState({
    profilePicture: null,
    name: "",
    bio: "",
    courses: "",
    skills: "", //SKILL ADDED
    major: "",
    currentYear: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userData, setUserData] = useState(null);

  // Fetch the user session data
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/session`, {
          withCredentials: true
        });
        
        if (response.data && response.data.user) {
          setUserData(response.data.user);
        } else {
          setError("No user session found. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
        setError("Failed to authenticate user. Please log in again.");
      } finally {
        setSessionLoading(false);
      }
    };
    
    fetchUserSession();
  }, []);

  // Define fetchProfile as a useCallback function so it can be used in useEffect dependencies
  const fetchProfile = useCallback(async () => {
    if (!userData || !userData.id) return;
    
    try {
      console.log("Attempting to fetch profile for user ID:", userData.id);
      
      // Try to get the profile
      try {
        const response = await axios.get(`${BACKEND_URL}/api/profile/${userData.id}`, {
          withCredentials: true
        });
        console.log("Profile data received:", response.data);
        setProfile(response.data);
      } catch (profileError) {
        // If we get a 404, it means the profile doesn't exist yet
        if (profileError.response && profileError.response.status === 404) {
          console.log("Profile not found, this appears to be a new user");
          
          // Create a default empty profile for new users
          const defaultProfile = {
            profilePicture: null,
            name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : "",
            bio: "",
            courses: "",
            skills: "",
            major: "",
            currentYear: ""
          };
          
          setProfile(defaultProfile);
        } else {
          // Handle other errors
          throw profileError;
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Error loading profile. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, [userData]);

  // Fetch profile data once user session is loaded
  useEffect(() => {
    if (userData && userData.id) {
      fetchProfile();
    }
  }, [userData, fetchProfile]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => {
      const updatedProfile = { ...prevProfile, [name]: value };
      console.log(updatedProfile); // Log the updated state to verify
      return updatedProfile;
    });
  };
  
  const handleSubmit = async () => {
    if (!userData || !userData.id) {
      setError("User session expired. Please log in again.");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('userId', userData.id);
      formData.append('name', profile.name);
      formData.append('bio', profile.bio);
      formData.append('courses', profile.courses);
      formData.append('skills', profile.skills);
      formData.append('major', profile.major);
      formData.append('currentYear', profile.currentYear);
  
      if (profile.profilePicture && profile.profilePicture.startsWith('data:image')) {
        const response = await fetch(profile.profilePicture);
        const blob = await response.blob();
        formData.append('profilePicture', blob, 'profile.jpg');
      }
  
      // Make the request - this will create a new profile if one doesn't exist
      await axios.post(`${BACKEND_URL}/api/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
  
      setSuccessMessage("Profile saved successfully!");
      setIsEditing(false);
      
      // Refresh the profile data after saving
      fetchProfile();
      
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Error saving profile. Please try again.");
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className={styles.container}>
        <TutorSidebar selected="Profile" />
        <div className={styles.mainContent}>
          <div className={styles.spinnerContainer} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translateX(-30%)',
            height: '100%'
          }}>
            <div className={styles.spinner}></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.container}>
        <TutorSidebar selected="Profile" />
        <div className={styles.mainContent}>
          <div className={styles.error}>
            Session expired or not found. Please log in again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TutorSidebar selected="Profile" />
      <div className={styles.mainContent}>
        <div className={styles.profileContainer}>
          <h1 className={styles.heading}>Profile</h1>
          <hr className={styles.profileDivider} />

          {error && <div className={styles.error}>{error}</div>}
          {successMessage && <div className={styles.success}>{successMessage}</div>}

          <div className={styles.profileSection}>
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profilePlaceholder}>
                <span>No Image</span>
              </div>
            )}

            {isEditing && (
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            )}

            <div className={styles.profileInfo}>
              <p><strong>Name:</strong> 
                {isEditing ? (
                  <input 
                    type="text" 
                    name="name" 
                    value={profile.name} 
                    onChange={handleChange} 
                    required 
                  />
                ) : (
                  profile.name || "Not provided"
                )}
              </p>

              <p><strong>Bio:</strong> 
                {isEditing ? (
                  <textarea 
                    name="bio" 
                    value={profile.bio} 
                    onChange={handleChange}
                  />
                ) : (
                  profile.bio || "Not provided"
                )}
              </p>

              <p><strong>Courses:</strong> 
                {isEditing ? (
                  <input 
                    type="text" 
                    name="courses" 
                    value={profile.courses} 
                    onChange={handleChange} 
                  />
                ) : (
                  profile.courses || "Not provided"
                )}
              </p>

              <p><strong>Skills:</strong> 
                {isEditing ? (
                  <input 
                    type="text" 
                    name="skills" 
                    value={profile.skills} 
                    onChange={handleChange} 
                  />
                ) : (
                  profile.skills || "Not provided"
                )}
              </p>

              <p><strong>Major:</strong> 
                {isEditing ? (
                  <input 
                    type="text" 
                    name="major" 
                    value={profile.major} 
                    onChange={handleChange} 
                    required 
                  />
                ) : (
                  profile.major || "Not provided"
                )}
              </p>

              <p><strong>Year:</strong> 
                {isEditing ? (
                  <select 
                    name="currentYear" 
                    value={profile.currentYear} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Master's Student">Master's Student</option>
                    <option value="PhD Student">PhD Student</option>
                  </select>
                ) : (
                  profile.currentYear || "Not provided"
                )}
              </p>
            </div>

            <button 
              className={styles.editButton} 
              onClick={() => {
                if (isEditing) {
                  handleSubmit();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? "Save" : "Edit"}
            </button>

            {isEditing && (
              <button 
                className={styles.cancelButton} 
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile(); // Reset to last saved state
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorProfile;