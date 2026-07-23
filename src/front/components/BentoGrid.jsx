import React from "react";

export const BentoGrid = () => {
  return (
    <div className="lg:col-span-5 flex flex-col justify-between gap-6">
      
      <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col gap-4 shadow-2xl hover:border-[#ff6b00]/30 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#ff6b00] rounded-xl flex items-center justify-center shadow-[0_0_20px_#ff6b00]">
            <span className="material-symbols-outlined text-white text-3xl">bolt</span>
          </div>
          <h1 className="font-extrabold text-4xl text-white uppercase tracking-tighter">
            Trainnote
          </h1>
        </div>
        <p className="text-2xl text-[#e2bfb0] font-semibold leading-tight">
          Forma tu mejor versión
        </p>
        <div className="h-1 w-16 bg-[#ff6b00] rounded-full shadow-[0_0_15px_rgba(255,107,0,0.2)]"></div>
        <p className="text-lg text-[#e2bfb0]/80 mt-2 leading-relaxed">
          Eleva tu rendimiento físico con seguimiento de precisión, registro de historial y planes de entrenamiento y nutrición impulsados por IA.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col gap-2 group hover:border-[#ff6b00]/30 transition-all duration-300">
          <span className="material-symbols-outlined text-[#ff6b00] text-3xl transition-transform duration-300 group-hover:scale-110">
            fitness_center
          </span>
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff6b00]">Entrenamiento</p>
            <p className="text-[#e2bfb0]/80 text-xs mt-1 leading-snug">
              Crea tu rutina diaria y consulta el historial completo de tus sesiones.
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col gap-2 group hover:border-[#ff6b00]/30 transition-all duration-300">
          <span className="material-symbols-outlined text-[#ff6b00] text-3xl transition-transform duration-300 group-hover:scale-110">
            restaurant
          </span>
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff6b00]">Nutrición</p>
            <p className="text-[#e2bfb0]/80 text-xs mt-1 leading-snug">
              Registra tus comidas y revisa el historial de tu plan nutricional.
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col gap-2 group hover:border-[#ff6b00]/30 transition-all duration-300">
          <span className="material-symbols-outlined text-[#ff6b00] text-3xl transition-transform duration-300 group-hover:scale-110">
            trending_up
          </span>
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff6b00]">Progreso</p>
            <p className="text-[#e2bfb0]/80 text-xs mt-1 leading-snug">
              Monitorea tu evolución con datos, gráficas y métricas clave.
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col gap-2 group hover:border-[#ff6b00]/30 transition-all duration-300">
          <span className="material-symbols-outlined text-[#ff6b00] text-3xl transition-transform duration-300 group-hover:scale-110">
            psychology
          </span>
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#ff6b00]">IA Fitness</p>
            <p className="text-[#e2bfb0]/80 text-xs mt-1 leading-snug">
              Genera un plan personalizado de entrenamiento o nutrición según tus metas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};