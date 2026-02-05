import React from "react";

export const TodoCard = ({ todo }) => {
	return (
		<div className="card shadow todo-card" style={{ width: "18rem" }}>
			<img
				src="https://fastly.picsum.photos/id/5/5000/3334.jpg?hmac=R_jZuyT1jbcfBlpKFxAb0Q3lof9oJ0kREaxsYV3MgCc"
				className="card-img-top"
				alt="tarea"
			/>
			<div className="card-body">
				<h5 className="card-title">{todo.title}</h5>
				<p className="card-text">{todo.description}</p>
				<button className="btn btn-primary w-100">
					Ver tarea
				</button>
			</div>
		</div>
	);
};