import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { actions } from "../store";
import { WeightQuickForm } from "../components/WeightQuickForm";
import { WeightHistoryCard } from "../components/WeightHistoryCard";
import { getFechaLocal } from "../utils/dateHelpers";

export const Peso = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const hoy = getFechaLocal();
  const primerDiaMes = hoy.slice(0, 8) + "01";

  const [desde, setDesde] = useState(primerDiaMes);
  const [hasta, setHasta] = useState(hoy);

  useEffect(() => {
    const token = localStorage.getItem("tn_jwt_token");
    if (!token) {
      navigate("/");
      return;
    }
    dispatch({
      type: "set_alert",
      payload: { show: false, message: "", type: "" }
    });
    actions.getWeights(dispatch, store, desde, hasta);
  }, []);

  const user = store.user || JSON.parse(localStorage.getItem("tn_user_data") || "{}");
  const userName = user?.Nombre || user?.nombre || "Atleta";

  // REGISTRAR PESO
  const handleRegistrarPeso = async (fecha, pesoKg) => {
    const ok = await actions.registerWeight(dispatch, store, fecha, pesoKg);
    if (ok) {
      await actions.getWeights(dispatch, store, desde, hasta);
    }
    return ok;
  };

  // FILTRAR HISTORIAL POR RANGO DE FECHAS
  const handleFiltrar = () => {
    actions.getWeights(dispatch, store, desde, hasta);
  };

  // ELIMINAR REGISTRO DE PESO
  const handleEliminar = async (pesoId) => {
    await actions.deleteWeight(dispatch, store, pesoId);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 pb-6">
      <div className="relative z-10 space-y-4">

        {/* ALERTA GLOBAL */}
        {store.alert?.show && (
          <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium ${
            store.alert.type === "error" ? "text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab]/20" : "text-emerald-300 bg-emerald-950/40 border-emerald-800/40"
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {store.alert.type === "error" ? "warning" : "check_circle"}
            </span>
            <span>{store.alert.message}</span>
          </div>
        )}

        {/* HEADER UNIFICADO */}
        <header className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 pl-10 lg:pl-0 border-b border-white/5">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold uppercase tracking-tight text-white leading-tight break-words">
              CONTROL DE <span className="text-[#ff6b00]">PESO</span>
            </h2>
            <p className="text-[10px] sm:text-[11px] font-mono text-[#e2bfb0]/60">
              REGISTRO Y SEGUIMIENTO DE PESO CORPORAL
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1a1a1a]/65 border border-white/10 px-3 py-1.5 rounded-xl w-full sm:w-auto shrink-0">
            <span className="material-symbols-outlined text-[#ff6b00] text-sm shrink-0">
              account_circle
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white uppercase truncate">{userName}</p>
              <p className="text-[9px] font-mono text-[#ff6b00] truncate">
                Objetivo: {user?.Objetivo || user?.objetivo || "Rendimiento Atlético"}
              </p>
            </div>
          </div>
        </header>

        {/* SECCIÓN PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div className="lg:col-span-1 min-w-0">
            <WeightQuickForm onSubmit={handleRegistrarPeso} loading={store.loading} />
          </div>
          <div className="lg:col-span-2 flex flex-col min-w-0">
            <WeightHistoryCard
              weights={store.weights}
              desde={desde}
              hasta={hasta}
              onDesdeChange={setDesde}
              onHastaChange={setHasta}
              onFilter={handleFiltrar}
              onDelete={handleEliminar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};