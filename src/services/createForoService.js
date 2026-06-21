const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createForo = async (foroData) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No se encontró el token de autorización. Por favor, inicia sesión.");
  }

  try {
    const formData = new FormData();
    formData.append("title", foroData.title);
    formData.append("description", foroData.description || "");
    if (foroData.img) {
      formData.append("img", foroData.img); 
    }

    const response = await fetch(`${BACKEND_URL}/api/foro`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
   
      },
      body: formData
    });

    const textData = await response.text();
    const data = textData ? JSON.parse(textData) : {};

    if (!response.ok) {
      const errorMessage = data.msg || `Error al crear el foro (Estado: ${response.status})`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getForos = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/foros`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Error al obtener los foros");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getForoById = async (foroId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/foro/${foroId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Foro no encontrado");
    }

    return data;
  } catch (error) {
    throw error;
  }
};