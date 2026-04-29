import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HeaderApp4 } from "../components/HeaderApp4";

export const AsignarRutina = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [rutinasAsignadas, setRutinasAsignadas] = useState([]);
    const hijo = location.state?.hijo;
    const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

    useEffect(() => {
        if (hijo) {
            const token = localStorage.getItem("token");
            fetch(`${apiUrl}/api/hijos/${hijo.id}/rutinas`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setRutinasAsignadas(data);
            })
            .catch(err => console.error(err));
        }
    }, [hijo, apiUrl]);

    return (
        <div className="w-100 h-100 d-flex flex-column bg-white">
            <HeaderApp4 showBackButton={true} onBackClick={() => navigate("/menupadre")} />
            <div className="p-4 flex-grow-1 overflow-auto">
                <div className="d-flex align-items-center mb-4">
                    <img 
                        src={hijo?.fotoUrl || "https://via.placeholder.com/50"} 
                        alt="hijo" 
                        className="rounded-circle me-3" 
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                    <h5 className="fw-bold m-0" style={{ color: "var(--color-primario)" }}>
                        Rutinas de {hijo?.nombre}
                    </h5>
                </div>
                
                {rutinasAsignadas.length === 0 ? (
                    <div className="text-center py-5 opacity-50">
                        <i className="fas fa-calendar-alt fa-3x mb-2"></i>
                        <p>No hay rutinas asignadas</p>
                        <button className="btn btn-sm text-white" style={{backgroundColor: "var(--color-primario)"}} onClick={() => navigate("/rutinas", { state: { hijo } })}>IR A ASIGNAR</button>
                    </div>
                ) : (
                    rutinasAsignadas.map(rutina => (
                        <div 
                            key={rutina.id} 
                            className="card shadow-sm border-0 mb-3 p-3 rounded-4" 
                            style={{ cursor: "pointer", backgroundColor: "#f8f9fa", borderLeft: "5px solid var(--color-primario)" }}
                            onClick={() => navigate(`/detalle-rutina-hijo/${rutina.id}`, { state: { rutina, hijo } })}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="fw-bold m-0" style={{ color: "var(--color-primario)" }}>{rutina.nombre}</h6>
                                    <small className="text-muted">{rutina.detalles}</small>
                                </div>
                                <i className="fas fa-chevron-right text-muted small"></i>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};