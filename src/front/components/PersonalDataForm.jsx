import React, { useState, useEffect } from "react";

export const PersonalDataForm = ({ user, onSubmit }) => {
  const [nombre, setNombre] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [altura, setAltura] = useState("");
  const [pesoDeseado, setPesoDeseado] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setNombre(user.Nombre || user.nombre || "");
      setObjetivo(user.Objetivo || user.objetivo || "");
      setAltura(user.Altura || user.altura || "");
      setPesoDeseado(user.PesoDeseado || user.peso_deseado || "");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!objetivo) {
      setErrorMessage("Por favor selecciona un objetivo fitness antes de guardar.");
      return;
    }

    onSubmit({
      nombre,
      objetivo,
      altura: parseFloat(altura) || 0,
      peso_deseado: parseFloat(pesoDeseado) || 0,
    });
  };

  return (
    <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl shadow-xl flex-1 flex flex-col justify-between">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3">
        <span className="material-symbols-outlined text-[#ff6b00] text-base">person_edit</span>
        <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Datos Personales</h3>
      </div>

      {/* ALERTA DE ERROR VISUAL */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-3 mb-3 rounded-xl border text-xs font-medium text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab]/20">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Nombre Completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Objetivo Fitness</label>
          <select
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
          >
            {/* Sin "disabled": así el navegador respeta el valor "" cuando no hay objetivo guardado */}
            <option value="" className="bg-[#1a1a1a] text-[#e2bfb0]/60">Seleccione objetivo</option>
            <option value="Hipertrofia Muscular" className="bg-[#1a1a1a] text-white">Hipertrofia Muscular</option>
            <option value="Pérdida de Grasa" className="bg-[#1a1a1a] text-white">Pérdida de Grasa</option>
            <option value="Rendimiento Atlético" className="bg-[#1a1a1a] text-white">Rendimiento Atlético</option>
            <option value="Mantenimiento" className="bg-[#1a1a1a] text-white">Mantenimiento</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Altura (cm)</label>
          <input
            type="number"
            step="0.1"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Peso Deseado (kg)</label>
          <input
            type="number"
            step="0.1"
            value={pesoDeseado}
            onChange={(e) => setPesoDeseado(e.target.value)}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
          />
        </div>

        <div className="sm:col-span-2 pt-1 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-extrabold text-[11px] font-mono uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-[0_0_12px_rgba(255,107,0,0.3)] transition-all cursor-pointer"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};
