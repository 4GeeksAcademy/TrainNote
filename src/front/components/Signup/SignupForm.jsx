import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const signupResp = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const signupData = await signupResp.json();
      if (!signupResp.ok) {
        setError(signupData?.msg || "Error en registro");
        return;
      }

      navigate("/login", { replace: true });
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
        {loading ? "Registrando..." : "Lanzate al trail"}
      </button>
    </form>
  );
};

export default SignupForm;
