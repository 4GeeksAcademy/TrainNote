import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import useGlobalReducer from "../hooks/useGlobalReducer"; 
import logoApp from "../assets/Logo Baby Zzync 1 - vers blanca.png";

export const Login = () => {
  const { store, actions, dispatch } = useGlobalReducer(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user));
        
        dispatch({ type: 'set_user', payload: data.user });
        
        await actions.loadParentData();
        
        navigate("/home");
      } else {
        const errorData = await response.json();
        alert(errorData.msg || "Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="p-4 text-center text-white" style={{ backgroundColor: "var(--color-primario)" }}>
        <img src={logoApp} alt="Logo Baby Zzzync" style={{ width: "190px", height: "auto" }} />
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted mb-1">Correo Electrónico:</label>
            <input 
              type="email" 
              className="form-control rounded-3" 
              placeholder="Tu Email aquí" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-1">
            <label className="form-label small fw-bold text-muted mb-1">Contraseña:</label>
            <input 
              type="password" 
              className="form-control rounded-3" 
              placeholder="Tu contraseña aquí" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4 text-start">
            <Link to="/registro" className="small text-decoration-none fw-bold" style={{ color: "var(--color-descanso)" }}>
              ¿No estás registrado?
            </Link>
          </div>
          <button 
            type="submit" 
            className="btn w-100 py-2 mt-2" 
            style={{ backgroundColor: "var(--color-descanso)", color: "white", borderRadius: "50px", border: "none" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};