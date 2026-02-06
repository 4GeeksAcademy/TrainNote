import React from "react"
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const TodoCard = ({ todo }) => {
	return (
		<div className="card border shadow-sm" style={{ minWidth: "320px", minHeight: "450px" }}>
			
			<div className="border-bottom">
				<img
					src="https://fastly.picsum.photos/id/5/5000/3334.jpg?hmac=R_jZuyT1jbcfBlpKFxAb0Q3lof9oJ0kREaxsYV3MgCc"
					className="card-img-top"
					alt="tarea"
					style={{ height: "180px", objectFit: "cover" }}
				/>
			</div>
			<div className="card-body d-flex flex-column">
				<h5 className="card-title border-bottom pb-2 mb-2 text-center">
					{todo.title}
				</h5>

				<p
					className="card-text"
				>
					{todo.description}
				</p>
			</div>

			<div className="card-footer bg-white d-flex">
				<button className="btn btn-primary w-100">
					Ver tarea
				</button>
			</div>
		</div>
	);
};