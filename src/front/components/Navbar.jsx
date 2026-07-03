import { Link } from "react-router-dom";
import logo from "../assets/img/logomin.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../css/Navbar.css";

export const Navbar = () => {

    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            navigate(`/feed?search=${search}`);
        }
    };

    return (

        <nav className="navbar bg-white shadow-sm border-bottom">

            <div className="container-fluid navbar-content">
                <Link
                    to="/feed"
                    className="navbar-brand"
                >

                    <img
                        src={logo}
                        alt="MindFed"
                        className="mindfed-logo"
                    />

                </Link>


                <div className="navbar-search-container">

                    <input
                        type="text"
                        className="form-control navbar-search"
                        placeholder="Buscar foros..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                    />

                </div>

                <div className="dropdown">

                    <button
                        className="btn btn-light menu-btn"
                        type="button"
                        data-bs-toggle="dropdown"
                    >
                        ☰
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">

                        <li>
                            <Link
                                className="dropdown-item"
                                to="/create-foro"
                            >
                                Crear Foro
                            </Link>
                        </li>
                        <li>
                            <Link 
                            className="dropdown-item"
                                to="/foros"
                            >
                            Foros
                            </Link>
                        </li>

                        <li>
                            <Link
                                className="dropdown-item"
                                to={`/profile/${user?.id}`}
                            >
                                Perfil
                            </Link>
                        </li>

                        <li>
                            <button
                                className="dropdown-item"
                            >
                                Tema
                            </button>
                        </li>

                        <li>
                            <hr className="dropdown-divider" />
                        </li>

                        <li>
                            <button
                                className="dropdown-item text-danger"
                            >
                                Cerrar Sesión
                            </button>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>

    );
};