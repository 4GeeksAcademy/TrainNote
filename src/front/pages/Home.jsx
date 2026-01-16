import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <header className="home-header">
        <h1>Inicio</h1>
        <div className="settings-wrapper">
          <SettingsDropdown onLogout={handleLogout} />
        </div>
      </header>

      <main className="home-content">
        <WeeklyKms />
        <StartRouteButton />
        <FeaturedRoutes />
        <FriendsActivity />
        <MaintenanceCard title="Mantenimiento" showTitle={true} showActionButton={false} />
        <StartRouteButton />
      </main>
    </div>
  );
};

export default Home;
