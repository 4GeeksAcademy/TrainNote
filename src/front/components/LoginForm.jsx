import React, { useState } from "react";

export const LoginForm = ({ onSubmit, onForgotPassword, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 my-auto">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">
            Correo Electrónico
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e2bfb0]/40 group-focus-within:text-[#ff6b00]">
              mail
            </span>
            <input
              type="email"
              placeholder="atleta@trainnote.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 pl-12 pr-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] focus:shadow-[0_0_15px_rgba(255,107,0,0.15)] transition-all text-white placeholder:text-white/10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">
            Contraseña
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e2bfb0]/40 group-focus-within:text-[#ff6b00]">
              lock
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 pl-12 pr-12 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] focus:shadow-[0_0_15px_rgba(255,107,0,0.15)] transition-all text-white placeholder:text-white/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e2bfb0]/40 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-[#ff6b00] text-white font-bold text-lg rounded-xl hover:shadow-[0_0_25px_rgba(255,107,0,0.4)] transition-all active:scale-[0.98] uppercase tracking-widest cursor-pointer"
      >
        {loading ? "Cargando..." : "INGRESAR"}
      </button>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs font-mono text-[#ff6b00] hover:text-[#ff6b00]/80 transition-colors uppercase tracking-widest cursor-pointer"
        >
          ¿Olvidaste tu clave?
        </button>
      </div>
    </form>
  );
};