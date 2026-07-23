import React, { useContext, useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiFetch } from "../store";
import { useNavigate, Link } from "react-router-dom";

export const Entrenamiento = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [duracion, setDuracion] = useState(60);
  const [nota, setNota] = useState("");
  const [ejercicios, setEjercicios] = useState([{ ejercicio_id: 1, nombre: "Press de Banca", serie: 4, repeticion: 10, peso_ejercicio: 80 }]);

  useEffect(() => {
    if (!localStorage.getItem("tn_jwt_token")) return navigate("/");
    actions.getWorkouts();
  }, []);

  const addRow = () => setEjercicios([...ejercicios, { ejercicio_id: ejercicios.length + 1, nombre: "", serie: 3, repeticion: 10, peso_ejercicio: 0 }]);
  const removeRow = (idx) => setEjercicios(ejercicios.filter((_, i) => i !== idx));
  const updateRow = (idx, field, val) => {
    const copy = [...ejercicios];
    copy[idx][field] = val;
    setEjercicios(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ejercicios.length === 0 || !ejercicios[0].nombre) return actions.showAlert("Agregue al menos un ejercicio", "error");
    const ok = await actions.createWorkout({ fecha, duracion: parseInt(duracion), nota, ejercicios });
    if (ok) {
      setNota("");
      setEjercicios([{ ejercicio_id: 1, nombre: "", serie: 4, repeticion: 10, peso_ejercicio: 0 }]);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-white/5 bg-[#141414] hidden md:flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-black text-[#ff6b00] uppercase italic">Trainnote</h1>
        <nav className="space-y-2 flex-1">
          <Link to="/progreso.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Progreso</Link>
          <Link to="/entrenamiento.html" className="block text-[#ff6b00] font-bold bg-[#ff6b00]/10 p-2 rounded">Entrenamiento</Link>
          <Link to="/nutricion.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Nutrición</Link>
          <Link to="/peso.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Peso</Link>
          <Link to="/plania.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Plan IA</Link>
        </nav>
      </aside>

      <main className="md:ml-64 flex-1 p-8 pt-20 space-y-8">
        <h2 className="text-3xl font-bold">Registrar Sesión</h2>
        <form onSubmit={handleSubmit} className="bg-[#141414] p-8 rounded-xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="bg-[#1b1b1c] p-3 rounded border border-white/10 text-white" />
            <input type="text" placeholder="Rutina (Ej: Empuje A)" value={nota} onChange={e => setNota(e.target.value)} className="bg-[#1b1b1c] p-3 rounded border border-white/10 text-white" />
            <input type="number" placeholder="Duración min" value={duracion} onChange={e => setDuracion(e.target.value)} className="bg-[#1b1b1c] p-3 rounded border border-white/10 text-white" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[#ff6b00]">Lista de Ejercicios</h3>
              <button type="button" onClick={addRow} className="bg-[#ff6b00]/10 text-[#ff6b00] font-bold px-3 py-1 text-xs rounded uppercase">+ Añadir</button>
            </div>
            {ejercicios.map((ej, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 bg-[#1b1b1c] p-3 rounded">
                <input type="text" placeholder="Ejercicio" value={ej.nombre} onChange={e => updateRow(i, "nombre", e.target.value)} className="col-span-5 bg-black/40 p-2 rounded text-sm text-white" />
                <input type="number" placeholder="Sets" value={ej.serie} onChange={e => updateRow(i, "serie", parseInt(e.target.value))} className="col-span-2 bg-black/40 p-2 rounded text-sm text-center text-white" />
                <input type="number" placeholder="Reps" value={ej.repeticion} onChange={e => updateRow(i, "repeticion", parseInt(e.target.value))} className="col-span-2 bg-black/40 p-2 rounded text-sm text-center text-white" />
                <input type="number" placeholder="Kg" value={ej.peso_ejercicio} onChange={e => updateRow(i, "peso_ejercicio", parseFloat(e.target.value))} className="col-span-2 bg-black/40 p-2 rounded text-sm text-center text-white" />
                <button type="button" onClick={() => removeRow(i)} className="col-span-1 text-red-500 font-bold">✕</button>
              </div>
            ))}
          </div>

          <button type="submit" className="w-full bg-[#ff6b00] text-black font-black py-4 rounded-xl uppercase">Guardar Entrenamiento</button>
        </form>
      </main>
    </div>
  );
};