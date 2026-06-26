import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { ServiceStatusBoard } from "../components/ServiceStatusBoard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, "")}/api`;

const emptyMechanicForm = {
  first_name: "",
  last_name: "",
  dni: "",
  phone: "",
  email: "",
  password: "",
  password_confirm: ""
};

const emptyDashboardStats = {
  active_vehicles: 0,
  mechanics_count: 0,
  budget_pending: 0
};

const getStoredObject = (key) => {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    localStorage.removeItem(key);
    return null;
  }
};

export const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = user || getStoredObject("user");
  const currentEmployee = getStoredObject("employee");

  const currentRole =
    currentEmployee?.role ||
    currentUser?.employee?.role ||
    currentUser?.role ||
    "admin";

  const currentEmail =
    currentUser?.email ||
    currentEmployee?.email ||
    "Administrator";

  const [mechanicForm, setMechanicForm] = useState(emptyMechanicForm);
  const [mechanics, setMechanics] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(emptyDashboardStats);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getAdminDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Could not load dashboard data.");
        return;
      }

      setDashboardStats(data.stats || emptyDashboardStats);
    } catch (error) {
      setError("Could not connect to the server.");
      console.error(error);
    }
  };

  const getMechanics = async () => {
    setIsLoadingList(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/mechanics`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Could not load mechanics.");
        return;
      }

      setMechanics(data.mechanics || []);
    } catch (error) {
      setError("Could not connect to the server.");
      console.error(error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    getMechanics();
    getAdminDashboard();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("employee");

    navigate("/login");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setMechanicForm({
      ...mechanicForm,
      [name]: value
    });

    setError("");
    setSuccessMessage("");
  };

  const handleCreateMechanic = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (mechanicForm.password !== mechanicForm.password_confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/mechanics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(mechanicForm)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Could not create mechanic.");
        return;
      }

      if (data.employee) {
        setMechanics((prevMechanics) => [data.employee, ...prevMechanics]);
      } else {
        getMechanics();
      }

      setMechanicForm(emptyMechanicForm);

      setSuccessMessage(
        "Mechanic created successfully. They can now log in with their email and password."
      );

      getAdminDashboard();
    } catch (error) {
      setError("Could not connect to the server.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <main className="container">
        <header className="bg-white border rounded-4 shadow-sm p-4 mb-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3">
            <div>
              <p className="text-uppercase text-danger small fw-bold mb-2">
                Workshop panel
              </p>

              <h1 className="fw-bold text-dark mb-2">
                Workshop overview
              </h1>

              <p className="text-muted mb-3">
                Track vehicle status, pending estimates, repairs, and your mechanic team.
              </p>

              <div className="d-flex flex-column flex-md-row gap-2">
                <span className="badge text-bg-dark rounded-pill px-3 py-2">
                  {currentRole}
                </span>

                <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                  {currentEmail}
                </span>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                type="button"
                className={`btn btn-sm px-3 fw-bold ${styles.btnLogin}`}
                onClick={() => navigate("/services/new")}
              >
                New service ticket
              </button>

              <button
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </header>

        <section className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="bg-white border rounded-4 shadow-sm p-3 h-100">
              <p className="text-muted small mb-1">Active vehicles</p>
              <h2 className="fw-bold mb-0">
                {dashboardStats.active_vehicles ?? 0}
              </h2>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="bg-white border rounded-4 shadow-sm p-3 h-100">
              <p className="text-muted small mb-1">Registered mechanics</p>
              <h2 className="fw-bold mb-0">
                {dashboardStats.mechanics_count ?? mechanics.length}
              </h2>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="bg-white border rounded-4 shadow-sm p-3 h-100">
              <p className="text-muted small mb-1">Pending estimates</p>
              <h2 className="fw-bold mb-0">
                {dashboardStats.budget_pending ?? 0}
              </h2>
            </div>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger rounded-4" role="alert">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success rounded-4" role="alert">
            {successMessage}
          </div>
        )}

        <section className="mb-4">
          <ServiceStatusBoard role="admin" />
        </section>

        <section className="row g-4 align-items-start">
          <div className="col-12 col-lg-5">
            <div className="bg-white border rounded-4 shadow-sm p-4">
              <p className="text-uppercase text-muted small fw-semibold mb-2">
                Team
              </p>

              <h2 className="h4 fw-bold mb-2">
                Create mechanic account
              </h2>

              <p className="text-muted mb-4">
                Create an account so the mechanic can log in and see their assigned services.
              </p>

              <form onSubmit={handleCreateMechanic}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold" htmlFor="first_name">
                      First name
                    </label>

                    <input
                      id="first_name"
                      type="text"
                      name="first_name"
                      className="form-control py-2 px-3"
                      value={mechanicForm.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold" htmlFor="last_name">
                      Last name
                    </label>

                    <input
                      id="last_name"
                      type="text"
                      name="last_name"
                      className="form-control py-2 px-3"
                      value={mechanicForm.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold" htmlFor="dni">
                      DNI / NIE
                    </label>

                    <input
                      id="dni"
                      type="text"
                      name="dni"
                      className="form-control py-2 px-3"
                      value={mechanicForm.dni}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold" htmlFor="phone">
                      Phone
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      className="form-control py-2 px-3"
                      value={mechanicForm.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold" htmlFor="email">
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control py-2 px-3"
                      value={mechanicForm.email}
                      onChange={handleInputChange}
                      required
                    />

                    <small className="text-muted">
                      This is the email the mechanic will use to log in.
                    </small>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold" htmlFor="password">
                      Temporary password
                    </label>

                    <input
                      id="password"
                      type="password"
                      name="password"
                      className="form-control py-2 px-3"
                      value={mechanicForm.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold" htmlFor="password_confirm">
                      Confirm password
                    </label>

                    <input
                      id="password_confirm"
                      type="password"
                      name="password_confirm"
                      className="form-control py-2 px-3"
                      value={mechanicForm.password_confirm}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <button
                      className={`btn w-100 py-3 fw-bold ${styles.btnLogin}`}
                      type="submit"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating mechanic...
                        </>
                      ) : (
                        "Create mechanic"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="bg-white border rounded-4 shadow-sm p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                <div>
                  <p className="text-uppercase text-muted small fw-semibold mb-2">
                    Access
                  </p>

                  <h2 className="h4 fw-bold mb-2">
                    Registered mechanics
                  </h2>

                  <p className="text-muted mb-0">
                    Mechanics who can access the system and manage assigned services.
                  </p>
                </div>

                <button
                  className="btn btn-outline-secondary btn-sm px-3 align-self-start"
                  onClick={getMechanics}
                  disabled={isLoadingList}
                >
                  {isLoadingList ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Updating...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </button>
              </div>

              {isLoadingList ? (
                <div className="alert alert-secondary rounded-4 mb-0 d-flex align-items-center">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading mechanics...
                </div>
              ) : mechanics.length === 0 ? (
                <div className="alert alert-warning rounded-4 mb-0">
                  No mechanics have been registered yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {mechanics.map((mechanic) => (
                        <tr key={mechanic.id || mechanic.email}>
                          <td>
                            <div className="fw-semibold">
                              {mechanic.first_name} {mechanic.last_name}
                            </div>

                            {mechanic.dni && (
                              <small className="text-muted">
                                DNI/NIE: {mechanic.dni}
                              </small>
                            )}
                          </td>

                          <td>{mechanic.email}</td>

                          <td>{mechanic.phone}</td>

                          <td>
                            <span
                              className={`badge rounded-pill ${
                                mechanic.is_active === false
                                  ? "text-bg-warning"
                                  : "text-bg-success"
                              }`}
                            >
                              {mechanic.is_active === false ? "Inactive" : "Active"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};