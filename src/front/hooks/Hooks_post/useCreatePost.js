import { useState } from "react";
import { createPost } from "../../../services/postService";

export const useCreatePost = (forumId) => {

    const [content, setContent] = useState("");
    const [img, setImg] = useState(null);
    const [title, setTitle] = useState("");
    const [preview, setPreview] = useState(null);
    const [success, setSuccess] = useState(false);


    const handleSubmit = async () => {

        console.log("BOTÓN PUBLICAR PRESIONADO");

       const token = localStorage.getItem("token");

        console.log("TOKEN:", token);
    

        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);
        formData.append("foro_id", forumId);

        if (img) {
            formData.append("img", img);
        }

        try {

            const data = await createPost(
                formData,
                token
            );

            console.log(data);


            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            setContent("");
            setImg(null);

        } catch (error) {

            console.log(error);

        }
    };

    return {
        title,
        setTitle,
        content,
        setContent,
        img,
        setImg,
        preview,
        setPreview,
        success,
        handleSubmit
    };
};