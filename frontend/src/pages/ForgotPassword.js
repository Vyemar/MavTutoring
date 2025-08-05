import React, { useState } from "react";
import { Link } from "react-router-dom";
import { axiosPostData } from "../utils/api";
import styles from "../styles/ForgotPassword.module.css";
import logoImg from "../logo.svg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosPostData("/api/auth/request-reset", { email });
      setMessage(res.message);
    } catch (err) {
      setMessage("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.productHeader}>
          <img src={logoImg} alt="Logo" className={styles.productLogo} />
          <div className={styles.productName}>bugHouse</div>
        </div>
        <h2 className={styles.title}>Forgot Password</h2>
        {message && <div className={styles.message}>{message}</div>}
        <form onSubmit={handleSubmit} className="mt-3">
          <div className="mb-3">
            <label htmlFor="email" className={styles.label}>Email address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={styles.requestButton}
            disabled={isLoading}
          >
            {isLoading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
        <p className="mt-3 text-center">
          <Link to="/login" className={styles.link}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;