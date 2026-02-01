import React from "react";
import diplomados from "../assets/img/diplomados.png";

export const Home = () => {
	return (
		<>
			<div className="hero-section text-white">
				<div className="container pt-5">
					<div className="row align-items-center min-vh-75">

						<div className="col-sm-12 col-md-6 text-center text-md-start mb-5 pe-md-5">
							<h1 className="display-5 fw-bold mb-4">
								<span className="text-warning">Entregar</span> tus tareas nunca fue tan fácil
							</h1>

							<p className="fs-5 mt-3">
								Gestioná tareas, lecturas y calificaciones de forma simple y rápida en una sola plataforma.
							</p>

							<button className="btn btn-light btn-lg mt-3 fw-bold">
								Comenzar ahora
							</button>
						</div>

						<div className="col-sm-12 col-md-6 text-center ps-md-5">
							<img
								src={diplomados}
								alt="diplomados"
								className="img-fluid hero-image"
							/>
						</div>

					</div>
				</div>
			</div>

			<div className="container mt-5">
				<div className="row text-center g-4">

					<div className="col-sm-12 col-md-4">
						<div className="bg-white rounded-3 shadow-sm p-4 h-100">
							<i className="fa-solid fa-clock fa-3x mb-3 g-color"></i>
							<h4 className="fw-bold mb-3">Ahorro de tiempo</h4>
							<p>
								Automatiza la gestión de tareas y calificaciones, permitiendo a los docentes centrarse en la enseñanza.
							</p>
							<p>
								Este método garantiza una mayor eficiencia en la gestión académica.
							</p>
						</div>
					</div>

					<div className="col-sm-12 col-md-4">
						<div className="bg-white rounded-3 shadow-sm p-4 h-100">
							<i className="fa-solid fa-users fa-3x mb-3 g-color"></i>
							<h4 className="fw-bold mb-3">Mejora la comunicación</h4>
							<p>
								Facilita la interacción entre estudiantes y docentes, promoviendo un ambiente colaborativo.
							</p>
							<p>
								La automatización mejora la comunicación entre todos los involucrados.
							</p>
						</div>
					</div>

					<div className="col-sm-12 col-md-4">
						<div className="bg-white rounded-3 shadow-sm p-4 h-100">
							<i className="fa-solid fa-chart-line fa-3x mb-3 g-color"></i>
							<h4 className="fw-bold mb-3">Seguimiento del progreso</h4>
							<p>
								Proporciona herramientas para monitorear el rendimiento académico.
							</p>
							<p>
								Permite un seguimiento detallado del progreso de los estudiantes.
							</p>
						</div>
					</div>

				</div>
			</div>
		</>
	);
};
