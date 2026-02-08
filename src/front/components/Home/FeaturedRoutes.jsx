import "../../styles/featuredRoutes.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRoutes } from "../../services/routesStorage.js";

const genericImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
  "https://images.unsplash.com/photo-1502920514313-52581002a659",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  "https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7"
];


const FeaturedRoutes = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const saved = getRoutes();
    console.log("ROUTES ===>", saved);
    setRoutes(saved.slice(0, 5)); // se muestran las 5 rutas destacadas
  }, []);

  return (
    <section className="featured-routes home-section ui-panel">
      <div className="featured-header">
        <h2 className="ui-subtitle">Rutas destacadas</h2>

        <button
          className="ui-btn ui-btn--secondary"
          onClick={() => navigate("/saved-routes")}
        >
          Ver todas
        </button>
      </div>

      <div className="featured-list">
        {routes.map((route, index) => (
          <article key={route.id} className="route-card clickable" onClick={() => navigate(`/saved-routes/${route.id}`)}>
            <img
              src={route.image || genericImages[index % genericImages.length]}
              alt={route.name}
            />


            <div className="route-info">
              <div className="route-tags">
                <span className="tag">{route.terrain}</span>
              </div>

              <h3>{route.name}</h3>

              <div className="route-stats">
                <span>{route.distance_km.toFixed(1)} km</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedRoutes;