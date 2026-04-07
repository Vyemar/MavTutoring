import React, { useState } from 'react';
import { useSidebar } from "../../components/Sidebar/SidebarContext";
import AdminSidebar from '../../components/Sidebar/AdminSidebar';
import { axiosPostData } from '../../utils/api';
import styles from '../../styles/AdminEmail.module.css';

export default function AdminEmail() {
  const [allTutors, setAllTutors] = useState(false);
  const [allStudents, setAllStudents] = useState(false);
  const [extraEmails, setExtraEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const { isCollapsed } = useSidebar();

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('Sending…');
    try {
      const response = await axiosPostData('/api/admin/send-mass-email', {
        allTutors,
        allStudents,
        extraEmails: extraEmails.split(',').map(e => e.trim()).filter(Boolean),
        subject,
        message,
      });
      setStatus(`✔ Sent to ${response.data.sentTo} recipients`);
    } catch (err) {
      setStatus('❌ ' + (err.response?.data?.error || err.message));
    }
  };

  const sidebarWidth = isCollapsed ? '80px' : '270px';

return (
  <div className={styles.container}>
    <AdminSidebar selected="admin-email" />
    <div
      className={styles.mainContent}
      style={{ "--sidebar-width": sidebarWidth }}
    >
      <div className={styles.headerSection}>
        <h1 className={styles.heading}>Admin Email</h1>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.formLabel}>
            <input
              type="checkbox"
              checked={allTutors}
              onChange={e => setAllTutors(e.target.checked)}
            />
            <span>All Tutors</span>
          </label>

          <label className={styles.formLabel}>
            <input
              type="checkbox"
              checked={allStudents}
              onChange={e => setAllStudents(e.target.checked)}
            />
            <span>All Students</span>
          </label>

          <label className={styles.extraEmailsLabel}>
            Specific emails (comma-separated)
            <input
              type="text"
              value={extraEmails}
              onChange={e => setExtraEmails(e.target.value)}
            />
          </label>

          <label className={styles.extraEmailsLabel}>
            Subject
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            />
          </label>

          <label className={styles.extraEmailsLabel}>
            Message
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </label>

          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>

        {status && <div className={styles.status}>{status}</div>}
      </div>
    </div>
  </div>
)};