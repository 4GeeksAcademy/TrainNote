import React from "react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PostCard } from "../components/Post/PostCard"
import { BodyTagSimply } from "../components/BodyTag.jsx";
import { useForoById } from "../hooks/Hooks_foro/useForo.js";
import logo from "../assets/img/logomin.png";


export const ForoPage = () => {
    const {foro_id} = useParams();
    const{
        getForoForId, 
        foro, 
        loading
    }=useForoById(foro_id)

    if (loading) {
        return (
            <div className="text-center mt-5">
                <h3>Cargando...</h3>
            </div>
        );
    }

     if (!foro) {
        return (
            <div className="text-center mt-5">
                <h3>Foro no encontrado.</h3>
            </div>
        );
    }
 

    return (
       <div className="container mt-4 pb-5" style={{ maxWidth: "800px" }}>
            <div className="d-flex align-items-center justify-content-between gap-3 mb-3 bg-white p-3 rounded border shadow-sm">
                <div className="flex-shrink-0">
                    <img 
                        src={foro.img || logo} 
                        alt="Foto del foro" 
                        className="rounded-circle border border-secondary shadow-sm"
                        style={{ width: "70px", height: "70px", objectFit: "cover" }}
                    />
                </div>
                <div className="flex-grow-1 text-center">
                    <h1 className="h3 border rounded py-2 px-4 bg-light d-inline-block fw-bold text-uppercase m-0">
                        {foro.title}
                    </h1>
                </div>
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-secondary fw-medium px-3 shadow-sm d-flex align-items-center gap-1"
                        type="button"
                        data-bs-toggle="collapse" 
                        data-bs-target="#infoForoCollapse" 
                        aria-expanded="false" 
                        aria-controls="infoForoCollapse"
                    >
                        info <span>▼</span>
                    </button>
                    
                    <button className="btn btn-outline-danger fw-medium px-3 shadow-sm">
                        <i className="fa-regular fa-heart"></i> Like
                    </button>
                </div>
            </div>
            <div className="collapse mb-3" id="infoForoCollapse">
                <div className="card card-body bg-white border shadow-sm">
                    <h5 className="fw-bold text-secondary mb-2">Acerca de este foro:</h5>
                    <p className="text-muted small mb-3">{foro.description}</p>
                    <div className="d-flex flex-wrap gap-2 pt-2 border-top">
                       {foro.tags && foro.tags.length > 0 ? (
                            foro.tags.map((tag) => (
                                <BodyTagSimply key={tag.id} tag={tag} />
                            ))
                        ) : (
                            <span className="text-muted xtra-small">Sin etiquetas</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <input 
                    type="text" 
                    className="form-control form-control-lg text-center border-2 shadow-sm rounded-pill" 
                    placeholder="BUSQUEDA" 
                />
            </div>
            <div className="p-4 border rounded-4 bg-white shadow-sm mb-4">
                {foro.posts && foro.posts.length > 0 ? (
                    foro.posts.map((post)=>(
                        <Link className="text-decoration-none text-dark"
                        to={`/foro/${foro_id}/post/${post.id}`}>
                        <PostCard key={post.id} post={post}/>
                        </Link>
                    ))):(<span className="text-muted xtra-small">Se el primero en comentar</span>)}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
                <Link className="btn btn-dark px-4 py-2 fw-medium shadow-sm rounded-3"
                to="/feed">
                    Back home
                </Link>
                <Link
                to= {`/foro/${foro_id}/create-post`}
                className="btn btn-success px-4 py-2 fw-bold shadow-sm rounded-3">
                Publicar
                </Link>
            </div>
        </div>
    )

}