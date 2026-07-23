import React, { useContext, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { apiFetch } from "../store";
import { useNavigate, Link } from "react-router-dom";

export const PlanIA = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [tipoPlan, setTipoPlan] = useState("entrenamiento");
  const [nivel, setNivel] = useState("Avanzado");
  const [diasSemana, setDiasSemana] = useState(5);
  const [minutos, setMinutos] = useState(75);
  const [enfoque, setEnfoque] = useState("Hipertrofia");

  const [resultado, setResultado] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const res = await actions.createPlan({
      tipo_plan: tipoPlan,
      nivel,
      dias_semana: diasSemana,
      minutos_sesion: minutos,
      enfoque
    });
    if (res) setResultado(res);
  };

  return (
    <div className="flex min-h-screen bg-[#131313] text-white">
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-white/5 bg-[#1b1b1c] hidden md:flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-black text-[#ff6b00] uppercase italic">Trainnote</h1>
        <nav className="space-y-2 flex-1">
          <Link to="/progreso.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Progreso</Link>
          <Link to="/plania.html" className="block text-[#ff6b00] font-bold bg-[#ff6b00]/10 p-2 rounded">Plan IA</Link>
          <Link to="/entrenamiento.html" className="block text-[#e2bfb0] p-2 hover:text-[#ff6b00]">Entrenamiento</Link>
        </nav>
      </aside>

      <main className="md:ml-64 flex-1 p-8 pt-20 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-4 bg-[#202020] p-6 rounded-xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-[#ff6b00]">Configurador IA</h2>
          <div className="flex bg-[#1b1b1c] p-1 rounded-lg">
            <button onClick={() => setTipoPlan("entrenamiento")} className={`flex-1 py-2 font-bold text-xs uppercase rounded ${tipoPlan === "entrenamiento" ? "bg-[#ff6b00] text-black" : "text-[#e2bfb0]"}`}>Entrenamiento</button>
            <button onClick={() => setTipoPlan("nutricion")} className={`flex-1 py-2 font-bold text-xs uppercase rounded ${tipoPlan === "nutricion" ? "bg-[#ff6b00] text-black" : "text-[#e2bfb0]"}`}>Nutrición</button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <select value={nivel} onChange={e => setNivel(e.target.value)} className="w-full bg-[#1b1b1c] p-3 rounded border border-white/10 text-white">
              <option>Principiante</option>
              <option>Intermedio</option>
              <option>Avanzado</option>
            </select>
            <input type="number" placeholder="Días por semana" value={diasSemana} onChange={e => setDiasSemana(e.target.value)} className="w-full bg-[#1b1b1c] p-3 rounded border border-white/10 text-white" />
            <input type="text" placeholder="Enfoque principal" value={enfoque} onChange={e => setEnfoque(e.target.value)} className="w-full bg-[#1b1b1c] p-3 rounded border border-white/10 text-white" />
            <button type="submit" className="w-full bg-[#ff6b00] text-black font-black py-4 rounded-lg uppercase">Generar Protocolo</button>
          </form>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-[#202020] p-8 rounded-xl border border-white/10 flex flex-col justify-center items-center">
          {!resultado ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Arquitectura de Rendimiento</h3>
              <p className="text-sm text-[#e2bfb0]">Selecciona los parámetros e inicia la generación con inteligencia artificial.</p>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <h3 className="text-2xl font-bold text-[#ff6b00]">Resultado Generado</h3>
              <pre className="bg-[#1b1b1c] p-4 rounded text-xs overflow-x-auto text-[#e2bfb0]">{JSON.stringify(resultado, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};