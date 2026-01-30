import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
			<nav className="navbar navbar-light bg-light">
			<div className="container col-8">
				
					<span className="navbar-brand mb-0 h1 ">ACADEMICA</span>
				
				<div className="ml-auto">
				
					<Link to="/Login">
						<button className="btn btn-info p-2 ms-2 ">Login</button>
					</Link>

					<Link to="/Signup">
						<button className="btn btn-info p-2  ms-2" >Signup</button>
					</Link>

					<Link to="/Signup-Staff">
						<button className="btn btn-info p-2  ms-2" >Signup Staff</button>
					</Link>

					<Link to="/readings-create">
						<button className="btn btn-info p-2  ms-2" >Crear Tarea</button>
					</Link>

				</div>
			</div>
		</nav>
	);
};