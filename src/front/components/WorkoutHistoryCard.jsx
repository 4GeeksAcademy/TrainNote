import React, { useState, useEffect } from "react";
import { getFechaLocal } from "../utils/dateHelpers";
const ITEMS_POR_PAGINA = 5;

export const WorkoutHistoryCard = ({
  workouts,
  desde,
  hasta,
  onDesdeChange,
  onHastaChange,
  onFilter,
  onDelete,
}) => {
  const [eliminandoId, setEliminandoId] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const hoy = getFechaLocal();

  useEffect(() => {
    setPaginaActual(1);
  }, [workouts]);

  const totalPaginas = Math.max(1, Math.ceil(workouts.length / ITEMS_POR_PAGINA));
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const workoutsPagina = workouts.slice(inicio, inicio + ITEMS_POR_PAGINA);

  const handleFiltrar = (e) => {
    e.preventDefault();
    onFilter();
  };

  const handleEliminar = async (entrenamientoId) => {
    setEliminandoId(entrenamientoId);
    await onDelete(entrenamientoId);
    setEliminandoId(null);
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const [anio, mes, dia] = fechaStr.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl shadow-xl h-full flex flex-col">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3">
        <span className="material-symbols-outlined text-[#ff6b00] text-base">history</span>
        <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Historial de Entrenamientos</h3>
      </div>

      <form onSubmit={handleFiltrar} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => onDesdeChange(e.target.value)}
            max={hasta}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => onHastaChange(e.target.value)}
            min={desde}
            max={hoy}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full bg-white/5 hover:bg-white/10 border border-white/15 text-[#e2bfb0] font-extrabold text-[11px] font-mono uppercase tracking-wider px-4 py-2 rounded-lg transition-all cursor-pointer"
          >
            Filtrar
          </button>
        </div>
      </form>

      <div className="flex-1 space-y-3 pr-1">
        {workouts.length === 0 && (
          <p className="text-[10px] font-mono text-[#e2bfb0]/50 text-center py-6 uppercase">
            Sin registros en el rango seleccionado.
          </p>
        )}

        {workoutsPagina.map((registro) => (
          <div
            key={registro.EntrenamientoID}
            className="bg-black/40 border border-white/5 rounded-lg p-3.5 space-y-2.5"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div>
                <p className="text-xs sm:text-sm font-mono text-white font-bold">{registro.Nota || "Sesión de Entrenamiento"}</p>
                <p className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase mt-0.5">
                  📅 {formatFecha(registro.Fecha)} | ⏱️ {registro.Duracion} min
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleEliminar(registro.EntrenamientoID)}
                disabled={eliminandoId === registro.EntrenamientoID}
                className="text-[#e2bfb0]/60 hover:text-[#ffb4ab] transition-colors focus:outline-none cursor-pointer disabled:opacity-40 flex items-center justify-center p-1"
              >
                <span className="material-symbols-outlined text-lg">
                  {eliminandoId === registro.EntrenamientoID ? "hourglass_empty" : "delete"}
                </span>
              </button>
            </div>

            <div className="space-y-1.5">
              {registro.ejercicios && registro.ejercicios.map((ej, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono text-[#e2bfb0]/90 bg-white/5 px-3 py-1.5 rounded-md">
                  <span className="text-white font-medium">{ej.nombre_ejercicio}</span>
                  <div className="flex gap-4 text-[11px]">
                    <span className="text-[#ff6b00] font-bold">{ej.series} sets</span>
                    <span className="text-white">{ej.repeticiones} reps</span>
                    <span className="text-emerald-300 font-bold">{ej.peso_kg} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
        <button
          type="button"
          onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
          disabled={paginaActual === 1}
          className="text-[10px] font-mono uppercase text-[#e2bfb0]/70 hover:text-[#ff6b00] disabled:opacity-30 disabled:hover:text-[#e2bfb0]/70 transition-colors cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
          Anterior
        </button>

        <span className="text-[9px] font-mono text-[#e2bfb0]/50 uppercase">
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          type="button"
          onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaActual === totalPaginas}
          className="text-[10px] font-mono uppercase text-[#e2bfb0]/70 hover:text-[#ff6b00] disabled:opacity-30 disabled:hover:text-[#e2bfb0]/70 transition-colors cursor-pointer flex items-center gap-1"
        >
          Siguiente
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
};