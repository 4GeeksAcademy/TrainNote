import { Link } from "react-router-dom";
import logofinal from "../assets/img/logofinal.png";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const { role, isAuthenticated } = store;

	return (
		<nav className="navbar hero-section">
			<div className="container d-flex align-items-center justify-content-between mt-2">

				<div className="d-flex align-items-center">
					<Link to="/">
						<img
							src={logofinal}
							alt="logo"
							className="img-fluid"
							style={{ maxHeight: "50px" }}
						/>
					</Link>
					<span className="navbar-brand mb-0 h1 text-white ms-2">
						ACADEMICA
					</span>
				</div>

				<div>
					{!isAuthenticated && (
						<>
							<Link to="/Signup">
								<button className="btn btn-light ms-2">
									Registrate
								</button>
							</Link>

							<Link to="/Login">
								<button className="btn btn-outline-light ms-2">
									Ingresar
								</button>
							</Link>
						</>
					)}


					{isAuthenticated && role === "TEACHER" && (
						<>
							<Link to="/readings-create">
								<button className="btn btn-info ms-2">
									Crear Lectura
								</button>
							</Link>

							<Link to="/crear-tarea">
								<button className="btn btn-info ms-2">
									Crear Tarea
								</button>
							</Link>
						</>
					)}

					{isAuthenticated && role === "ADMIN" && (
						<Link to="/SignupStaff">
							<button className="btn btn-warning ms-2">
								Crear Staff
							</button>
						</Link>
					)}

					{isAuthenticated && role === "STUDENT" && (
						<Link to="/mis-tareas">
							<button className="btn btn-success ms-2">
								Mis tareas
							</button>
						</Link>
					)}

					{isAuthenticated && (
						<Link to="/">
						<button
							className="btn btn-outline-light ms-2"
							onClick={() => {
								localStorage.removeItem("token");
								localStorage.removeItem("role");
								dispatch({ type: "LOGOUT" });
							}}
						>
							Salir
						</button>
						</Link>
					)}
				</div>

			</div>
		</nav>
	);
};