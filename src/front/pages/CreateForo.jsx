import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCreateForo } from "../hooks/Hooks_foro/useCreateForo.js";
import { BodyTag } from "../components/BodyTag.jsx";
import { useTag } from "../hooks/useTag.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CreateForo = () => {

  const { store, dispatch } = useGlobalReducer()

  const {
    title,
    setTitle,
    img,
    setImg,
    description,
    setDescription,
    error,
    loading,
    success,
    handleCreateForo
  } = useCreateForo();


  const { chargeTagsToCreateForo, onSelectedTag, handleSaveForo, selectedTag } = useTag();

  useEffect(() => {
    chargeTagsToCreateForo();
  }, []);

  // const [likeCount, setLikeCount] = useState(0);

  // const handleLike = () => {
  //   setLikeCount((prev) => prev + 1);
  // };

  const saveForo = async (e) => {
    e.preventDefault()
    try {
      const res = await handleCreateForo();
      const foroId = res.forum.id;
      await handleSaveForo(foroId);
    } catch (err) {
      console.error("Error to save foro", err);
    }
  }


  return (
    <div className="container py-4 min-vh-100 d-flex flex-column justify-content-between">

      <form onSubmit={saveForo} className="h-100 d-flex flex-column flex-grow-1 justify-content-between">

        <div className="mb-3">
          {error && (
            <div className="alert alert-danger text-center shadow-sm py-2" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
            </div>
          )}
          {success && (
            <div className="alert alert-success text-center shadow-sm py-2" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>¡Foro creado con éxito! Redirigiendo...
            </div>
          )}
        </div>

        <div className="row align-items-center mb-4 g-3">

          <div className="col-auto">
            {img ? (
              <img
                src={img instanceof File ? URL.createObjectURL(img) : null}
                alt="Foro preview"
                className="rounded-circle shadow-sm object-fit-cover"
                style={{ width: "65px", height: "65px" }}
                onError={(e) => {
                  e.target.src = "https://placehold.co/65?text=Foro";
                }}
              />
            ) : (
              <div
                className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                style={{ width: "65px", height: "65px", fontSize: "1.8rem" }}
              >
                💬
              </div>
            )}
          </div>

          <div className="col">
            <div className="card shadow-sm border-0 bg-white p-2 rounded-3">
              <input
                type="text"
                className="form-control border-0 text-center fw-bold text-uppercase tracking-wide h4 mb-0 py-2"
                placeholder="Escribe el Título de tu Foro aquí..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ outline: "none", boxShadow: "none" }}
              />
            </div>
          </div>


        </div>

        <div className="row mb-3">
          <div className="col-12">
            <div className="card shadow-sm border-0 p-3 bg-white rounded-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-light-subtle text-muted">
                  <i className="bi bi-image"></i>
                </span>
                <input
                  type="file"
                  className="form-control border-light-subtle"
                  accept="image/*"
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row flex-grow-1 mb-4">
          <div className="col-12 d-flex">
            <div className="card shadow-lg border-0 w-100 p-4 bg-white rounded-4 d-flex flex-column">
              <label htmlFor="postContent" className="form-label text-muted fw-bold mb-3">
                <i className="bi bi-pencil-square me-2"></i>Contenido o descripción del foro
              </label>
              <textarea
                id="postContent"
                className="form-control flex-grow-1 p-3 border-light-subtle rounded-3"
                placeholder="¿De qué se trata este foro? Escribe aquí el contenido principal..."
                style={{ minHeight: "220px", resize: "none" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
        </div>


        <div>
          <label className="form-label fw-bold" >Selecciona las Tags del Foro</label>
          <div className="d-flex flex-wrap gap-2 border p-3 rounded bg-light overflow-y-auto"
            style={{ maxHeight: "200px" }}>
            {store.tags && store.tags.map((tag) => {
              const handleSelected = selectedTag.includes(tag.id);
              return (<BodyTag key={tag.id} tag={tag} onSelectedTag={onSelectedTag} isSelected={handleSelected} />);
            })}
          </div>
        </div>

        <div className="row justify-content-between align-items-center g-3">
          <div className="col-auto">
            <Link
              to="/foro"
              className="btn btn-outline-secondary btn-lg rounded-pill shadow-sm px-4 fw-bold fs-6"
            >
              <i className="bi bi-arrow-left me-2"></i>Back Home
            </Link>
          </div>

          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-primary btn-lg rounded-pill shadow-sm px-5 fw-bold fs-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Publicando...
                </>
              ) : (
                <>
                  Publicar<i className="bi bi-send-fill ms-2"></i>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};