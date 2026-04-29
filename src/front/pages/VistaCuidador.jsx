import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { HeaderApp } from "../components/HeaderApp";
import Swal from "sweetalert2";

export const VistaCuidador = () => {
    const { actions } = useGlobalReducer();
    const navigate = useNavigate();
    const [rutinasAsignadas, setRutinasAsignadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

    const fetchRutinasCompartidas = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${apiUrl}/api/cuidador/rutinas`, {
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRutinasAsignadas(data);
            }
        } catch (error) {
            console.error("Error al obtener rutinas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRutinasCompartidas();
    }, [apiUrl]);

    const handleEliminarRutina = async (idAsignacion) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta rutina dejará de aparecer en tu lista de cuidador.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--color-primario)",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            borderRadius: "15px",
        });

        if (result.isConfirmed) {
            const success = await actions.deleteRutinaCompartida(idAsignacion);
            
            if (success) {
                setRutinasAsignadas(prev => prev.filter(item => item.id !== idAsignacion));
                Swal.fire({
                    title: "¡Eliminado!",
                    text: "La rutina ha sido quitada de tu vista.",
                    icon: "success",
                    confirmButtonColor: "var(--color-primario)",
                    timer: 2000
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudo eliminar la rutina. Inténtalo de nuevo.",
                    icon: "error",
                    confirmButtonColor: "var(--color-primario)"
                });
            }
        }
    };

    return (
        <div className="w-100 min-vh-100 d-flex flex-column bg-light">
            <HeaderApp 
                showBackButton={true} 
                onBackClick={() => navigate("/home")} 
            />

            <div className="flex-grow-1 p-4">
                <div className="text-center mb-4">
                    <i className="fas fa-user-friends mb-2" style={{ fontSize: "2.5rem", color: "var(--color-primario)" }}></i>
                    <h2 className="fw-bold">Área del Cuidador</h2>
                    <p className="text-muted">Rutinas compartidas contigo</p>
                </div>

                <div className="d-flex flex-column gap-3">
                    {loading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2">Cargando rutinas...</p>
                        </div>
                    ) : rutinasAsignadas.length === 0 ? (
                        <div className="text-center p-5 bg-white rounded-4 shadow-sm">
                            <i className="fas fa-info-circle mb-2 text-muted"></i>
                            <p className="text-muted m-0">No tienes rutinas asignadas todavía.</p>
                        </div>
                    ) : (
                        rutinasAsignadas.map((item) => (
                            <div key={item.id} className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                                <div className="d-flex align-items-center">
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                                        style={{ width: "60px", height: "60px", backgroundColor: "var(--color-fondoBotones)" }}
                                    >
                                        {item.hijo.fotoUrl ? (
                                            <img src={item.hijo.fotoUrl} alt={item.hijo.nombre} className="rounded-circle w-100 h-100" style={{objectFit: "cover"}} />
                                        ) : (
                                            <i className="fas fa-baby text-primary fs-3"></i>
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="m-0 fw-bold">{item.rutina.nombre}</h5>
                                        <p className="m-0 text-muted small">
                                            <i className="fas fa-child me-1"></i> {item.hijo.nombre} {item.hijo.apellido}
                                        </p>
                                    </div>
                                    
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-sm rounded-pill text-white px-3"
                                            style={{ backgroundColor: "var(--color-primario)" }}
                                            onClick={() => navigate(`/detalle-rutina-hijo/${item.rutina.id}`, { 
                                                state: { 
                                                    rutina: item.rutina, 
                                                    hijo: item.hijo,
                                                    esCuidador: true 
                                                } 
                                            })}
                                        >
                                            Ver
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger rounded-circle"
                                            title="Eliminar de mi vista"
                                            onClick={() => handleEliminarRutina(item.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};