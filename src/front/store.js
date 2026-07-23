// src/front/store.js

export const initialStore = () => {
  return {
    token: localStorage.getItem("tn_jwt_token") || null,
    user: JSON.parse(localStorage.getItem("tn_user_data")) || null,
    loading: false,
    alert: { show: false, message: "", type: "error" },
    workouts: [],
    nutrition: [],
    weights: [],
    plans: [],
    progressSummary: null,
    progressWeight: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_loading":
      return { ...store, loading: action.payload };

    case "set_alert":
      return { ...store, alert: action.payload };

    case "set_auth":
      return {
        ...store,
        token: action.payload.token,
        user: action.payload.user,
      };

    case "set_workouts":
      return { ...store, workouts: action.payload };

    case "set_nutrition":
      return { ...store, nutrition: action.payload };

    case "set_weights":
      return { ...store, weights: action.payload };

    case "set_plans":
      return { ...store, plans: action.payload };

    case "set_progress_summary":
      return { ...store, progressSummary: action.payload };

    case "set_progress_weight":
      return { ...store, progressWeight: action.payload };

    case "logout":
      localStorage.removeItem("tn_jwt_token");
      localStorage.removeItem("tn_user_data");
      return {
        ...store,
        token: null,
        user: null,
      };

    default:
      return store;
  }
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const apiFetch = async (
  dispatch,
  store,
  endpoint,
  method = "GET",
  body = null,
  requiresAuth = true,
) => {
  dispatch({ type: "set_loading", payload: true });

  const headers = { "Content-Type": "application/json" };

  if (requiresAuth) {
    const token = store.token || localStorage.getItem("tn_jwt_token");
    if (!token) {
      dispatch({ type: "set_loading", payload: false });
      window.location.href = "/";
      return null;
    }
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 && requiresAuth) {
        dispatch({ type: "logout" });
        dispatch({
          type: "set_alert",
          payload: { show: true, message: "Sesión expirada.", type: "error" },
        });
        return null;
      }
      const errorMsg = data.error || data.message || "Error en la solicitud.";
      dispatch({
        type: "set_alert",
        payload: { show: true, message: errorMsg, type: "error" },
      });
      return null;
    }

    if (data.message && method !== "GET") {
      dispatch({
        type: "set_alert",
        payload: { show: true, message: data.message, type: "success" },
      });
      setTimeout(() => {
        dispatch({
          type: "set_alert",
          payload: { show: false, message: "", type: "error" },
        });
      }, 4000);
    }

    return data;
  } catch (err) {
    console.error(`Error Fetch [${endpoint}]:`, err);
    dispatch({
      type: "set_alert",
      payload: {
        show: true,
        message: "No se pudo conectar con el servidor.",
        type: "error",
      },
    });
    return null;
  } finally {
    dispatch({ type: "set_loading", payload: false });
  }
};

