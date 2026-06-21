import { useCreatePost } from "../../hooks/Hooks_post/useCreatePost";
import "../../../css/Post.css";

export const CreatePost = ({ forumId }) => {

    const {
        title,
        setTitle,
        content,
        setContent,
        setImg,
        preview,
        setPreview,
        success,
        handleSubmit
    } = useCreatePost(forumId);

    return (
        <div className="container creacion-post-container">

            <div className="row justify-content-center w-100">

                <div className="col-md-8 col-lg-6">

                    <div className="card shadow creacion-post-card">

                        <div className="card-body p-4">

                            <h3 className="text-center fw-bold mb-4 creacion-post-title">
                                CREACIÓN POST
                            </h3>

                             {success && (                        // ← nuevo
                                <div className="alert alert-success text-center" role="alert">
                                    ✅ ¡Post creado exitosamente!
                                </div>
                            )}


                            <input
                                type="text"
                                className="form-control creacion-post-input mb-3"
                                placeholder="Título"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                            />

                            <input
                                id="post-image"
                                type="file"
                                className="form-control mb-3"
                                accept="image/*"
                                onChange={(e) => {

                                    const file =
                                        e.target.files[0];

                                    setImg(file);

                                    if (file) {
                                        setPreview(
                                            URL.createObjectURL(file)
                                        );
                                    }
                                }}
                            />

                            {
                                preview && (
                                    <div className="text-center mb-3">

                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="img-fluid rounded shadow preview-image"
                                        />

                                    </div>
                                )
                            }

                            <textarea
                                className="form-control creacion-post-textarea mb-4"
                                rows="5"
                                placeholder="Texto / Descripción"
                                value={content}
                                onChange={(e) =>
                                    setContent(e.target.value)
                                }
                            />

                            <div className="d-flex justify-content-center gap-3">

                                <button
                                    className="btn btn-outline-danger btn-cancelar"
                                    onClick={() => {

                                        setTitle("");
                                        setContent("");
                                        setImg(null);
                                        setPreview(null);

                                        const fileInput =
                                            document.getElementById("post-image");

                                        if (fileInput) {
                                            fileInput.value = "";
                                        }

                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-primary btn-publicar"
                                    onClick={handleSubmit}
                                >
                                    Publicar
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};