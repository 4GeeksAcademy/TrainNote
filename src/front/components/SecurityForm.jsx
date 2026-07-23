import React, { useState } from "react";

export const SecurityForm = ({ onSubmitPassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitPassword(currentPassword, newPassword, confirmPassword, () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    });
  };

  return (
    <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl w-full">
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
        <span className="material-symbols-outlined text-[#ff6b00]">lock_reset</span>
        <h3 className="text-sm font-mono font-bold uppercase text-white tracking-widest">Seguridad y Acceso</h3>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase tracking-wider block mb-1">Contraseña Actual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase tracking-wider block mb-1">Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mín. 8 caracteres"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase tracking-wider block mb-1">Confirmar Nueva Clave</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la contraseña"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
            required
          />
        </div>

        <div className="md:col-span-3 pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full md:w-auto bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-extrabold text-xs font-mono uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all cursor-pointer"
          >
            Actualizar Contraseña
          </button>
        </div>
      </form>
    </div>
  );
};