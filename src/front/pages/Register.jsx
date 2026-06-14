import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
    company_name: "",
    role: "employee"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Guardar token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir al dashboard o home
      navigate("/dashboard");
    } catch (err) {
      setError("Connection error. Please try again.");
      console.error(err);
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
            onClick={() => navigate("/")}
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>

        <h2 className={`fw-bold m-0 text-dark ${styles.titleHello}`}>Join Us!</h2>
        <h3 className={`fw-bold mb-4 text-dark ${styles.titleWelcome}`}>Create Account</h3>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className={`form-control py-3 px-4 border ${styles.loginInput}`}
              placeholder="E-mail address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="company_name"
              className={`form-control py-3 px-4 border ${styles.loginInput}`}
              placeholder="Company name (optional)"
              value={formData.company_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={`form-control py-3 px-4 border ${styles.loginInput}`}
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button 
              type="button" 
              className={`btn p-0 position-absolute top-50 end-0 translate-middle-y me-3 text-secondary ${styles.passwordEye}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>

          <div className="mb-4 position-relative">
            <input
              type={showPasswordConfirm ? "text" : "password"}
              name="password_confirm"
              className={`form-control py-3 px-4 border ${styles.loginInput}`}
              placeholder="Confirm password"
              value={formData.password_confirm}
              onChange={handleInputChange}
              required
            />
            <button 
              type="button" 
              className={`btn p-0 position-absolute top-50 end-0 translate-middle-y me-3 text-secondary ${styles.passwordEye}`}
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            >
              <i className={`fa-solid ${showPasswordConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>

          <button 
            type="submit" 
            className={`btn w-100 py-3 fw-bold ${styles.btnLogin}`}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-2">
          <span className="text-secondary small">Already have an account? </span>
          <button 
            type="button"
            className="btn btn-link p-0 text-dark fw-bold text-decoration-none small"
            onClick={() => navigate("/")}
          >
            Log in
          </button>
        </div>

      </div>
    </div>
  );
};
