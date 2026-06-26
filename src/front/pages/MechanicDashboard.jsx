import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceStatusBoard } from "../components/ServiceStatusBoard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, "")}/api`;

const emptyStats = {
  assigned: 0,
  in_repair: 0,
  finished: 0
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

export const MechanicDashboard = ({ user }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = getStoredObject("user");
  const employee = getStoredObject("employee");

  const currentUser = user || storedUser;

  const [stats, setStats] = useState(emptyStats);
  const [error, setError] = useState("");

  const mechanicName = employee
    ? `${employee.first_name || ""} ${employee.last_name || ""}`.trim()
    : "Mechanic";

  const mechanicRole =
    employee?.role ||
    currentUser?.employee?.role ||
    currentUser?.role ||
    "mechanic";

  const mechanicEmail =
    currentUser?.email ||
    employee?.email ||
    "No email";

  const getMechanicStats = async () => {
    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/mechanic/services`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Could not load mechanic services.");
        return;
      }

      setStats(data.stats || emptyStats);
    } catch (error) {
      setError("Could not connect to the server.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    getMechanicStats();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("employee");

    navigate("/login");
  };

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <main className="container">
        <header className="bg-white border rounded-4 shadow-sm p-4 mb-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3">
            <div>
              <p className="text-uppercase text-danger small fw-bold mb-2">
                Mechanic panel
              </p>

              <h1 className="fw-bold text-dark mb-2">
                Hello, {mechanicName}
              </h1>

              <p className="text-muted mb-3">
                Here you can view your assigned vehicles, update repair status, add comments, and report issues to the coordinator.
              </p>

              <div className="d-flex flex-column flex-md-row gap-2">
                <span className="badge text-bg-dark rounded-pill px-3 py-2">
                  {mechanicRole}
                </span>

                <span className="badge text-bg-light border text-dark rounded-pill px-3 py-2">
                  {mechanicEmail}
                </span>
              </div>
            </div>

            <button
              className="btn btn-outline-danger btn-sm px-3"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        <section className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="bg-white border rounded-4 shadow-sm p-3 h-100">
              <p className="text-muted small mb-1">Assigned services</p>
              <h2 className="fw-bold mb-0">
                {stats.assigned ?? 0}
              </h2>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="bg-white border rounded-4 shadow-sm p-3 h-100">
              <p className="text-muted small mb-1">In repair</p>
              <h2 className="fw-bold mb-0">
                {stats.in_repair ?? 0}
              </h2>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="bg-white border rounded-4 shadow-sm p-3 h-100">
              <p className="text-muted small mb-1">Finished</p>
              <h2 className="fw-bold mb-0">
                {stats.finished ?? 0}
              </h2>
            </div>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger rounded-4" role="alert">
            {error}
          </div>
        )}

        <section className="mb-4">
          <ServiceStatusBoard role="mechanic" />
        </section>
      </main>
    </div>
  );
};