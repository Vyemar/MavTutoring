import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Settings.module.css";
import AdminSideBar from "../../components/Sidebar/AdminSidebar";
import { useSidebar } from "../../components/Sidebar/SidebarContext";

// Get configuration from environment variables
const PROTOCOL = process.env.REACT_APP_PROTOCOL || "https";
const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT || "4000";

// Construct the backend URL dynamically
const BACKEND_URL = `${PROTOCOL}://${BACKEND_HOST}:${BACKEND_PORT}`;

function Settings() {
  const [settings, setSettings] = useState({
    logo: "",
    contactInfo: {
      email: "",
      phone: "",
      address: "",
    },
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/bughouse`);
      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const formData = new FormData();

      // If there's a new file selected, add it to formData
      if (selectedFile) {
        formData.append("logo", selectedFile);
      }
      // Add contact info as JSON string
      formData.append("contactInfo", JSON.stringify(settings.contactInfo));

      await axios.put(`${BACKEND_URL}/api/bughouse`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data", 
        },
      });

      alert("Settings updated successfully!");
      fetchSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <AdminSideBar selected="admin-settings"></AdminSideBar>
      <div className={styles.mainContent} style={{ marginLeft: isCollapsed ? "90px" : "270px", transition: "margin-left 0.5s ease"}}>
        <h1 className={styles.heading}>BugHouse Settings</h1>
        <div className={styles.adminSettings}>
          <form onSubmit={handleSubmit}>
            <div className={styles.settingsSection}>
              <h3>Current Logo</h3>
              {settings.logo && (
                <div className={styles.currentLogo}>
                  <img
                    src={settings.logo}
                    alt="Current Logo"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
              <h3>Upload New Logo</h3>
              <input type="file" accept="image/*" onChange={handleFileSelect} />
            </div>

            <div className={styles.settingsSection}>
              <h3>Contact Information</h3>
              <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={settings.contactInfo.email}
                  onChange={handleContactInfoChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={settings.contactInfo.phone}
                  onChange={handleContactInfoChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Address:</label>
                <textarea
                  name="address"
                  value={settings.contactInfo.address}
                  onChange={handleContactInfoChange}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
