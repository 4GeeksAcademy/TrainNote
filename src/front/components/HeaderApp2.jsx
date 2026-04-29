import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoApp from "../assets/Logo Baby Zzync 1 - vers blanca.png";

export const HeaderApp2 = ({ showBackButton = false, onBackClick }) => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    const dropdownStyle = {
        position: "absolute",
        top: "70px",
        right: "15px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        zIndex: 1000,
        display: showMenu ? "block" : "none",
        overflow: "hidden"
    };

    const dropdownItemStyle = {
        padding: "12px 20px",
        width: "100%",
        border: "none",
        backgroundColor: "transparent",
        textAlign: "left",
        fontSize: "0.9rem",
        fontWeight: "bold",
        cursor: "pointer",
        borderBottom: "1px solid #f0f0f0"
    };

    return (
        <div 
            className="d-flex align-items-center justify-content-between p-3" 
            style={{ 
                backgroundColor: "var(--color-primario)", 
                minHeight: "80px", 
                position: "relative" 
            }}
        >
            <div style={{ width: "40px flex-shrink-0" }}>
                {showBackButton ? (
                    <i
                        className="fas fa-arrow-left fa-lg text-white"
                        style={{ cursor: "pointer" }}
                        onClick={onBackClick}
                    ></i>
                ) : (
                    <i 
                        className="fas fa-arrow-left fa-lg text-white" 
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/Home")}
                    ></i>
                )}
            </div>

            <div className="flex-grow-1 text-center">
                <img 
                    src={logoApp} 
                    alt="Logo Baby Zzzync" 
                    style={{ width: "150px", height: "auto" }} 
                />
            </div>

            <div style={{ width: "40px", textAlign: "right" }}>
                <i
                    className="fas fa-bars fa-lg text-white"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowMenu(!showMenu)}
                ></i>
            </div>

            <div style={dropdownStyle}>
                <button 
                    style={dropdownItemStyle} 
                    onClick={() => navigate("/rutinas", { state: { from: window.location.pathname } })}
                >
                    <i className="fas fa-calendar-alt me-2"></i> RUTINAS
                </button>

                <button 
                    style={{ ...dropdownItemStyle, borderBottom: "none", color: "red" }} 
                    onClick={handleLogout}
                >
                    <i className="fas fa-sign-out-alt me-2"></i> CERRAR SESIÓN
                </button>
            </div>
        </div>
    );
};