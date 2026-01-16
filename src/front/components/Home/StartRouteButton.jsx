import { useNavigate } from "react-router-dom";

export default function StartRouteButton({ className = "" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/route-registration");
  };

  return (
    <button
      type="button"
      className={`start-route-btn ${className}`}
      onClick={handleClick}
    >
      ▶ Registrar ruta
    </button>
  );
}
