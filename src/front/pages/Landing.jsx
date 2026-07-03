import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import {
    FaUsers,
    FaComments,
    FaGlobe,
    FaLightbulb
} from "react-icons/fa";

import "../../css/Landing.css"
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Landing = () => {

    const {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
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

                        <div className="login-card mb-3">

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

                            <div className="password-container mb-2">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <span
                                    className="password-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {
                                error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )
                            }

                            <button
                                className="btn btn-primary w-100 mt-2"
                                onClick={handleLogin}>
                                Entrar
                            </button>

                            <Link
                                to="/register"
                                className="btn btn-outline-primary w-100 mt-2"
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