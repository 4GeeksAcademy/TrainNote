import React, { useState } from "react";
import styles from "./Login.module.css";

export const Home = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className={`card p-4 shadow-sm border-0 bg-white ${styles.loginCard}`}>
        
        <div className="mb-4">
          <button type="button" className={`btn p-0 text-danger ${styles.backArrow}`}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>

        <h2 className={`fw-bold m-0 text-dark ${styles.titleHello}`}>Hello there!</h2>
        <h3 className={`fw-bold mb-4 text-dark ${styles.titleWelcome}`}>Welcome Back</h3>

        <form>
          <div className="mb-3">
            <input
              type="email"
              className={`form-control py-3 px-4 border ${styles.loginInput}`}
              placeholder="E-mail address"
            />
          </div>

          <div className="mb-2 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control py-3 px-4 border ${styles.loginInput}`}
              placeholder="Password"
            />
            <button 
              type="button" 
              className={`btn p-0 position-absolute top-50 end-0 translate-middle-y me-3 text-secondary ${styles.passwordEye}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>

          <div className="text-end mb-4">
            <a href="#" className="text-danger text-decoration-none small fw-semibold">
              Forgot your password?
            </a>
          </div>

          <button type="button" className={`btn w-100 py-3 fw-bold ${styles.btnLogin}`}>
            Log In
          </button>
        </form>

        <div className="text-center mt-2">
          <span className="text-secondary small">Don't have an account? </span>
          <a href="#" className="text-dark fw-bold text-decoration-none small">Register</a>
        </div>

      </div>
    </div>
  );
};
