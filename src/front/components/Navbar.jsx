import { Link } from "react-router-dom";
import logofinal from "../assets/img/logofinal.png";

export const Navbar = () => {
	return (
		<nav className="navbar hero-section">
			<div className="container d-flex align-items-center justify-content-between mt-2">
					<Link to="/">
					<img
						src={logofinal}
						alt="logo"
						className="img-fluid"
						style={{ maxHeight: "50px" }}
					/>
					</Link>
					<span className="navbar-brand mb-0 h1 text-white me-auto">
						ACADEMICA
					</span>
				<div>
					<Link to="/Signup">
						<button className="btn btn-light opacity-75 ms-2">
							Registrate
						</button>
					</Link>

					<Link to="/Login">
						<button className="btn btn-outline-light ms-2">
							Ingresar
						</button>
					</Link>

					<Link to="/readings-create">
						<button className="btn btn-info p-2  ms-2" >Crear Lectura</button>
					</Link>

					<Link to="/crear-tarea">
						<button className="btn btn-info p-2  ms-2" >CrearTarea</button>
					</Link>


				</div>

			</div>
		</nav>
	);
};
