import React, { useState, useEffect } from "react";
import { getFechaLocal } from "../utils/dateHelpers";

const ITEMS_POR_PAGINA = 5;

export const WeightHistoryCard = ({
  weights,
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
  }, [weights]);

  const totalPaginas = Math.max(1, Math.ceil(weights.length / ITEMS_POR_PAGINA));
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const weightsPagina = weights.slice(inicio, inicio + ITEMS_POR_PAGINA);

  const handleFiltrar = (e) => {
    e.preventDefault();
    onFilter();
  };

  const handleEliminar = async (pesoId) => {
    setEliminandoId(pesoId);
    await onDelete(pesoId);
    setEliminandoId(null);
  };

  const formatFecha = (fechaStr) => {
    const [anio, mes, dia] = fechaStr.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl shadow-xl h-full flex flex-col">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3">
        <span className="material-symbols-outlined text-[#ff6b00] text-base">history</span>
        <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Historial de Peso</h3>
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

      <div className="flex-1 space-y-2 pr-1">
        {weights.length === 0 && (
          <p className="text-[10px] font-mono text-[#e2bfb0]/50 text-center py-6 uppercase">
            Sin registros en el rango seleccionado.
          </p>
        )}

        {weightsPagina.map((registro) => (
          <div
            key={registro.PesoID}
            className="flex items-center justify-between bg-black/50 border border-white/10 rounded-lg px-3.5 py-2.5"
          >
            <div>
              <p className="text-xs sm:text-sm font-mono text-white font-bold">{registro.PesoKg} kg</p>
              <p className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase">{formatFecha(registro.Fecha)}</p>
            </div>

            <button
              type="button"
              onClick={() => handleEliminar(registro.PesoID)}
              disabled={eliminandoId === registro.PesoID}
              className="text-[#e2bfb0]/60 hover:text-[#ffb4ab] transition-colors focus:outline-none cursor-pointer disabled:opacity-40 flex items-center justify-center p-1"
            >
              <span className="material-symbols-outlined text-lg">
                {eliminandoId === registro.PesoID ? "hourglass_empty" : "delete"}
              </span>
            </button>
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