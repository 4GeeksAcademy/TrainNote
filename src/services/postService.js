const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createPost = async (formData, token) => {
    const response = await fetch(`${BASE_URL}/api/post`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    return await response.json();
};

export const getPostsByForo = async (foroId) => {
    const token = localStorage.getItem("token");
    try{
        const response = await fetch(`${BASE_URL}/foro/${foroId}/posts`,{
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
    }catch (error) {
        throw error;
    }
};

export const getTopPosts = async (forumId) => {
    const response = await fetch(
        `${BASE_URL}/api/foro/${forumId}/posts/top`
    );

    return await response.json();
};

export const getPostById = async (postId) => {
    const response = await fetch(
        `${BASE_URL}/api/post/${postId}`
    );

    return await response.json();
};

export const editPost = async (postId, content) =>{
    const token = localStorage.getItem("token");
    try{
        const response = await fetch(`${BASE_URL}/api/post/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });
         const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error al editar el post");
        }
        return data;
    }catch (error) {
        throw error;
    }
}