import React from "react";
import { useParams } from "react-router-dom";
import { CreatePost } from "../components/Post/Createpost";

export const CreacionPost = () => {
    const { foro_id } = useParams();
    return (
        <div className="container mt-5">
            <h1></h1>

            <CreatePost forumId={foro_id} />
        </div>
    );
};