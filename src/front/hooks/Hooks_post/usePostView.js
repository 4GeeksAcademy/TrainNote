import { useState, useEffect } from "react";
import { getPostById } from "../../../services/postService";
import { getCommentsByPost, createComment, editComment } from "../../../services/commentService"; 
 
export const usePostView = (post_id) => {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
 
    const user = JSON.parse(localStorage.getItem("user"));
 
    useEffect(() => {
        loadPost();
        loadComments();
    }, [post_id]);
 
    const loadPost = async () => {
        try {
            const data = await getPostById(post_id);
            setPost(data);
        } catch (error) {
            console.error("Error al cargar el post", error);
        } finally {
            setLoading(false);
        }
    };
 
    const loadComments = async () => {
        try {
            const data = await getCommentsByPost(post_id);
            setComments(data.comments || []);
        } catch (error) {
            console.error("Error al cargar comentarios", error);
        }
    };
 
    const handleComment = async () => {
        if (!commentText.trim()) return;
 
        try {
            if (editingCommentId) {
                await editComment(editingCommentId, commentText);
                setEditingCommentId(null);
            } else {
                await createComment({
                    content: commentText,
                    post_id: parseInt(post_id),
                    user_id: user?.id
                });
            }
            setCommentText("");
            await loadComments();
        } catch (error) {
            console.error("Error al guardar comentario", error);
        }
    };
 
    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setCommentText(comment.content);
    };
 
    const cancelEdit = () => {
        setEditingCommentId(null);
        setCommentText("");
    };
 
    return {
        post,
        comments,
        loading,
        commentText,
        setCommentText,
        handleComment,
        handleEditComment,
        editingCommentId,
        cancelEdit,
        currentUserId: user?.id
    };
};