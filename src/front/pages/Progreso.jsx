import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { actions } from "../store";
import { WeightChart } from "../components/WeightChart";

export const Progreso = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("tn_jwt_token");
    if (!token) {
      navigate("/");
      return;
    }

    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);

    const formatoFecha = (date) => date.toISOString().split("T")[0];
    const fechaHasta = formatoFecha(hoy);
    const fechaDesde = formatoFecha(haceUnMes);

    actions.getProgressSummary(dispatch, store);
    actions.getProgressWeight(dispatch, store, fechaDesde, fechaHasta);
  }, []);

  const summary = store.progressSummary || {};
  const weightData = store.progressWeight || [];
  const userData = store.user || JSON.parse(localStorage.getItem("tn_user_data") || "{}");

  const userName = userData.Nombre || userData.nombre || "Atleta";
  const pesoInicial = summary.peso_inicial ?? "--";
  const pesoActual = summary.peso_actual ?? "--";
  const pesoDeseado = summary.peso_deseado ?? "--";
  const cambioTotal = summary.cambio_total_kg ?? 0;

  const entrenamientosSemana = summary.workouts_semana ?? 0;
  const entrenamientosMes = summary.workouts_mes ?? 0;
  const promedioCalorias = summary.promedio_calorias ?? 0;
  const promedioProteinas = summary.promedio_proteinas_g ?? 0;
  const mejorDuracion = summary.mejor_duracion_minutos ?? 0;

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden pb-10">
      {/* HEADER */}
     <header className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 pl-10 lg:pl-0 border-b border-white/5">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold uppercase tracking-tight text-white leading-tight break-words">
            PANEL DE <span className="text-[#ff6b00]">EVOLUCIÓN</span>
          </h2>
          <p className="text-[10px] sm:text-[11px] font-mono text-[#e2bfb0]/60">
            RESUMEN DE MÉTRICAS Y PERFORMANCE
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#1a1a1a]/60 border border-white/10 px-3 py-1.5 rounded-xl w-full sm:w-auto shrink-0">
          <span className="material-symbols-outlined text-[#ff6b00] text-sm shrink-0">
            account_circle
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white uppercase truncate">{userName}</p>
            <p className="text-[9px] font-mono text-[#ff6b00] truncate">
              Objetivo: {userData.Objetivo || userData.objetivo || "ATLETA"}
            </p>
          </div>
        </div>
      </header>

      {/* STATS DE PESO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-[#1a1a1a]/60 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-white/10 min-w-0">
          <span className="text-[9px] sm:text-[11px] font-mono text-[#e2bfb0]/60 font-bold uppercase tracking-wide block leading-tight">
            Peso Inicial
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1 truncate">
            {pesoInicial} <span className="text-sm text-[#ff6b00]">kg</span>
          </h3>
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-[#ff6b00]/40 shadow-[0_0_15px_rgba(255,107,0,0.1)] min-w-0">
          <span className="text-[9px] sm:text-[11px] font-mono text-[#ff6b00] font-bold uppercase tracking-wide block leading-tight">
            Peso Actual
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#ff6b00] mt-1 truncate">
            {pesoActual} <span className="text-sm text-white">kg</span>
          </h3>
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-white/10 min-w-0">
          <span className="text-[9px] sm:text-[11px] font-mono text-[#e2bfb0]/60 font-bold uppercase tracking-wide block leading-tight">
            Meta Objetivo
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1 truncate">
            {pesoDeseado} <span className="text-sm text-[#ff6b00]">kg</span>
          </h3>
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-md p-2.5 sm:p-4 rounded-xl border border-white/10 min-w-0">
          <span className="text-[9px] sm:text-[11px] font-mono text-[#e2bfb0]/60 font-bold uppercase tracking-wide block leading-tight">
            Cambio Total
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#ff6b00] mt-1 truncate">
            {cambioTotal} <span className="text-sm text-white">kg</span>
          </h3>
        </div>
      </div>

      {/* MÉTRICAS Y GRÁFICO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* MÉTRICAS DE RENDIMIENTO */}
        <div className="lg:col-span-4 bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl flex flex-col justify-between min-w-0">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <span className="material-symbols-outlined text-[#ff6b00] text-base">bolt</span>
            <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">
              Métricas de Rendimiento
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-black/40 p-3 sm:p-3.5 rounded-xl border border-white/5 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-1 gap-1">
                <span className="text-[9px] sm:text-[10px] font-mono text-[#e2bfb0]/60 uppercase leading-tight">
                  Semana
                </span>
                <span className="material-symbols-outlined text-[#ff6b00] text-sm shrink-0">
                  event
                </span>
              </div>
              <p className="text-base sm:text-lg font-black text-white truncate">
                {entrenamientosSemana} <span className="text-xs text-[#ff6b00] font-normal">sesión</span>
              </p>
            </div>

            <div className="bg-black/40 p-3 sm:p-3.5 rounded-xl border border-white/5 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-1 gap-1">
                <span className="text-[9px] sm:text-[10px] font-mono text-[#e2bfb0]/60 uppercase leading-tight">
                  Mes
                </span>
                <span className="material-symbols-outlined text-[#ff6b00] text-sm shrink-0">
                  fitness_center
                </span>
              </div>
              <p className="text-base sm:text-lg font-black text-white truncate">
                {entrenamientosMes} <span className="text-xs text-[#ff6b00] font-normal">sesión</span>
              </p>
            </div>

            <div className="bg-black/40 p-3 sm:p-3.5 rounded-xl border border-white/5 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-1 gap-1">
                <span className="text-[9px] sm:text-[10px] font-mono text-[#e2bfb0]/60 uppercase leading-tight">
                  Calorías
                </span>
                <span className="material-symbols-outlined text-[#ff6b00] text-sm shrink-0">
                  local_fire_department
                </span>
              </div>
              <p className="text-base sm:text-lg font-black text-white truncate">
                {promedioCalorias} <span className="text-xs text-[#ff6b00] font-normal">kcal</span>
              </p>
            </div>

            <div className="bg-black/40 p-3 sm:p-3.5 rounded-xl border border-white/5 flex flex-col justify-between min-w-0">
              <div className="flex items-center justify-between mb-1 gap-1">
                <span className="text-[9px] sm:text-[10px] font-mono text-[#e2bfb0]/60 uppercase leading-tight">
                  Proteína
                </span>
                <span className="material-symbols-outlined text-[#ff6b00] text-sm shrink-0">
                  restaurant
                </span>
              </div>
              <p className="text-base sm:text-lg font-black text-white truncate">
                {promedioProteinas} <span className="text-xs text-[#ff6b00] font-normal">g</span>
              </p>
            </div>

            <div className="col-span-2 bg-black/40 p-3 sm:p-3.5 rounded-xl border border-white/5 flex items-center justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] font-mono text-[#e2bfb0]/60 uppercase block mb-0.5 leading-tight">
                  Mejor Duración
                </span>
                <p className="text-base sm:text-lg font-black text-white truncate">
                  {mejorDuracion} <span className="text-xs text-[#ff6b00] font-normal">minutos</span>
                </p>
              </div>
              <span className="material-symbols-outlined text-[#ff6b00] text-xl shrink-0">
                timer
              </span>
            </div>
          </div>
        </div>

        {/* GRÁFICO */}
        <div className="lg:col-span-8 flex items-center bg-[#1a1a1a]/40 border border-white/10 rounded-xl p-2 w-full min-w-0 overflow-hidden">
          <WeightChart weightData={weightData} />
        </div>
      </div>
    </div>
  );
};