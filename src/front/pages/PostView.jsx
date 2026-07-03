import { useRef } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaEdit, FaTimes } from "react-icons/fa";
import { usePostView } from "../hooks/Hooks_post/usePostView";
 
export const PostView = () => {
    const { post_id } = useParams();
    const {
        post,
        comments,
        loading,
        commentText,
        setCommentText,
        handleComment,
        handleEditComment,
        editingCommentId,
        cancelEdit,
        currentUserId
    } = usePostView(post_id);
    const inputRef = useRef(null);
 
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleComment();
        }
    };
 
    if (loading) {
        return (
            <div className="text-center mt-5">
                <h3>Cargando...</h3>
            </div>
        );
    }
 
    if (!post) {
        return (
            <div className="text-center mt-5">
                <h3>Post no encontrado.</h3>
            </div>
        );
    }
 
    const hasImg = !!post.img;
 
    return (
        <div className="container py-4">
 
            <div className="card shadow-sm border-0 rounded-4">
 
                <div className="card-body p-4">
 
                    <h2 className="text-center fw-bold mb-4">{post.title}</h2>
 
                    <div className={`row g-4 mb-4 ${!hasImg ? "justify-content-center" : ""}`}>
 
                        {hasImg && (
                            <div className="col-12 col-md-5">
                                <img
                                    src={post.img}
                                    alt={post.title}
                                    className="img-fluid rounded-3 w-100"
                                    style={{ maxHeight: "320px", objectFit: "cover" }}
                                />
                            </div>
                        )}
 
                        <div className={`col-12 ${hasImg ? "col-md-7" : "col-md-8 text-center"}`}>
                            <p className="fs-5 text-secondary lh-lg">{post.content}</p>
                        </div>
 
                    </div>
 
                    <div className="bg-light rounded-3 p-3">
                        <h6 className="fw-bold text-muted mb-3">Comentarios</h6>
                        <div
                            style={{ maxHeight: "280px", overflowY: "auto" }}
                            className="d-flex flex-column gap-2"
                        >
                            {comments.length === 0 ? (
                                <p className="text-muted text-center py-3">Sé el primero en comentar.</p>
                            ) : (
                                comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className={`bg-white rounded-3 p-3 shadow-sm ${editingCommentId === comment.id ? "border border-danger" : ""}`}
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="fw-semibold text-secondary small d-flex align-items-center gap-1">
                                                <FaUserCircle />
                                                {comment.username || `Usuario ${comment.user_id}`}
                                            </span>
                                            {Number(comment.user_id) === Number(currentUserId) && (
                                                <button
                                                    className="btn btn-link btn-sm text-muted p-0"
                                                    onClick={() => handleEditComment(comment)}
                                                    title="Editar comentario"
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}
                                        </div>
                                        <p className="mb-0 small text-dark">{comment.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
 
                        {editingCommentId && (
                            <div className="d-flex align-items-center gap-2 mt-2 px-1">
                                <small className="text-danger fw-semibold">Editando comentario</small>
                                <button
                                    className="btn btn-link btn-sm text-muted p-0"
                                    onClick={cancelEdit}
                                    title="Cancelar edición"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}
 
                        <div className="d-flex gap-2 align-items-center mt-3">
                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control rounded-pill"
                                placeholder="Escribe un comentario..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className="btn btn-danger rounded-pill px-4 fw-semibold"
                                onClick={handleComment}
                                disabled={!commentText.trim()}
                            >
                                {editingCommentId ? "Guardar" : "Comentar"}
                            </button>
                        </div>
                    </div>
 
                </div>
            </div>
 
        </div>
    );
};