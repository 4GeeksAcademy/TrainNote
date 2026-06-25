import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="container-fluid p-0">

      {/* HERO */}
      <section className="bg-dark text-light py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark mb-3">
                Workshop management app
              </span>

              <h1 className="display-4 fw-bold">
                Manage your mechanic workshop <br />
                <span className="text-warning">without losing control</span>
              </h1>

              <p className="lead mt-3 text-light opacity-75">
                Register your workshop, create mechanic accounts and keep your team organized from one simple platform.
              </p>

              <div className="d-flex gap-3 mt-4 flex-wrap">
                <Link to="/register" className="btn btn-warning btn-lg fw-bold">
                  Register my workshop
                </Link>

                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4">
                  <h2 className="h5 fw-bold mb-3 text-dark">
                    What can you do?
                  </h2>

                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex gap-3">
                      <span className="fs-4">✅</span>
                      <p className="mb-0 text-muted">
                        Create an admin account for your workshop.
                      </p>
                    </div>

                    <div className="d-flex gap-3">
                      <span className="fs-4">✅</span>
                      <p className="mb-0 text-muted">
                        Register mechanics and give them access.
                      </p>
                    </div>

                    <div className="d-flex gap-3">
                      <span className="fs-4">✅</span>
                      <p className="mb-0 text-muted">
                        Prepare the base for future repair tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-5">
        <h2 className="text-center fw-bold mb-2">
          What does AppTalleres include?
        </h2>

        <p className="text-center text-muted mb-5">
          A simple MVP to organize workshop users, roles and team access.
        </p>

        <div className="row g-4">
          {[
            {
              icon: "📋",
              title: "Vehicle records",
              text: "License plate, model, customer, status and priority for every vehicle."
            },
            {
              icon: "👨‍🔧",
              title: "Separated roles",
              text: "Admins manage the workshop, mechanics focus only on their assigned tasks."
            },
            {
              icon: "🚦",
              title: "Repair tracking",
              text: "Follow each vehicle from check-in to diagnosis, repair and delivery."
            },
            {
              icon: "📊",
              title: "Service history",
              text: "Keep a clear record of every service performed in your workshop."
            }
          ].map((feature, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div style={{ fontSize: "3rem" }}>{feature.icon}</div>
                  <h5 className="mt-3 fw-bold">{feature.title}</h5>
                  <p className="text-muted small">{feature.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-warning py-5">
        <div className="container text-center">
          <h2 className="fw-bold">Ready to get started?</h2>
          <p className="lead">
            Register your workshop in less than two minutes.
          </p>

          <Link to="/register" className="btn btn-dark btn-lg fw-bold">
            Create free account
          </Link>
        </div>
      </section>

    </div>
  );
};