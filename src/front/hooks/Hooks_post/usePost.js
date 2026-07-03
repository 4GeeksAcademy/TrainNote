import { useState, useEffect } from "react";
import { getPostsByForo, editPost } from "../services/postService";

export const usePost = (foro_id) => {
   
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadPosts = async () => {

        try {

            setLoading(true);

            const data =
                await getPostsForum(
                    forumId
                );

                console.log("Datos recibidos:", data);


            setPosts(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        if (forumId) {
            loadPosts();
        }

    }, [forumId]);

    return {
        posts,
        loading,
        loadPosts
    };

    console.log("Posts en estado:", posts);
};