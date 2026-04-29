import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderApp4 } from "../components/HeaderApp4";

export const CrearRutina = () => {
    const navigate = useNavigate();
    
    const [nombre, setNombre] = useState("");
    const [detalles, setDetalles] = useState("");
    const [errores, setErrores] = useState({ nombre: false, detalles: false });

    const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

    const handleCrearRutina = async () => {
        const token = localStorage.getItem("token");
        
        if (!token) {
            navigate("/");
            return;
        }

        const nuevosErrores = {
            nombre: nombre.trim() === "",
            detalles: detalles.trim() === ""
        };
        setErrores(nuevosErrores);

        if (!nuevosErrores.nombre && !nuevosErrores.detalles) {
            try {
                const response = await fetch(`${apiUrl}/api/rutinas`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ nombre, detalles })
                });

                if (response.ok) {
                    navigate("/rutinas", { replace: true }); 
                }
            } catch (error) {
                console.error("Error en la petición:", error);
            }
        }
    };

    return (
        <div className="w-100 h-100 d-flex flex-column bg-white">
            <HeaderApp4 showBackButton={true} onBackClick={() => navigate("/rutinas")} />

            <div className="p-4 flex-grow-1 d-flex flex-column">
                <div className="mb-4 text-center">
                    <h1 className="fw-bold" style={{ color: "var(--color-primario)", fontSize: "1.5rem" }}>NUEVA RUTINA</h1>
                </div>

                <form className="d-flex flex-column h-100" onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control py-3 px-4 text-center shadow-sm"
                            placeholder="NOMBRE DE LA RUTINA"
                            value={nombre}
                            onChange={(e) => {
                                setNombre(e.target.value);
                                setErrores({ ...errores, nombre: false });
                            }}
                            style={{
                                borderRadius: "20px",
                                border: errores.nombre ? "2px solid red" : "1px solid #eee",
                                fontSize: "0.9rem",
                                fontWeight: "bold"
                            }}
                        />
                        {errores.nombre && <small className="text-danger d-block text-center mt-2 fw-bold">CAMPO OBLIGATORIO</small>}
                    </div>

                    <div className="mb-4">
                        <textarea
                            className="form-control py-3 px-4 text-center shadow-sm"
                            placeholder="DETALLES DE LA RUTINA"
                            rows="4"
                            value={detalles}
                            onChange={(e) => {
                                setDetalles(e.target.value);
                                setErrores({ ...errores, detalles: false });
                            }}
                            style={{
                                borderRadius: "20px",
                                border: errores.detalles ? "2px solid red" : "1px solid #eee",
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                                resize: "none"
                            }}
                        ></textarea>
                        {errores.detalles && <small className="text-danger d-block text-center mt-2 fw-bold">CAMPO OBLIGATORIO</small>}
                    </div>

                    <div className="mt-auto">
                        <button
                            type="button"
                            onClick={handleCrearRutina}
                            className="btn w-100 py-3 mb-3"
                            style={{
                                backgroundColor: "var(--color-primario)",
                                color: "white",
                                borderRadius: "50px",
                                fontWeight: "bold",
                                boxShadow: "0 4px 12px rgba(72, 12, 168, 0.3)"
                            }}
                        >
                            CREAR RUTINA
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/rutinas")}
                            className="btn w-100 py-3"
                            style={{
                                backgroundColor: "white",
                                color: "var(--color-primario)",
                                borderRadius: "50px",
                                border: "2px solid var(--color-primario)",
                                fontWeight: "bold"
                            }}
                        >
                            CANCELAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};