import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/home.css";

import StartRouteButton from "../components/Home/StartRouteButton";
import FeaturedRoutes from "../components/Home/FeaturedRoutes";
import Garage from "../components/Profile/Garage";


import { useFetchWithLoader } from "../hooks/useFetchWithLoader";

const Home = () => {
  const navigate = useNavigate();


  const fetchWithLoader = useFetchWithLoader();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);


  useEffect(() => {
    const loadData = async () => {
      await fetchWithLoader(
        `${import.meta.env.VITE_BACKEND_URL}/api/home-data`
      );
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home">
      <div className="home-content">
        


        <main className="home-content">
          <StartRouteButton className="ui-btn--cta" />
          <FeaturedRoutes />
          <div className="ui-panel">
            <Garage />
          </div>          
         </main>
      </div>
    </div>
  );
};

export default Home;
