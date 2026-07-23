import React, { useState, useEffect } from "react";

export const PersonalDataForm = ({ user, onSubmit }) => {
  const [nombre, setNombre] = useState("");
  const [objetivo, setObjetivo] = useState("Rendimiento Atlético");
  const [altura, setAltura] = useState("");
  const [pesoDeseado, setPesoDeseado] = useState("");

  useEffect(() => {
    if (user) {
      setNombre(user.Nombre || user.nombre || "");
      setObjetivo(user.Objetivo || user.objetivo || "Rendimiento Atlético");
      setAltura(user.Altura || user.altura || "");
      setPesoDeseado(user.PesoDeseado || user.peso_deseado || "");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      nombre,
      objetivo,
      altura: parseFloat(altura) || 0,
      peso_deseado: parseFloat(pesoDeseado) || 0,
    });
  };

  return (
    <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl flex-1">
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
        <span className="material-symbols-outlined text-[#ff6b00]">person_edit</span>
        <h3 className="text-sm font-mono font-bold uppercase text-white tracking-widest">Datos Personales</h3>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase tracking-wider block mb-1">Nombre Completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase tracking-wider block mb-1">Objetivo Fitness</label>
          <select
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
          >
            <option className="bg-[#1a1a1a]">Hipertrofia Muscular</option>
            <option className="bg-[#1a1a1a]">Pérdida de Grasa</option>
            <option className="bg-[#1a1a1a]">Rendimiento Atlético</option>
            <option className="bg-[#1a1a1a]">Mantenimiento</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase tracking-wider block mb-1">Altura (cm)</label>
          <input
            type="number"
            step="0.1"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase tracking-wider block mb-1">Peso Deseado (kg)</label>
          <input
            type="number"
            step="0.1"
            value={pesoDeseado}
            onChange={(e) => setPesoDeseado(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
          />
        </div>

        <div className="sm:col-span-2 pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-extrabold text-xs font-mono uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all cursor-pointer"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};