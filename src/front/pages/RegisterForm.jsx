import React, { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { Link } from "react-router-dom";

export const RegisterForm = () => {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleRegister
  } = useRegister();

  const handleSubmit = (event) => {
    event.preventDefault();
    handleRegister();
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="card shadow-lg border-0 w-100" style={{ maxWidth: '400px' }}>
        <div className="card-header bg-primary text-white text-center py-4 border-0 rounded-top">
          <div className="mb-2" style={{ fontSize: '3rem', opacity: '0.9' }}>👤</div>
          <h2 className="h4 mb-0 fw-bold">Create Account</h2>
        </div>

        <div className="card-body p-4 p-md-5">
          {error && (
            <div className="alert alert-danger text-center py-2 small" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="userNameInput"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="userNameInput">
                <i className="bi bi-person-fill me-2 text-muted"></i>Username
              </label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="emailInput">
                <i className="bi bi-envelope-fill me-2 text-muted"></i>Email Address
              </label>
              <div id="emailHelp" className="form-text text-center text-muted mt-1 small">
                We'll never share your email with anyone.
              </div>
            </div>

            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="passwordInput">
                <i className="bi bi-lock-fill me-2 text-muted"></i>Password
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm fw-bold">
              Create Account
            </button>
          </form>
        </div>

        <div className="card-footer bg-white border-top text-center py-3">
          <p className="text-muted mb-0 small">
            Already have an account? <Link to="/" className="text-primary text-decoration-none fw-bold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};