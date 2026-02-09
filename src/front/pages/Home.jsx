import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/home.css";

import StartRouteButton from "../components/Home/StartRouteButton";
import FeaturedRoutes from "../components/Home/FeaturedRoutes";
import Garage from "../components/Profile/Garage";


import { useFetchWithLoader } from "../hooks/useFetchWithLoader";
import { session } from "../services/session";
import { useUser } from "../context/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const fetchWithLoader = useFetchWithLoader();




  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const token = session.getToken();
      if (!token) {
        clearUser();
        navigate("/login", { replace: true });
        return;
      }

      try {
        const resp = await fetchWithLoader(
          `${import.meta.env.VITE_BACKEND_URL}/api/home`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (cancelled) return;

        if (resp.status === 401) {
          clearUser();
          navigate("/login", { replace: true });
          return;
        }

        if (!resp.ok) return;
      } catch (error) {
        if (!cancelled) {
          console.error("Error loading home data:", error);
        }
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [clearUser, fetchWithLoader, navigate]);


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
