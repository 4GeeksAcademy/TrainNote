import React, { useContext, useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiFetch } from "../store";
import { useNavigate, Link } from "react-router-dom";

export const Peso = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [pesoKg, setPesoKg] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("tn_jwt_token")) return navigate("/");
    actions.getWeights();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await actions.createWeight({ fecha, peso_kg: parseFloat(pesoKg) });
    if (ok) setPesoKg("");
  };

  return (
    <div className="flex min-h-screen bg-[#131313] text-white">
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-white/5 bg-[#1b1b1c] hidden md:flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-black text-[#ff6b00] uppercase italic">Trainnote</h1>
        <nav className="space-y-2 flex-1">
          <Link to="/progreso.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Progreso</Link>
          <Link to="/peso.html" className="block text-[#ff6b00] font-bold bg-[#ff6b00]/10 p-2 rounded">Peso</Link>
          <Link to="/entrenamiento.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Entrenamiento</Link>
        </nav>
      </aside>

      <main className="md:ml-64 flex-1 p-8 pt-20 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 bg-[#202020] p-6 rounded-xl border border-white/10 space-y-4">
          <h2 className="text-xl font-bold text-[#ff6b00]">Registro Rápido de Peso</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required className="w-full bg-[#1b1b1c] p-3 rounded border border-white/10" />
            <input type="number" step="0.1" placeholder="Peso en Kg (ej: 82.5)" value={pesoKg} onChange={e => setPesoKg(e.target.value)} required className="w-full bg-[#1b1b1c] p-4 text-2xl font-black rounded border border-white/10 text-[#ff6b00]" />
            <button type="submit" className="w-full bg-[#ff6b00] text-black font-bold py-4 rounded-xl uppercase">Guardar Pesaje</button>
          </form>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-[#202020] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold mb-6">Historial de Pesajes</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-[#e2bfb0] border-b border-white/10">
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Peso (kg)</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {store.weights.map((item) => (
                <tr key={item.PesoID || item.id}>
                  <td className="py-3 font-bold">{item.Fecha}</td>
                  <td className="py-3 text-[#ff6b00] font-black text-lg">{item.PesoKg} kg</td>
                  <td className="text-right">
                    <button onClick={() => actions.deleteWeight(item.PesoID || item.id)} className="text-red-500 font-bold hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};