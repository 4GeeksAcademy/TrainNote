import React, { useState } from "react";
import { getFechaLocal } from "../utils/dateHelpers";

export const NutritionQuickForm = ({ onSubmit, loading }) => {
  const hoy = getFechaLocal();

  const [fecha, setFecha] = useState(hoy);
  const [nombreDeLaComida, setNombreDeLaComida] = useState("");
  const [tipoDeComida, setTipoDeComida] = useState("");
  const [calorias, setCalorias] = useState("");
  const [proteinasG, setProteinasG] = useState("");
  const [carbohidratosG, setCarbohidratosG] = useState("");
  const [grasasG, setGrasasG] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      fecha,
      nombre_de_la_comida: nombreDeLaComida,
      tipo_de_comida: tipoDeComida,
      calorias: parseFloat(calorias) || 0, // Clave corregida sin acento
      proteinas_g: parseFloat(proteinasG) || 0,
      carbohidratos_g: parseFloat(carbohidratosG) || 0,
      grasas_g: parseFloat(grasasG) || 0,
    };

    setIsSubmitting(true);
    try {
      const ok = await onSubmit(payload);
      if (ok) {
        setNombreDeLaComida("");
        setCalorias("");
        setProteinasG("");
        setCarbohidratosG("");
        setGrasasG("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3">
        <span className="material-symbols-outlined text-[#ff6b00] text-base">restaurant</span>
        <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Registrar Comida</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Fecha</label>
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
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Nombre del Alimento</label>
          <input
            type="text"
            placeholder="Ej. Bowl de Avena y Frutos"
            value={nombreDeLaComida}
            onChange={(e) => setNombreDeLaComida(e.target.value)}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Tipo de Comida</label>
          <select
            value={tipoDeComida}
            onChange={(e) => setTipoDeComida(e.target.value)}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
            required
          >
            <option value="" disabled className="bg-[#1a1a1a] text-[#e2bfb0]/60">Seleccionar tipo de comida</option>
            <option value="DESAYUNO" className="bg-[#1a1a1a] text-white">Desayuno</option>
            <option value="ALMUERZO" className="bg-[#1a1a1a] text-white">Almuerzo</option>
            <option value="CENA" className="bg-[#1a1a1a] text-white">Cena</option>
            <option value="MERIENDA" className="bg-[#1a1a1a] text-white">Merienda</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Calorías (kcal)</label>
            <input
              type="number"
              step="any"
              min="0"
              placeholder="0"
              value={calorias}
              onChange={(e) => setCalorias(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Proteína (g)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="0.0"
              value={proteinasG}
              onChange={(e) => setProteinasG(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Carbohidratos (g)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="0.0"
              value={carbohidratosG}
              onChange={(e) => setCarbohidratosG(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Grasas (g)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="0.0"
              value={grasasG}
              onChange={(e) => setGrasasG(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 disabled:opacity-50 text-white font-extrabold text-[11px] font-mono uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-[0_0_12px_rgba(255,107,0,0.3)] transition-all cursor-pointer mt-1 flex items-center justify-center gap-2"
        >
          {isSubmitting && (
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {isSubmitting ? "Guardando..." : "Guardar Registro"}
        </button>
      </form>
    </div>
  );
};
