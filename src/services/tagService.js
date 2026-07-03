const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getTags = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/tag`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    dispatch({
      type: "all_tags",
      payload: data.tag,
    });
  } catch (err) {
    console.error("Error to get tags", err);
  }
};

export const selectTagFromUser = async (selectTags) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BACKEND_URL}/api/tag-select`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tags_id: selectTags,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Error al guardar tags");
    }

    return data;
  } catch (err) {
    console.error("Error to get tags", err);
    throw err;
  }
};

export const selectTagFromForo = async (foroId, tagsId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BACKEND_URL}/api/tag-select-foro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        foro_id: foroId,
        tags_id: tagsId,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.msg || "Error al asignar tags al foro");
    }
    return data;
  } catch (err) {
    console.error("Error to get tags", err);
    throw err;
  }
};

export const getTagsFromUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BACKEND_URL}/api/tag/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data.tags;
};

export const deleteTagFromUser = async (tagId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BACKEND_URL}/api/tag-select/${tagId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Error eliminando tag");
    }

    return data;
  } catch (err) {
    console.error("Error deleting tag", err);
    throw err;
  }
};
