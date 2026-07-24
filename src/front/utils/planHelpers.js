export const parseResultado = (resultadoRaw) => {
  if (!resultadoRaw) return null;
  if (typeof resultadoRaw === "object") return resultadoRaw;

  try {
    return JSON.parse(resultadoRaw);
  } catch (error) {
    console.error("No se pudo interpretar el resultado del plan:", error);
    return null;
  }
};

export const esPlanEntrenamiento = (resultado) => resultado?.tipo_plan === "training";

export const getDiasEntrenamiento = (resultado) =>
  resultado?.programa || resultado?.estructura_semanal || [];

export const getComidas = (resultado) =>
  resultado?.plan_comidas || resultado?.comidas || [];

export const getAlimentosComida = (comida) => {
  if (Array.isArray(comida.alimentos)) return comida.alimentos;
  if (Array.isArray(comida.opciones)) return comida.opciones;
  if (comida.descripcion) return [comida.descripcion];
  return [];
};

export const getMacros = (resultado) =>
  resultado?.distribucion_macro ||
  resultado?.distribucion_nutricional ||
  resultado?.distribucion_diaria ||
  {};

export const getRecomendaciones = (resultado) => {
  if (Array.isArray(resultado?.recomendaciones)) return resultado.recomendaciones;
  if (resultado?.recomendaciones_nutricionales_y_descanso) {
    return Object.values(resultado.recomendaciones_nutricionales_y_descanso);
  }
  return [];
};

export const getResumenParametros = (plan) => {
  const resultado = parseResultado(plan.Resultado);
  if (!resultado) return [];

  if (esPlanEntrenamiento(resultado)) {
    return [
      resultado.nivel,
      resultado.enfoque,
      resultado.dias_por_semana ? `${resultado.dias_por_semana} días/sem` : null,
    ].filter(Boolean);
  }

  const datos = resultado.datos_usuario || {};
  return [
    datos.objetivo,
    datos.calorias_objetivo ? `${datos.calorias_objetivo} kcal` : null,
    datos.preferencia,
  ].filter(Boolean);
};