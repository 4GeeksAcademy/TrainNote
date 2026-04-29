import React from "react";
import { Link } from "react-router-dom";
import { HeaderApp } from "../components/HeaderApp";

export const Home = () => {
  const btnStyle = {
    backgroundColor: "var(--color-fondoBotones)",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    padding: "1.5rem",
    transition: "all 0.2s ease"
  };

  const iconStyle = { fontSize: "1.5rem", color: "var(--color-primario)" };

  return (
    <div className="w-100 h-100 d-flex flex-column">
      
      <HeaderApp showBackButton={false} />

      <div className="d-flex flex-column gap-4 p-4">
        <Link to="/Menupadre" style={{ textDecoration: "none" }}> 
          <button className="btn w-100 shadow-sm" style={btnStyle}>
            <i className="fas fa-users mb-2" style={iconStyle}></i>
            <h5 className="m-0 fw-bold text-dark">MI FAMILIA</h5>
            <small className="text-muted text-uppercase" style={{ fontSize: "0.7rem" }}>(Ruta para crear rutina)</small>
          </button>
        </Link>

        <Link to="/vistacuidador" style={{ textDecoration: "none" }}>
          <button className="btn w-100 shadow-sm" style={btnStyle}>
            <i className="fas fa-user-friends mb-2" style={iconStyle}></i>
            <h5 className="m-0 fw-bold text-dark">CUIDADOR/A</h5>
            <small className="text-muted text-uppercase" style={{ fontSize: "0.7rem" }}>(Aqui se gestiona Rutina)</small>
          </button>
        </Link>

        <button className="btn w-100 shadow-sm" style={btnStyle}>
          <i className="fas fa-baby mb-2" style={iconStyle}></i>
          <h5 className="m-0 fw-bold text-dark">ZZZYNC</h5>
          <small className="text-muted text-uppercase" style={{ fontSize: "0.7rem" }}>(Visualizacion de progreso)</small>
        </button>
      </div>

    </div>
  );
};