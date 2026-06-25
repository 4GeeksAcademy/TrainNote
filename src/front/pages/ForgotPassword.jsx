import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export const ForgotPassword = () =>  {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setResetUrl("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not create reset link");
        return;
      }

      setMessage(data.message);

      if (data.reset_url) {
        setResetUrl(data.reset_url);
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className={`card p-4 shadow-sm border-0 bg-white ${styles.loginCard}`}>

        <div className="mb-4">
          <button
            type="button"
            className={`btn p-0 text-danger ${styles.backArrow}`}
            onClick={() => navigate("/login")}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>

        <h2 className={`fw-bold m-0 text-dark ${styles.titleHello}`}>
          Recover password
        </h2>

        <h3 className={`fw-bold mb-4 text-dark ${styles.titleWelcome}`}>
          Reset your access
        </h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {resetUrl && (
          <div className="alert alert-warning">
            <p className="mb-2">
              Development reset link:
            </p>

            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={() => navigate(resetUrl)}
            >
              Go to reset password
            </button>
          </div>
        )}

        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <input
              type="email"
              className={`form-control py-3 px-4 border ${styles.loginInput}`}
              placeholder="Your email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setMessage("");
                setResetUrl("");
              }}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn w-100 py-3 fw-bold ${styles.btnLogin}`}
            disabled={loading}
          >
            {loading ? "Creating reset link..." : "Create reset link"}
          </button>
        </form>

      </div>
    </div>
  );
};