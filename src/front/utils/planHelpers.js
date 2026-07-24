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

export const esPlanEntrenamiento = (resultado) =>
  resultado?.tipo_plan === "training" ||
  resultado?.tipo_plan === "ENTRENAMIENTO" ||
  !!resultado?.estructura_semanal ||
  !!resultado?.programa ||
  !!resultado?.semana;

// Devuelve los días crudos, sea cual sea la clave que use Gemini
const getDiasCrudos = (resultado) =>
  resultado?.programa ||
  resultado?.estructura_semanal ||
  resultado?.semana ||
  resultado?.dias ||
  [];

// Normaliza cada día a una forma estable: { dia, enfoque_sesion, calentamiento, ejercicios, cardio_finisher }
export const getDiasEntrenamiento = (resultado) => {
  const diasCrudos = getDiasCrudos(resultado);

  return diasCrudos.map((dia, idx) => {
    const ejerciciosCrudos = dia.ejercicios || dia.bloque_principal || [];

    const ejercicios = ejerciciosCrudos.map((ej) => ({
      nombre: ej.nombre || ej.ejercicio,
      series: ej.series,
      repeticiones: ej.repeticiones,
      descanso_segundos: ej.descanso_segundos,
      descanso: ej.descanso, // string tipo "90 segundos"
      notas: ej.notas,
    }));

    // cardio_finisher puede venir como string o como objeto {tipo, duracion_minutos, estructura}
    let cardioFinisher = dia.cardio_finisher;
    if (cardioFinisher && typeof cardioFinisher === "object") {
      cardioFinisher = [
        cardioFinisher.tipo,
        cardioFinisher.duracion_minutos ? `${cardioFinisher.duracion_minutos} min` : null,
        cardioFinisher.estructura,
      ]
        .filter(Boolean)
        .join(" · ");
    }

    return {
      dia: dia.dia || idx + 1,
      enfoque_sesion: dia.enfoque_sesion || dia.enfoque,
      calentamiento: Array.isArray(dia.calentamiento) ? dia.calentamiento.join(" · ") : dia.calentamiento,
      ejercicios,
      cardio_finisher: cardioFinisher,
    };
  });
};

export const getComidas = (resultado) =>
  resultado?.plan_comidas || resultado?.comidas || [];

export const getAlimentosComida = (comida) => {
  if (Array.isArray(comida.alimentos)) return comida.alimentos;
  if (Array.isArray(comida.opciones)) return comida.opciones;
  if (comida.descripcion) return [comida.descripcion];
  return [];
};

// Normaliza los macros a claves estables sin importar el nombre que use Gemini
export const getMacros = (resultado) => {
  const crudo =
    resultado?.distribucion_macronutrientes ||
    resultado?.distribucion_macros ||
    resultado?.distribucion_macro ||
    resultado?.distribucion_nutricional ||
    resultado?.distribucion_diaria ||
    {};

  return {
    calorias: crudo.calorias_totales || crudo.calorias || null,
    proteinas_g: crudo.proteinas_g ?? null,
    carbohidratos_g: crudo.carbohidratos_g ?? null,
    grasas_g: crudo.grasas_g ?? null,
    agua_litros: crudo.agua_litros ?? null,
  };
};

export const getRecomendaciones = (resultado) => {
  if (Array.isArray(resultado?.recomendaciones)) return resultado.recomendaciones;
  if (Array.isArray(resultado?.recomendaciones_generales)) return resultado.recomendaciones_generales;
  if (resultado?.recomendaciones_nutricionales_y_descanso) {
    return Object.values(resultado.recomendaciones_nutricionales_y_descanso);
  }
  if (resultado?.recomendaciones_nutricionales && typeof resultado.recomendaciones_nutricionales === "object") {
    return Object.values(resultado.recomendaciones_nutricionales);
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