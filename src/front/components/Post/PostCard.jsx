import React from "react";
import userImg from "../../assets/img/userImg.png";
import { Link, useParams } from "react-router-dom";


export const PostCard = ({post}) => {
    const { foro_id } = useParams();
    return(
       <div className="d-flex flex-column mb-4 w-100" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div 
                className="d-flex align-items-center gap-2 px-3 py-2 border border-bottom-0 rounded-top bg-light text-dark"
                style={{ width: "fit-content", marginLeft: "15px" }}
            >
                <img 
                    src={post.user?.img_user || userImg} 
                    alt={post.user?.name} 
                    className="rounded-circle border"
                    style={{ width: "25px", height: "25px", objectFit: "cover" }}
                />
                <span className="fw-semibold small">{post.user?.name}</span>
            </div>
            <div className="position-relative p-4 border rounded bg-white text-dark shadow-sm">
                <button 
                    className="btn btn-sm btn-light position-absolute p-0 d-flex align-items-center justify-content-center border"
                    style={{ top: "15px", right: "15px", width: "28px", height: "28px", borderRadius: "50%" }}
                >
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
                <h3 className="h5 fw-bold mb-3 text-start">
                    {post.title}
                </h3>
                {post.img && (
                    <div className="mb-3 text-center rounded overflow-hidden border">
                        <img 
                            src={post.img} 
                            alt="Contenido" 
                            className="img-fluid w-100"
                            style={{ maxHeight: "280px", objectFit: "cover" }}
                        />
                    </div>
                )}
                <div className="p-3 border rounded bg-light mb-3">
                    <p className="mb-0 text-start" style={{ fontSize: "14px" }}>{post.content}</p>
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <Link className="btn btn-sm btn-light border fw-medium px-3"
                    to={`/foro/${foro_id}/post/${post.id}`}>
                        Comentarios
                    </Link>
                    <button className="btn btn-sm btn-light border fw-medium px-3">
                        <i class="fa-regular fa-heart"></i> Like 
                    </button>
                </div>
            </div> 
        </div>
    )
}