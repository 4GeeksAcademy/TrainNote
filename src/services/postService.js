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

export const getPostsForum = async (forumId) => {
    const response = await fetch(
        `${BASE_URL}/api/foro/${forumId}/posts`
    );

    return await response.json();
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