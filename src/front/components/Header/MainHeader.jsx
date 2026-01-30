import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/header.css";

export default function MainHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    const variant = location.pathname === "/home" ? "home" : "profile";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header className="main-header">
            <div className="header-inner">

                <div className="header-left">

                    <div
                        className="user-avatar clickable"
                        onClick={() => navigate("/profile")}
                    >
                        <img
                            src="https://ca.slack-edge.com/T0BFXMWMV-U08U5P1CMT8-66334e023a99-512"
                            alt="avatar"
                            className={variant === "profile" ? "profile-avatar active" : ""}
                        />
                    </div>

                    <div className="header-text">
                        {variant === "home" ? (
                            <>
                                <span className="home-hello">Hola Fernando 👋</span>
                                <span className="home-subtitle">¿Listo para pedalear hoy?</span>
                            </>
                        ) : (
                            <>
                                <span className="home-hello">Fernando Del Rio</span>
                                <span className="home-subtitle">Ponferrada, ES</span>
                            </>
                        )}
                    </div>

                </div>

                <div className="header-actions">

                    <button
                        className="settings-btn home-btn"
                        onClick={() => navigate("/home")}
                    >
                        <i
                            className={`fa-solid fa-house nav-home-icon ${variant === "home" ? "active" : ""}`}
                        />
                    </button>

                    <button className="settings-btn" onClick={handleLogout}>
                        <i className="fa-solid fa-power-off logout-icon"></i>
                    </button>

                </div>

            </div>
        </header>
    );
}
