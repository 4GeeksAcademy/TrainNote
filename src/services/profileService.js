const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getProfile = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BACKEND_URL}/api/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Error obteniendo el perfil");
  }

  return data;
};

export const updateProfile = async (userId, profileData) => {
  if (!userId) {
    throw new Error(
      "El ID de usuario es obligatorio para actualizar el perfil.",
    );
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "No se encontró el token de autorización. Por favor, inicia sesión.",
    );
  }

  try {
    const formData = new FormData();
    formData.append("first_name", profileData.firstName);
    formData.append("last_name", profileData.lastName);
    formData.append("username", profileData.username);
    formData.append("email", profileData.email);
    formData.append("date_birth", profileData.birthDate);
    formData.append("description", profileData.description);

    if (profileData.profileImg) {
      formData.append("img", profileData.profileImg);
    }

    const response = await fetch(`${BACKEND_URL}/api/profile/eddit/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const textData = await response.text();
    const data = textData ? JSON.parse(textData) : {};

    if (!response.ok) {
      const errorMessage =
        data.msg || `Error en la actualización (Estado: ${response.status})`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("Error en updateProfile:", error.message);
    throw error;
  }
};
