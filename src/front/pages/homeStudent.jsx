import React, { useEffect } from "react";
import { TodoCard } from "../components/todoCard";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const HomeStudent = () => {
	const { store, dispatch } = useGlobalReducer();
	const todos = store.todos || [];

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				const backend = import.meta.env.VITE_BACKEND_URL;
				const resp = await fetch(`${backend}/todos`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});

				const data = await resp.json();

				dispatch({
					type: "SET_TODOS",
					payload: data,
				});
			} catch (error) {
				console.error("Error fetching tasks:", error);
			}
		};

		fetchTodos();
	}, [dispatch]);

	return (
		<div className="bg-light pb-5">
			{/* HERO */}
			<div className="hero-section text-white">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-md-6">
							<h1 className="display-5 fw-bold mb-4">
								<span className="text-warning">Bienvenido</span> Estudiante
							</h1>
							<p className="fs-5">
								Aquí podrás gestionar tus tareas, lecturas y calificaciones
								de forma simple y rápida.
							</p>
						</div>

						<div className="col-md-6 text-center">
							<img
								src="https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=GDjZ2uNWE3V59PkdDaOzTOuV3tPWWxJSf4fNcxu4S2g"
								className="img-fluid rounded-5"
								alt="novedades"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* TAREAS */}
			<div className="container mt-5">
				<h2 className="fw-bold mb-4">Mis Tareas</h2>

				{todos.length === 0 && (
					<p>No hay tareas asignadas</p>
				)}

				<div className="d-flex gap-3 overflow-auto px-3 pb-3">
					{todos.map(todo => (
						<TodoCard key={todo.id} todo={todo} />
					))}
				</div>
			</div>
		</div>
	);
};