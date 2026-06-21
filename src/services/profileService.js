const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const updateProfile = async (userId, profileData) => {
  if (!userId) {
    throw new Error("El ID de usuario es obligatorio para actualizar el perfil.");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No se encontró el token de autorización. Por favor, inicia sesión.");
  }

  try {
    const formData = new FormData();
    formData.append("first_name", profileData.firstName);
    formData.append("last_name", profileData.lastName);
    formData.append("date_birth", profileData.birthDate);
    formData.append("description", profileData.description);
    if (profileData.profileImg){
      formData.append("img", profileData.profileImg)
    }

    const response = await fetch(`${BACKEND_URL}/api/profile/eddit/${userId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    const textData = await response.text();
    const data = textData ? JSON.parse(textData) : {};

    if (!response.ok) {
      const errorMessage = data.msg || `Error en la actualización (Estado: ${response.status})`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Error en updateProfile:", error.message);
    throw error;
  }
};