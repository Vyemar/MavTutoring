import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { axiosPostData } from "../utils/api";
import styles from "../styles/ResetPassword.module.css";
import logoImg from "../logo.svg";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }
    if (!token) {
      return setMessage("Invalid or missing token.");
    }
    setIsLoading(true);
    try {
      const res = await axiosPostData("/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Server error. Please try again.";
      setMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        {/* Header with logo */}
        <div className={styles.productHeader}>
          <img src={logoImg} alt="Logo" className={styles.productLogo} />
          <div className={styles.productName}>bugHouse</div>
        </div>

        <h2 className={styles.title}>Reset Password</h2>
        {message && <div className={styles.message}>{message}</div>}

        <form onSubmit={handleSubmit} className="mt-3" style={{ width: "100%" }}>
          <div className="mb-3">
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.resetButton}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-3 text-center">
          <Link to="/login" className={styles.link}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;