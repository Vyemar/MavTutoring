import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/FindMyTutorProfile.module.css"; // Updated style import
import TutorSidebar from "../../components/Sidebar/TutorSidebar";

function TutorProfile() {
  const [profile, setProfile] = useState({
    profilePicture: null,
    name: "",
    bio: "",
    courses: "",
    major: "",
    currentYear: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userId = localStorage.getItem("userID");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/profile/${userId}`);
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error loading profile");
      setLoading(false);
    }
  };

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
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('name', profile.name);
      formData.append('bio', profile.bio);
      formData.append('courses', profile.courses);
      formData.append('major', profile.major);
      formData.append('currentYear', profile.currentYear);

      if (profile.profilePicture && profile.profilePicture.startsWith('data:image')) {
        const response = await fetch(profile.profilePicture);
        const blob = await response.blob();
        formData.append('profilePicture', blob, 'profile.jpg');
      }

      await axios.post('http://localhost:4000/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setError("Error updating profile. Please try again.");
    }
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
