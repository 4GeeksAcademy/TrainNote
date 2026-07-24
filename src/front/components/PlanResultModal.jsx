import React from "react";
import { PlanResultContent } from "./PlanResultContent";

export const PlanResultModal = ({ plan, resultado, onClose }) => {
  if (!plan) return null;

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const [anio, mes, dia] = fechaStr.split("-");
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-white/15 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 p-4 border-b border-white/10">
          <div>
            <h3 className="text-xs sm:text-sm font-mono font-bold uppercase text-white tracking-widest">
              Plan de {plan.TipoPlan}
            </h3>
            <p className="text-[10px] font-mono text-[#e2bfb0]/75 uppercase mt-0.5">{formatFecha(plan.Fecha)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#e2bfb0]/60 hover:text-white transition-colors focus:outline-none cursor-pointer flex items-center justify-center p-1"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <PlanResultContent resultado={resultado} />
        </div>
      </div>
    </div>
  );
};