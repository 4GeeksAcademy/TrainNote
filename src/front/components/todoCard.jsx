import React from "react";

export const TodoCard = ({ todo }) => {
    return (
        <div className="card mb-3" style={{ backgroundColor: todo.background || "#f8f9fa" }}>
            <div className="card-body">
                <h5 className="card-title">{todo.title}</h5>
                <p className="card-text">{todo.description}</p>
            </div>
        </div>
    );
}