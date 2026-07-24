import React, { useState } from "react";
import { getFechaLocal } from "../utils/dateHelpers";
export const WeightQuickForm = ({ onSubmit, loading }) => {
  const hoy = getFechaLocal();

  const [fecha, setFecha] = useState(hoy);
  const [pesoActual, setPesoActual] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit(fecha, parseFloat(pesoActual));
    if (ok) {
      setPesoActual("");
    }
  };

  return (
    <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3">
        <span className="material-symbols-outlined text-[#ff6b00] text-base">monitor_weight</span>
        <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Registrar Peso</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Fecha de Pesaje</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            max={hoy}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Peso Actual (kg)</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="00.0"
              value={pesoActual}
              onChange={(e) => setPesoActual(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2.5 pr-10 text-lg font-bold text-white/90 focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              required
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#e2bfb0]/60 uppercase">kg</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 disabled:opacity-50 text-white font-extrabold text-[11px] font-mono uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-[0_0_12px_rgba(255,107,0,0.3)] transition-all cursor-pointer mt-1"
        >
          {loading ? "Guardando..." : "Guardar Registro"}
        </button>
      </form>
    </div>
  );
};