// --- CONSUMO DE API / ACCIONES ---
export const actions = {
  login: async (dispatch, store, email, password) => {
    if (!email || !password) {
      dispatch({
        type: "set_alert",
        payload: {
          show: true,
          message: "Ingrese correo y contraseña.",
          type: "error",
        },
      });
      return false;
    }

    const res = await apiFetch(
      dispatch,
      store,
      "/api/login",
      "POST",
      { email, password },
      false,
    );
    if (res && res.access_token) {
      localStorage.setItem("tn_jwt_token", res.access_token);
      localStorage.setItem("tn_user_data", JSON.stringify(res.user));
      dispatch({
        type: "set_auth",
        payload: { token: res.access_token, user: res.user },
      });
      return true;
    }
    return false;
  },

  register: async (
    dispatch,
    store,
    { nombre, email, password, confirmPassword },
  ) => {
    if (password !== confirmPassword) {
      dispatch({
        type: "set_alert",
        payload: {
          show: true,
          message: "Las contraseñas no coinciden.",
          type: "error",
        },
      });
      return false;
    }

    const res = await apiFetch(
      dispatch,
      store,
      "/api/register",
      "POST",
      { nombre, email, password },
      false,
    );
    if (res) {
      dispatch({
        type: "set_alert",
        payload: {
          show: true,
          message: "Registro exitoso. Inicie sesión.",
          type: "success",
        },
      });
      return true;
    }
    return false;
  },

  sendCode: async (dispatch, store, email) => {
    if (!email) {
      dispatch({
        type: "set_alert",
        payload: {
          show: true,
          message: "Ingrese su correo electrónico.",
          type: "error",
        },
      });
      return false;
    }
    const res = await apiFetch(
      dispatch,
      store,
      "/api/request-code",
      "POST",
      { email },
      false,
    );
    return !!res;
  },

  verifyCode: async (dispatch, store, email, codeArray) => {
    const fullCode = codeArray.join("");
    if (fullCode.length < 6) {
      dispatch({
        type: "set_alert",
        payload: {
          show: true,
          message: "Ingrese el código completo de 6 dígitos.",
          type: "error",
        },
      });
      return false;
    }
    const res = await apiFetch(
      dispatch,
      store,
      "/api/verify-code",
      "POST",
      { email, codigo: fullCode },
      false,
    );
    return !!res;
  },

  resetPassword: async (
    dispatch,
    store,
    { email, codeArray, password, confirmPassword },
  ) => {
    const fullCode = codeArray.join("");
    if (password !== confirmPassword) {
      dispatch({
        type: "set_alert",
        payload: {
          show: true,
          message: "Las contraseñas no coinciden.",
          type: "error",
        },
      });
      return false;
    }
    const res = await apiFetch(
      dispatch,
      store,
      "/api/reset",
      "POST",
      { email, codigo: fullCode, password },
      false,
    );
    if (res) {
      dispatch({
        type: "set_alert",
        payload: {
          show: true,
          message: "Contraseña restablecida. Inicie sesión.",
          type: "success",
        },
      });
      return true;
    }
    return false;
  },

  // --- ACCIONES DE PROGRESO ---
  getProgressSummary: async (dispatch, store) => {
    const res = await apiFetch(
      dispatch,
      store,
      "/api/progress_summary",
      "GET",
      null,
      true,
    );
    if (res) {
      dispatch({
        type: "set_progress_summary",
        payload: res,
      });
    }
    return res;
  },

  getProgressWeight: async (dispatch, store, fechaDesde, fechaHasta) => {
    try {
      const token = localStorage.getItem("tn_jwt_token");

      let url = `${import.meta.env.VITE_BACKEND_URL}/api/progress_weight`;
      if (fechaDesde && fechaHasta) {
        url += `?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener el peso");

      const data = await response.json();

      dispatch({
        type: "set_progress_weight",
        payload: data,
      });
    } catch (error) {
      console.error("Error al cargar el peso:", error);
    }
  },
  getProfile: async (dispatch, store) => {
    try {
      const token = localStorage.getItem("tn_jwt_token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Error al obtener perfil");
      const data = await response.json();
      dispatch({ type: "set_user", payload: data });
    } catch (error) {
      console.error(error);
    }
  },

  updateProfile: async (dispatch, store, formData) => {
    try {
      const token = localStorage.getItem("tn_jwt_token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );
      if (!response.ok) throw new Error("Error al actualizar perfil");
      const data = await response.json();
      dispatch({ type: "set_user", payload: data.user || data });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  updatePassword: async (dispatch, store, current_password, password) => {
    try {
      const token = localStorage.getItem("tn_jwt_token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ current_password, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.msg || data.message || "Error al actualizar la contraseña",
        );
      }

      return true;
    } catch (error) {
      console.error(error);

      dispatch({
        type: "set_alert",
        payload: { show: true, message: error.message, type: "error" },
      });
      return false;
    }
  },
  showAlert: (dispatch, store, message, type = "success") => {
    dispatch({
      type: "set_alert",
      payload: { show: true, message, type },
    });
    setTimeout(() => {
      dispatch({
        type: "set_alert",
        payload: { show: false, message: "", type: "" },
      });
    }, 3500);
  },
  // --- CIERRE DE SESIÓN ---
  logout: async (dispatch, store) => {
    await apiFetch(dispatch, store, "/api/logout", "POST", null, true);
    localStorage.removeItem("tn_jwt_token");
    localStorage.removeItem("tn_user_data");
    dispatch({ type: "logout" });
    return true;
  },
};
