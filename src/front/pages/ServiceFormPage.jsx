import React from "react";
import { useNavigate } from "react-router-dom";
import { ServiceForm } from "../components/ServiceForm";

export const ServiceFormPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <main className="container">
        <header className="bg-white border rounded-4 shadow-sm p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
            <div>
              <p className="text-uppercase text-danger small fw-bold mb-2">
                Service tickets
              </p>

              <h1 className="fw-bold text-dark mb-2">
                Create service ticket
              </h1>

              <p className="text-muted mb-0">
                Create a new repair or maintenance task and assign it to a mechanic.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm px-3"
              onClick={() => navigate("/dashboard")}
            >
              Back to dashboard
            </button>
          </div>
        </header>

        <ServiceForm onServiceCreated={() => navigate("/dashboard")} />
      </main>
    </div>
  );
};