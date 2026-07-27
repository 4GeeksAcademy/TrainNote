import React, { useState, useEffect } from "react";

export const PlanConfiguratorCard = ({ onGenerate, loading, resetTrigger }) => {
  const [tipoPlan, setTipoPlan] = useState("ENTRENAMIENTO");

  const [nivel, setNivel] = useState("");
  const [diasPorSemana, setDiasPorSemana] = useState("");
  const [minutosSesion, setMinutosSesion] = useState("");
  const [equipamiento, setEquipamiento] = useState("");
  const [notaEntrenamiento, setNotaEntrenamiento] = useState("");
  const [lesiones, setLesiones] = useState("");

  const [edad, setEdad] = useState("");
  const [pesoActualKg, setPesoActualKg] = useState("");
  const [alturaCm, setAlturaCm] = useState("");
  const [nivelActividad, setNivelActividad] = useState("");
  const [comidasAlDia, setComidasAlDia] = useState("");
  const [notaNutricion, setNotaNutricion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (resetTrigger) {
      setDiasPorSemana("");
      setMinutosSesion("");
      setEquipamiento("");
      setNotaEntrenamiento("");
      setLesiones("");
      setEdad("");
      setPesoActualKg("");
      setAlturaCm("");
      setComidasAlDia("");
      setNotaNutricion("");
    }
  }, [resetTrigger]);

  const handleGenerar = async (e) => {
    e.preventDefault();

    const payload =
      tipoPlan === "ENTRENAMIENTO"
        ? {
            tipo_plan: "ENTRENAMIENTO",
            nivel,
            dias_por_semana: parseInt(diasPorSemana) || 0,
            minutos_sesion: parseInt(minutosSesion) || 0,
            equipamiento,
            nota: notaEntrenamiento,
            lesiones_o_limitaciones: lesiones || "Ninguna",
          }
        : {
            tipo_plan: "NUTRICION",
            edad: parseInt(edad) || 0,
            peso_actual_kg: parseFloat(pesoActualKg) || 0,
            altura_cm: parseFloat(alturaCm) || 0,
            nivel_actividad: nivelActividad,
            comidas_al_dia: parseInt(comidasAlDia) || 0,
            nota: notaNutricion || "Ninguna",
          };

    setIsSubmitting(true);
    try {
      await onGenerate(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl shadow-xl">
      <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3">
        <span className="material-symbols-outlined text-[#ff6b00] text-base">auto_awesome</span>
        <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Generar Plan Con IA</h3>
      </div>

      {/* SELECTOR DE TIPO DE PLAN */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTipoPlan("ENTRENAMIENTO")}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            tipoPlan === "ENTRENAMIENTO"
              ? "bg-[#ff6b00] text-white shadow-[0_0_10px_rgba(255,107,0,0.3)]"
              : "bg-black/50 border border-white/15 text-[#e2bfb0]/70 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-sm">fitness_center</span>
          Entrenamiento
        </button>
        <button
          type="button"
          onClick={() => setTipoPlan("NUTRICION")}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            tipoPlan === "NUTRICION"
              ? "bg-[#ff6b00] text-white shadow-[0_0_10px_rgba(255,107,0,0.3)]"
              : "bg-black/50 border border-white/15 text-[#e2bfb0]/70 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-sm">restaurant</span>
          Nutrición
        </button>
      </div>

      <form onSubmit={handleGenerar} className="flex flex-col gap-3">
        {tipoPlan === "ENTRENAMIENTO" ? (
          <>
            <div>
              <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Nivel de Atleta</label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
                required
              >
                <option value="" disabled className="bg-[#1a1a1a] text-[#e2bfb0]/60">Seleccionar nivel de atleta</option>
                <option value="Principiante" className="bg-[#1a1a1a] text-white">Principiante</option>
                <option value="Intermedio" className="bg-[#1a1a1a] text-white">Intermedio</option>
                <option value="Avanzado" className="bg-[#1a1a1a] text-white">Avanzado</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Días/Semana</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  placeholder="Ej: 4"
                  value={diasPorSemana}
                  onChange={(e) => setDiasPorSemana(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Min/Sesión</label>
                <input
                  type="number"
                  min="15"
                  step="5"
                  placeholder="Ej: 60"
                  value={minutosSesion}
                  onChange={(e) => setMinutosSesion(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Equipo Disponible</label>
              <input
                type="text"
                placeholder="Ej: Gimnasio Completo"
                value={equipamiento}
                onChange={(e) => setEquipamiento(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Nota</label>
              <textarea
                placeholder="Ej: Quiero enfocarme en hipertrofia y fuerza de tren superior"
                value={notaEntrenamiento}
                onChange={(e) => setNotaEntrenamiento(e.target.value)}
                rows={3}
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono resize-none"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Lesiones o Limitaciones</label>
              <input
                type="text"
                placeholder="Ej: Ninguna"
                value={lesiones}
                onChange={(e) => setLesiones(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Edad</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 25"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Peso Actual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 75"
                  value={pesoActualKg}
                  onChange={(e) => setPesoActualKg(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Altura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ej: 175"
                  value={alturaCm}
                  onChange={(e) => setAlturaCm(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Comidas/Días</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  placeholder="Ej: 4"
                  value={comidasAlDia}
                  onChange={(e) => setComidasAlDia(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Nivel de Actividad</label>
              <select
                value={nivelActividad}
                onChange={(e) => setNivelActividad(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
                required
              >
                <option value="" disabled className="bg-[#1a1a1a] text-[#e2bfb0]/60">Seleccionar nivel de actividad</option>
                <option value="Baja" className="bg-[#1a1a1a] text-white">Baja</option>
                <option value="Moderada" className="bg-[#1a1a1a] text-white">Moderada</option>
                <option value="Alta" className="bg-[#1a1a1a] text-white">Alta</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Nota</label>
              <textarea
                placeholder="Ej: Prefiero comidas altas en proteínas, sin lácteos"
                value={notaNutricion}
                onChange={(e) => setNotaNutricion(e.target.value)}
                rows={3}
                className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono resize-none"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 disabled:opacity-50 text-white font-extrabold text-[11px] font-mono uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-[0_0_12px_rgba(255,107,0,0.3)] transition-all cursor-pointer mt-1 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-sm">bolt</span>
          )}
          {isSubmitting ? "Generando..." : "Generar Protocolo"}
        </button>
      </form>
    </div>
  );
};
