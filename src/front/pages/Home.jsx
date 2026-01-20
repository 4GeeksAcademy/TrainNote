import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import "../styles/home.css";

import SettingsDropdown from "../components/Profile/SettingsDropdown";
import WeeklyKms from "../components/Home/WeeklyKms";
import StartRouteButton from "../components/Home/StartRouteButton";
import FeaturedRoutes from "../components/Home/FeaturedRoutes";
import FriendsActivity from "../components/Home/FriendsActivity";
import MaintenanceCard from "../components/Maintenance/MaintenanceCard";



const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }


    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Bienvenido a ATrail...</h2>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-content">

        <header className="home-header">
          <div
            className="home-left clickable"
            onClick={() => navigate("/home")}
          >
            <span className="home-icon">🏠</span>
            <span className="home-title">Inicio</span>
          </div>

          <div className="home-actions">
            <div
              className="user-avatar clickable"
              onClick={() => navigate("/profile")}
              role="button"
              tabIndex={0}
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="Perfil de usuario"
              />
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              ⏻
            </button>
          </div>
        </header>

        <main className="home-content">
          <WeeklyKms />
          <StartRouteButton className="ui-btn--cta" />
          <FeaturedRoutes />
          <FriendsActivity />
          <MaintenanceCard
            title="Mantenimiento"
            showTitle={true}
            showActionButton={false}
          />
          <StartRouteButton />
        </main>
      </div>
    </div>
  );
};

export default Home;
