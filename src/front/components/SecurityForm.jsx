import React, { useState } from "react";

export const SecurityForm = ({ onSubmitPassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasMinLength = newPassword.length >= 8;
  const hasUpperAndNumber = /[A-Z]/.test(newPassword) && /\d/.test(newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!hasMinLength) {
      setErrorMessage("La nueva contraseña no es correcta: debe tener al menos 8 caracteres.");
      return;
    }

    if (!hasUpperAndNumber) {
      setErrorMessage("La nueva contraseña no es correcta: debe incluir al menos una letra mayúscula y un número.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    onSubmitPassword(currentPassword, newPassword, confirmPassword, () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrorMessage("");
    });
  };

  return (
    <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3">
        <span className="material-symbols-outlined text-[#ff6b00] text-base">lock_reset</span>
        <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Seguridad y Credenciales</h3>
      </div>

      {/* ALERTA DE ERROR VISUAL */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-3 mb-3 rounded-xl border text-xs font-medium text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab]/20">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Contraseña Actual</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 pr-10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#e2bfb0]/60 hover:text-white transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">
                {showCurrentPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Nueva Contraseña</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 pr-10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#e2bfb0]/60 hover:text-white transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">
                {showNewPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Confirmar Nueva Contraseña</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 pr-10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#e2bfb0]/60 hover:text-white transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">
                {showConfirmPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Indicadores de seguridad dinámicos (basados en la nueva contraseña) */}
        <div className="sm:col-span-3 p-4 bg-white/[0.03] rounded-xl border border-white/5 space-y-2">
          <p className="text-xs font-bold text-[#e2bfb0] uppercase tracking-widest">Seguridad de la Nueva Contraseña:</p>
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

        <div className="sm:col-span-3 pt-1 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-extrabold text-[11px] font-mono uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-[0_0_12px_rgba(255,107,0,0.3)] transition-all cursor-pointer"
          >
            Actualizar Contraseña
          </button>
        </div>
      </form>
    </div>
  );
};