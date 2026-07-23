import React, { useContext, useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiFetch } from "../store";
import { useNavigate, Link } from "react-router-dom";

export const Nutricion = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [tipoComida, setTipoComida] = useState("Almuerzo");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [proteina, setProteina] = useState("");
  const [caloria, setCaloria] = useState("");
  const [carbohidrato, setCarbohidrato] = useState("");
  const [grasa, setGrasa] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("tn_jwt_token")) return navigate("/");
    actions.getNutrition();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await actions.createNutrition({
      nombre,
      tipo_comida: tipoComida,
      fecha,
      proteina: parseFloat(proteina) || 0,
      caloria: parseFloat(caloria) || 0,
      carbohidrato: parseFloat(carbohidrato) || 0,
      grasa: parseFloat(grasa) || 0
    });
    if (ok) {
      setNombre("");
      setProteina("");
      setCaloria("");
      setCarbohidrato("");
      setGrasa("");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#131313] text-white">
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-white/5 bg-[#1b1b1c] hidden md:flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-black text-[#ff6b00] uppercase italic">Trainnote</h1>
        <nav className="space-y-2 flex-1">
          <Link to="/progreso.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Progreso</Link>
          <Link to="/nutricion.html" className="block text-[#ff6b00] font-bold bg-[#ff6b00]/10 p-2 rounded">Nutrición</Link>
          <Link to="/entrenamiento.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Entrenamiento</Link>
          <Link to="/peso.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Peso</Link>
        </nav>
      </aside>

      <main className="md:ml-64 flex-1 p-8 pt-20 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 bg-[#202020] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold text-[#ff6b00] mb-6">Historial de Comidas</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-[#e2bfb0] border-b border-white/10">
                <th className="pb-3">Comida / Tipo</th>
                <th className="pb-3 text-center">Macros (P/C/G)</th>
                <th className="pb-3 text-right">Calorías</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {store.nutrition.map((item) => (
                <tr key={item.NutricionID || item.id}>
                  <td className="py-3">
                    <p className="font-bold">{item.Nombre}</p>
                    <p className="text-xs text-[#ff6b00]">{item.TipoComida} • {item.Fecha}</p>
                  </td>
                  <td className="text-center">{item.Proteina}g / {item.Carbohidrato}g / {item.Grasa}g</td>
                  <td className="text-right font-bold text-[#ff6b00]">{item.Caloria} kcal</td>
                  <td className="text-right">
                    <button onClick={() => actions.deleteNutrition(item.NutricionID || item.id)} className="text-red-500 font-bold hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-[#202020] p-6 rounded-xl border border-white/10">
          <h2 className="text-xl font-bold mb-6">Registrar Comida</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Alimento" value={nombre} onChange={e => setNombre(e.target.value)} required className="w-full bg-[#1b1b1c] p-3 rounded border border-white/10" />
            <select value={tipoComida} onChange={e => setTipoComida(e.target.value)} className="w-full bg-[#1b1b1c] p-3 rounded border border-white/10">
              <option>Desayuno</option>
              <option>Almuerzo</option>
              <option>Cena</option>
              <option>Merienda</option>
            </select>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required className="w-full bg-[#1b1b1c] p-3 rounded border border-white/10" />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Proteína (g)" value={proteina} onChange={e => setProteina(e.target.value)} required className="bg-[#1b1b1c] p-3 rounded border border-white/10" />
              <input type="number" placeholder="Carbos (g)" value={carbohidrato} onChange={e => setCarbohidrato(e.target.value)} required className="bg-[#1b1b1c] p-3 rounded border border-white/10" />
              <input type="number" placeholder="Grasas (g)" value={grasa} onChange={e => setGrasa(e.target.value)} required className="bg-[#1b1b1c] p-3 rounded border border-white/10" />
              <input type="number" placeholder="Calorías" value={caloria} onChange={e => setCaloria(e.target.value)} required className="bg-[#1b1b1c] p-3 rounded border border-white/10" />
            </div>
            <button type="submit" className="w-full bg-[#ff6b00] text-black font-bold py-4 rounded-xl uppercase">Guardar Registro</button>
          </form>
        </div>
      </main>
    </div>
  );
};