import React, { useState, useEffect } from "react";
import { actions } from "../store";
import { getFechaLocal } from "../utils/dateHelpers";

export const WorkoutQuickForm = ({ onSubmit, loading, dispatch, store }) => {
 const hoy = getFechaLocal();

  const [fecha, setFecha] = useState(hoy);
  const [duracionMinutos, setDuracionMinutos] = useState("");
  const [notas, setNotas] = useState("");
  const [listaEjercicios, setListaEjercicios] = useState([
    { nombre_ejercicio: "", series: "", repeticiones: "", peso_kg: "" }
  ]);
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);

  useEffect(() => {
    const cargarEjercicios = async () => {
      const data = await actions.getExercises(dispatch, store);
      if (data) setEjerciciosDisponibles(data);
    };
    cargarEjercicios();
  }, []);

  const handleAgregarFila = () => {
    setListaEjercicios([
      ...listaEjercicios,
      { nombre_ejercicio: "", series: "", repeticiones: "", peso_kg: "" }
    ]);
  };

  const handleEliminarFila = (index) => {
    const nuevaLista = listaEjercicios.filter((_, i) => i !== index);
    setListaEjercicios(nuevaLista);
  };

  const handleCambioEjercicio = (index, campo, valor) => {
    const nuevaLista = [...listaEjercicios];
    nuevaLista[index][campo] = valor;
    setListaEjercicios(nuevaLista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      fecha,
      duracion_minutos: parseInt(duracionMinutos) || 0,
      notas,
      ejercicios: listaEjercicios.map((item) => ({
        nombre_ejercicio: item.nombre_ejercicio,
        series: parseInt(item.series) || 0,
        repeticiones: parseInt(item.repeticiones) || 0,
        peso_kg: parseFloat(item.peso_kg) || 0
      }))
    };

    const ok = await onSubmit(payload);
    if (ok) {
      setDuracionMinutos("");
      setNotas("");
      setListaEjercicios([{ nombre_ejercicio: "", series: "", repeticiones: "", peso_kg: "" }]);
    }
  };

  return (
    <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl shadow-xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ff6b00] text-base">fitness_center</span>
          <h3 className="text-xs font-mono font-bold uppercase text-white tracking-widest">Registrar Entrenamiento</h3>
        </div>
        <button
          type="button"
          onClick={handleAgregarFila}
          className="bg-[#ff6b00]/10 hover:bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/30 font-extrabold text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-xs">add</span> Añadir Ejercicio
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Duración (Minutos)</label>
            <input
              type="number"
              min="1"
              placeholder="60"
              value={duracionMinutos}
              onChange={(e) => setDuracionMinutos(e.target.value)}
              className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block mb-1">Nombre de Rutina / Notas</label>
          <input
            type="text"
            placeholder="Ej: Empuje (Push) A - Hipertrofia"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="w-full bg-black/50 border border-white/15 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] transition-all font-mono"
            required
          />
        </div>

        <div className="space-y-3 mt-1">
          <label className="text-[10px] font-mono text-[#e2bfb0]/80 uppercase tracking-wider block">Ejercicios Realizados</label>
          {listaEjercicios.map((item, index) => (
            <div key={index} className="bg-black/50 border border-white/10 p-3 rounded-lg space-y-2.5">
              
              {/* Línea 1: Selector de ejercicio completo */}
              <div>
                <select
                  value={item.nombre_ejercicio}
                  onChange={(e) => handleCambioEjercicio(index, "nombre_ejercicio", e.target.value)}
                  className="w-full bg-black/80 border border-white/20 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ff6b00] font-mono"
                  required
                >
                  <option value="" className="text-gray-400">Seleccionar ejercicio</option>
                  {ejerciciosDisponibles.map((ej) => (
                    <option key={ej.EjercicioID} value={ej.Nombre} className="bg-[#1a1a1a] text-white">
                      {ej.Nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Línea 2: Inputs numéricos y botón de borrar */}
              <div className="grid grid-cols-4 gap-2 items-center">
                <div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Sets"
                    value={item.series}
                    onChange={(e) => handleCambioEjercicio(index, "series", e.target.value)}
                    className="w-full bg-black/80 border border-white/20 rounded-lg px-2 py-2 text-xs text-white text-center focus:outline-none focus:border-[#ff6b00] font-mono"
                    required
                  />
                </div>

                <div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Reps"
                    value={item.repeticiones}
                    onChange={(e) => handleCambioEjercicio(index, "repeticiones", e.target.value)}
                    className="w-full bg-black/80 border border-white/20 rounded-lg px-2 py-2 text-xs text-white text-center focus:outline-none focus:border-[#ff6b00] font-mono"
                    required
                  />
                </div>

                <div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Kg"
                    value={item.peso_kg}
                    onChange={(e) => handleCambioEjercicio(index, "peso_kg", e.target.value)}
                    className="w-full bg-black/80 border border-white/20 rounded-lg px-2 py-2 text-xs text-white text-center focus:outline-none focus:border-[#ff6b00] font-mono"
                    required
                  />
                </div>

                <div className="flex justify-center">
                  {listaEjercicios.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleEliminarFila(index)}
                      className="text-[#e2bfb0]/60 hover:text-[#ffb4ab] transition-colors cursor-pointer p-1.5 bg-white/5 rounded-lg border border-white/10 w-full flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  ) : (
                    <div className="w-full"></div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 disabled:opacity-50 text-white font-extrabold text-[11px] font-mono uppercase tracking-wider px-6 py-2.5 rounded-lg shadow-[0_0_12px_rgba(255,107,0,0.3)] transition-all cursor-pointer mt-2"
        >
          {loading ? "Guardando..." : "Guardar Entrenamiento"}
        </button>
      </form>
    </div>
  );
};