import React, { useState, useEffect } from "react";

export const Carduser = () => {
  const [userData, setUserData] = useState({
    nombre: "Usuario Padre",
    fotoUrl: null 
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData({
        nombre: parsedUser.nombre || "Usuario Padre",
        fotoUrl: parsedUser.foto_perfil || null
      });
    }
  }, []);

  return (
    <div className="d-flex align-items-center p-2 mb-4 shadow-sm" 
         style={{ borderRadius: "50px", backgroundColor: "#fbfbfb", border: "1px solid #eee" }}>
      
      <div className="d-flex align-items-center justify-content-center shadow-sm" 
           style={avatarStyle}>
        {userData.fotoUrl ? (
          <img src={userData.fotoUrl} alt="User" style={imgStyle} />
        ) : (
          <i className="fas fa-user text-white" style={{ fontSize: "1.1rem" }}></i>
        )}
      </div>

      <div className="ms-3">
        <p className="m-0 fw-bold" style={{ color: "#555", fontSize: "1rem" }}>
          {userData.nombre}
        </p>
        <p className="m-0 text-muted" style={{ fontSize: "0.75rem", marginTop: "-3px" }}>
          @{userData.nombre.toLowerCase().replace(/\s+/g, '')}
        </p>
      </div>

    </div>
  );
};

const avatarStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  backgroundColor: "var(--color-primario)", 
  overflow: "hidden",
  flexShrink: 0
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};