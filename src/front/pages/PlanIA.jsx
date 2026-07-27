import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { actions } from "../store";
import { parseResultado } from "../utils/planHelpers";
import { PlanConfiguratorCard } from "../components/PlanConfiguratorCard";
import { PlanHistoryCard } from "../components/PlanHistoryCard";
import { PlanResultModal } from "../components/PlanResultModal";
import { getFechaLocal } from "../utils/dateHelpers";

const DEFAULT_ATHLETE_AVATAR =
  "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop";

export const PlanIA = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const hoy = getFechaLocal();
  const primerDiaMes = hoy.slice(0, 8) + "01";

  const [desde, setDesde] = useState(primerDiaMes);
  const [hasta, setHasta] = useState(hoy);
  const [ultimoPlan, setUltimoPlan] = useState(null);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [resetKey, setResetKey] = useState(0);

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
    actions.getPlans(dispatch, store, desde, hasta);
  }, [dispatch, navigate]);

  const user = store.user || JSON.parse(localStorage.getItem("tn_user_data") || "{}");
  const userName = user?.Nombre || user?.nombre || "Atleta";

  // FOTO DE PERFIL PARA EL HEADER
  const rawAvatar =
    user?.urlFoto ||
    user?.url_foto ||
    user?.avatar_url ||
    user?.imagen ||
    "";

  const isValidAvatar =
    rawAvatar &&
    rawAvatar.trim() !== "" &&
    rawAvatar !== "default.png" &&
    !rawAvatar.endsWith("/default.png");

  const headerAvatar = isValidAvatar ? rawAvatar : DEFAULT_ATHLETE_AVATAR;

  // GENERAR NUEVO PLAN CON IA
  const handleGenerarPlan = async (payload) => {
    const res = await actions.generatePlan(dispatch, store, payload);
    if (res && res.resultado) {
      setUltimoPlan({ tipo: payload.tipo_plan, resultado: res.resultado });
      setResetKey((prev) => prev + 1); // <--- Limpia los campos del formulario
      await actions.getPlans(dispatch, store, desde, hasta);
    }
  };

  // FILTRAR HISTORIAL POR RANGO DE FECHAS
  const handleFiltrar = () => {
    actions.getPlans(dispatch, store, desde, hasta);
  };

  // ELIMINAR PLAN
  const handleEliminar = async (planId) => {
    await actions.deletePlan(dispatch, store, planId);
  };

  const handleVerUltimoPlan = () => {
    if (!ultimoPlan) return;
    setPlanSeleccionado({
      TipoPlan: ultimoPlan.tipo === "ENTRENAMIENTO" ? "Entrenamiento" : "Nutricion",
      Fecha: hoy,
      resultado: ultimoPlan.resultado,
    });
    setUltimoPlan(null);
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
              PLAN <span className="text-[#ff6b00]">INTELIGENTE</span>
            </h2>
            <p className="text-[10px] sm:text-[11px] font-mono text-[#e2bfb0]/60">
              RUTINAS Y NUTRICIÓN GENERADAS POR IA
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1a1a1a]/65 border border-white/10 px-3 py-1.5 rounded-xl w-full sm:w-auto shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#ff6b00]/40 shrink-0">
              <img
                src={headerAvatar}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white uppercase truncate">{userName}</p>
              <p className="text-[9px] font-mono text-[#ff6b00] truncate">
                Objetivo: {user?.Objetivo || user?.objetivo || "Rendimiento Atlético"}
              </p>
            </div>
          </div>
        </header>

        {/* SECCION PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div className="lg:col-span-1 min-w-0 flex flex-col">
            <PlanConfiguratorCard onGenerate={handleGenerarPlan} loading={store.loading} resetTrigger={resetKey} />
          </div>

          <div className="lg:col-span-2 min-w-0 flex flex-col">
            {ultimoPlan ? (
              <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6 flex-1 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-[#ff6b00]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#ff6b00] text-3xl">check_circle</span>
                </div>
                <h3 className="text-base font-bold text-white uppercase">Protocolo Generado</h3>
                <p className="text-xs sm:text-sm font-mono text-[#e2bfb0]/70 max-w-sm">
                  Tu plan fue sintetizado y guardado en el historial. Puedes revisarlo completo cuando quieras.
                </p>
                <button
                  type="button"
                  onClick={handleVerUltimoPlan}
                  className="bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-extrabold text-[11px] font-mono uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-[0_0_12px_rgba(255,107,0,0.3)] transition-all cursor-pointer mt-1"
                >
                  Ver Resultado
                </button>
              </div>
            ) : (
              <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6 flex-1 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#e2bfb0]/40 text-3xl">psychology</span>
                </div>
                <h3 className="text-base font-bold text-white uppercase">Arquitectura de Rendimiento</h3>
                <p className="text-xs sm:text-sm font-mono text-[#e2bfb0]/70 max-w-sm">
                  Define tus parámetros para sintetizar un plan optimizado por IA.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* HISTORIAL */}
        <PlanHistoryCard
          plans={store.plans}
          desde={desde}
          hasta={hasta}
          onDesdeChange={setDesde}
          onHastaChange={setHasta}
          onFilter={handleFiltrar}
          onDelete={handleEliminar}
          onVerResultado={(plan) =>
            setPlanSeleccionado({ ...plan, resultado: parseResultado(plan.Resultado) })
          }
        />
      </div>

      {/* MODAL RESULTADO */}
      {planSeleccionado && (
        <PlanResultModal
          plan={planSeleccionado}
          resultado={planSeleccionado.resultado}
          onClose={() => setPlanSeleccionado(null)}
        />
      )}
    </div>
  );
};