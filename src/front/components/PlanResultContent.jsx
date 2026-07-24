import React from "react";
import {
  esPlanEntrenamiento,
  getDiasEntrenamiento,
  getComidas,
  getAlimentosComida,
  getMacros,
  getRecomendaciones,
} from "../utils/planHelpers";

export const PlanResultContent = ({ resultado }) => {
  let resParsed = resultado;
  if (typeof resultado === "string") {
    try {
      resParsed = JSON.parse(resultado);
    } catch (e) {
      resParsed = null;
    }
  }

  if (!resParsed) {
    return (
      <p className="text-[10px] font-mono text-[#e2bfb0]/50 uppercase text-center py-6">
        No se pudo interpretar el resultado de este plan.
      </p>
    );
  }

  const esEntrenamiento = esPlanEntrenamiento(resParsed);
  const diasEntrenamiento = esEntrenamiento ? getDiasEntrenamiento(resParsed) : [];
  const macros = getMacros(resParsed);

  return (
    <div className="space-y-4">
      {/* PARÁMETROS GENERALES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {esEntrenamiento ? (
          <>
            <InfoChip label="Objetivo" valor={resParsed.objetivo_principal || resParsed.objetivo} />
            <InfoChip label="Nivel" valor={resParsed.nivel} />
            <InfoChip label="Días/Semana" valor={resParsed.dias_por_semana} />
            <InfoChip label="Min/Sesión" valor={resParsed.tiempo_por_sesion_minutos || resParsed.minutos_sesion} />
            <InfoChip label="Enfoque" valor={resParsed.enfoque} />
            <InfoChip label="Equipo" valor={resParsed.equipo} />
          </>
        ) : (
          <>
            <InfoChip label="Calorías" valor={macros.calorias} />
            <InfoChip label="Proteínas" valor={macros.proteinas_g ? `${macros.proteinas_g} g` : null} />
            <InfoChip label="Carbohidratos" valor={macros.carbohidratos_g ? `${macros.carbohidratos_g} g` : null} />
            <InfoChip label="Grasas" valor={macros.grasas_g ? `${macros.grasas_g} g` : null} />
          </>
        )}
      </div>

      {/* CONTENIDO ESPECÍFICO */}
      {esEntrenamiento ? (
        <div className="space-y-3">
          {diasEntrenamiento.length === 0 && (
            <p className="text-[10px] font-mono text-[#e2bfb0]/50 uppercase text-center py-6">
              No se encontraron días en este plan.
            </p>
          )}

          {diasEntrenamiento.map((dia, idx) => (
            <div key={idx} className="bg-black/50 border border-white/10 rounded-lg p-3.5 space-y-2">
              <p className="text-xs sm:text-sm font-mono font-bold text-[#ff6b00] uppercase">
                Día {dia.dia} · {dia.enfoque_sesion}
              </p>

              {dia.calentamiento && (
                <p className="text-[11px] font-mono text-[#e2bfb0]/80">
                  <strong className="text-white">Calentamiento:</strong> {dia.calentamiento}
                </p>
              )}

              <div className="space-y-2 pt-1">
                {dia.ejercicios.map((ej, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-baseline justify-between text-xs font-mono text-white/90 bg-white/5 px-3 py-2 rounded-md border border-white/5"
                  >
                    <span className="font-bold text-white">{ej.nombre}</span>
                    <div className="flex flex-wrap gap-3 text-[11px]">
                      <span className="text-[#ff6b00] font-bold">
                        {ej.series} x {ej.repeticiones}
                      </span>
                      {ej.descanso_segundos !== undefined && ej.descanso_segundos !== null ? (
                        <span className="text-[#e2bfb0]/80">Descanso: {ej.descanso_segundos}s</span>
                      ) : ej.descanso ? (
                        <span className="text-[#e2bfb0]/80">Descanso: {ej.descanso}</span>
                      ) : null}
                    </div>
                    {ej.notas && <p className="w-full text-[10px] text-[#e2bfb0]/60 italic mt-0.5">— {ej.notas}</p>}
                  </div>
                ))}
              </div>

              {dia.cardio_finisher && (
                <p className="text-[11px] font-mono text-[#e2bfb0]/80 pt-1">
                  <strong className="text-white">Cardio:</strong> {dia.cardio_finisher}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {getComidas(resParsed).map((comida, idx) => (
            <div key={idx} className="bg-black/50 border border-white/10 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-mono font-bold text-[#ff6b00] uppercase">
                  {comida.comida || comida.nombre}
                </p>
                {comida.calorias_aprox && (
                  <span className="text-[10px] font-mono text-[#ff6b00] bg-[#ff6b00]/15 px-2 py-0.5 rounded font-semibold uppercase">
                    {comida.calorias_aprox} kcal
                  </span>
                )}
              </div>
              <ul className="space-y-1.5">
                {getAlimentosComida(comida).map((alimento, i) => (
                  <li key={i} className="text-xs font-mono text-white/90 bg-white/5 px-2.5 py-1 rounded">· {alimento}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* RECOMENDACIONES */}
      {getRecomendaciones(resParsed).length > 0 && (
        <div className="bg-black/50 border border-white/10 rounded-lg p-3.5 space-y-1.5">
          <p className="text-[11px] font-mono font-bold text-[#ff6b00] uppercase">Recomendaciones</p>
          <ul className="space-y-1">
            {getRecomendaciones(resParsed).map((rec, i) => (
              <li key={i} className="text-xs font-mono text-white/90">· {rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const InfoChip = ({ label, valor }) => {
  if (!valor) return null;
  return (
    <div className="bg-black/50 border border-white/10 rounded-lg px-3 py-2">
      <p className="text-[9px] font-mono text-[#e2bfb0]/70 uppercase tracking-wider">{label}</p>
      <p className="text-xs sm:text-sm font-mono text-white font-bold truncate mt-0.5">{valor}</p>
    </div>
  );
};