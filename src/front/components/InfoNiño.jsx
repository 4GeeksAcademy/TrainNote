import React from "react";

export const InfoNiño = ({ nombre, apellidos, edad, fotoUrl }) => {
    return (
        <div className="d-flex align-items-center gap-3 mb-4 p-3" 
             style={{ 
                backgroundColor: "#ffffff",
                borderRadius: "25px", 
                border: "none", 
                boxShadow: "0 4px 12px rgba(130, 130, 130, 0.3)" 
             }}>
            
            <div className="flex-grow-1">
                <div className="mb-3 d-flex align-items-end pb-1">
                    <h4 className="fw-bold m-0" style={{ color: "var(--color-primario)", fontSize: "0.9rem" }}>NOMBRE: </h4>
                    <h4 className="m-0 ms-2 fw-normal" style={{ fontSize: "1.1rem", color: "#000000" }}> 
                        {nombre} 
                    </h4>
                </div>
                <div className="mb-3 d-flex align-items-end pb-1">
                    <h4 className="fw-bold m-0" style={{ color: "var(--color-primario)", fontSize: "0.9rem" }}>APELLIDOS: </h4>
                    <h4 className="m-0 ms-2 fw-normal" style={{ fontSize: "1.1rem", color: "#000000" }}> 
                        {apellidos} 
                    </h4>
                </div>
                <div className="d-flex align-items-end pb-1">
                    <h4 className="fw-bold m-0" style={{ color: "var(--color-primario)", fontSize: "0.9rem" }}>EDAD: </h4>
                    <h4 className="m-0 ms-2 fw-normal" style={{ fontSize: "1.1rem", color: "#000000" }}> 
                        {edad} 
                    </h4>
                </div>
            </div>

            <div className="text-center">
                <div className="profile-circle d-flex align-items-center justify-content-center" 
                     style={{ width: "95px", height: "95px", borderStyle: "dashed", overflow: "hidden" }}>
                    {fotoUrl ? (
                        <img src={fotoUrl} alt="Niño" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span style={{ fontSize: "11px", fontWeight: "bold", textAlign: "center", lineHeight: "1" }}>
                            FOTO <br /> NIÑO
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};