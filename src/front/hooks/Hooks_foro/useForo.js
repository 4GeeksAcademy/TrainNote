import { useState, useEffect } from "react";
import { getForos, getForoById } from "../../../services/foroService.js";
import useGlobalReducer from "../useGlobalReducer.jsx";

export const useForo = () => {
  const { store, dispatch } = useGlobalReducer();

  const getDataForo = async () => {
    try {
      const foroList = await getForos(dispatch);
    } catch (err) {
      setError(err.message || "Error en enlistar foros");
    }
  };

  return {
    getDataForo,
  };
};

export const useForoById = (foro_id) => {
  const [loading, setLoading] = useState(true);
  const [foro, setForo] = useState(null);

  const getForoForId = async () => {
    try {
      setLoading(true);
      const data = await getForoById(foro_id);
      setForo(data);
    } catch (error) {
      console.error("Error al cargar el post", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      getForoForId();
  }, [foro_id]);

  return {getForoForId, foro, loading};
};
