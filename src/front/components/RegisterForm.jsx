import React, { useState } from "react";

export const RegisterForm = ({ onSubmit, loading }) => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre, email, password, confirmPassword });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-black/40 px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">Email</label>
          <input
            type="email"
            placeholder="email@atleta.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/40 px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">Clave</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/40 px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">Confirmar</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-black/40 px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white"
          />
        </div>
      </div>

      <div className="p-4 bg-white/[0.03] rounded-xl border border-white/5 space-y-2">
        <p className="text-xs font-bold text-[#e2bfb0] uppercase tracking-widest">Seguridad del Perfil:</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#ff6b00]">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>8+ caracteres requeridos</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#e2bfb0]/40">
            <span className="material-symbols-outlined text-[16px]">circle</span>
            <span>Mayúscula y número</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-[#ff6b00] text-white font-bold text-lg rounded-xl hover:shadow-[0_0_25px_rgba(255,107,0,0.4)] transition-all active:scale-[0.98] uppercase tracking-widest cursor-pointer"
      >
        Crear Perfil
      </button>
    </form>
  );
};