import React from "react";
import { useNavigate, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const user = localStorage.getItem("user");

    if (!user || user === "undefined" || user === "null") {
        return (
            <>
                <div style={{ filter: "blur(8px)", pointerEvents: "none", userSelect: "none" }}>
                    {children}
                </div>

                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center",
                    alignItems: "center", zIndex: 9999, padding: "20px", backdropFilter: "blur(4px)"
                }}>
                    <div style={{
                        backgroundColor: "white", padding: "40px", borderRadius: "25px",
                        textAlign: "center", maxWidth: "400px", width: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                    }}>
                        <i className="fas fa-lock mb-3" style={{ fontSize: "50px", color: "#dc3545" }}></i>
                        <h3 className="fw-bold mb-2">Acceso Restringido</h3>
                        <p className="text-muted mb-4">Debes iniciar sesión para gestionar tus rutinas.</p>
                        
                        <button 
                            onClick={() => navigate("/")}
                            className="btn w-100 py-3 fw-bold" 
                            style={{ backgroundColor: "#007bff", color: "white", borderRadius: "50px", border: "none" }}
                        >
                            Ir al Login
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return children;
};

export default ProtectedRoute;