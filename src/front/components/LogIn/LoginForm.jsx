import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../../services/session";
import { useUser } from "../../context/UserContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LoginForm = () => {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data?.msg || "Credenciales invalidas");
        return;
      }

      if (!data?.token) {
        setError("Respuesta de login invalida");
        return;
      }

      session.setToken(data.token);
      if (data.user) {
        updateUser(data.user);
      }

      navigate("/home", { replace: true });
    } catch {
      setError("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <label>Correo electronico</label>
      <div className="input-wrapper">
        <input
          type="email"
          placeholder="ciclista@trail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <label>Contrasena</label>
      <div className="input-wrapper">
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="signup-button" disabled={loading}>
        {loading ? "Entrando..." : "INICIAR SESION"}
      </button>
    </form>
  );
};

export default LoginForm;
