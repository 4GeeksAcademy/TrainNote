import React, { useState } from "react";

export const RegisterForm = ({ onSubmit, loading }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 


  const hasMinLength = password.length >= 8;
  const hasUpperAndNumber = /[A-Z]/.test(password) && /\d/.test(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    if (!hasMinLength) {
      setErrorMessage("La contraseña no es correcta: debe tener al menos 8 caracteres.");
      return;
    }

    if (!hasUpperAndNumber) {
      setErrorMessage("La contraseña no es correcta: debe incluir al menos una letra mayúscula y un número.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    onSubmit({ nombre, email, password, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-auto">
      {/* ALERTA DE ERROR VISUAL */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-3 rounded-xl border text-xs font-medium text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab]/20">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-black/40 px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white font-mono text-sm"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">Email</label>
          <input
            type="email"
            placeholder="email@atleta.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/40 px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white font-mono text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo Clave */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">Clave</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 pl-4 pr-12 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white font-mono text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e2bfb0]/60 hover:text-white transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Campo Confirmar Clave */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">Confirmar</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/40 pl-4 pr-12 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white font-mono text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e2bfb0]/60 hover:text-white transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-xl">
                {showConfirmPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Indicadores de seguridad dinámicos */}
      <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5 space-y-2">
        <p className="text-xs font-bold text-[#e2bfb0] uppercase tracking-widest">Seguridad del Perfil:</p>
        <div className="space-y-1">
          <div className={`flex items-center gap-2 text-xs transition-colors ${hasMinLength ? "text-[#ff6b00]" : "text-[#e2bfb0]/40"}`}>
            <span className="material-symbols-outlined text-[16px]">
              {hasMinLength ? "verified" : "circle"}
            </span>
            <span>8+ caracteres requeridos</span>
          </div>

          <div className={`flex items-center gap-2 text-xs transition-colors ${hasUpperAndNumber ? "text-[#ff6b00]" : "text-[#e2bfb0]/40"}`}>
            <span className="material-symbols-outlined text-[16px]">
              {hasUpperAndNumber ? "verified" : "circle"}
            </span>
            <span>Mayúscula y número</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-[#ff6b00] text-white font-bold text-lg rounded-xl hover:shadow-[0_0_25px_rgba(255,107,0,0.4)] transition-all active:scale-[0.98] uppercase tracking-widest cursor-pointer"
      >
        {loading ? "Creando..." : "Crear Perfil"}
      </button>
    </form>
  );
};