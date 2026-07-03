const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
 
export const getCommentsByPost = async (postId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/api/comment/${postId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error al obtener comentarios");
        }
        return data;
    } catch (error) {
        throw error;
    }
};
 
export const createComment = async (commentData) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/api/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(commentData)
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error al crear comentario");
        }
        return data;
    } catch (error) {
        throw error;
    }
};
 
export const editComment = async (commentId, content) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${BACKEND_URL}/api/comment/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error al editar comentario");
        }
        return data;
    } catch (error) {
        throw error;
    }
};