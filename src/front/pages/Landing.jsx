import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import {
    FaUsers,
    FaComments,
    FaGlobe,
    FaLightbulb
} from "react-icons/fa";

import "../../css/Landing.css"

export const Landing = () => {

    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        handleLogin
    } = useLogin();

    return (
        <div className="landing-page">

            <div className="container">

                <div className="row align-items-center min-vh-100">
                    {/* Parte Izquierda */}

                    <div className="col-lg-6 landing-left">

                        <h1 className="landing-title">
                            Bienvenido a MindFed
                        </h1>

                        <p className="landing-description">
                            La comunidad donde puedes compartir ideas,
                            debatir y conectar con personas que comparten
                            tus mismos intereses.
                        </p>

                        <div className="features">

                            <div className="feature-item">
                                <FaUsers className="feature-icon" />
                                <span>Comunidades activas</span>
                            </div>

                            <div className="feature-item">
                                <FaComments className="feature-icon" />
                                <span>Debates en tiempo real</span>
                            </div>

                            <div className="feature-item">
                                <FaGlobe className="feature-icon" />
                                <span>Películas, deportes, videojuegos y más</span>
                            </div>

                            <div className="feature-item">
                                <FaLightbulb className="feature-icon" />
                                <span>Comparte tus ideas</span>
                            </div>

                        </div>

                    </div>

                    {/* Parte Derecha */}

                    <div className="col-lg-6 d-flex justify-content-center">

                        <div className="login-card">

                            <h2 className="login-title">
                                Iniciar Sesión
                            </h2>

                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                className="form-control mb-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Contraseña"
                                className="form-control mb-4"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {
                                error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )
                            }

                           <button
                                className="btn btn-primary w-100 mb-3"
                                onClick={handleLogin}>
                                Entrar
                            </button>

                            <Link
                                to="/register"
                                className="btn btn-outline-primary w-100"
                            >
                                Registrarse
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};