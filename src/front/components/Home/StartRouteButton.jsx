import { useNavigate } from "react-router-dom";

export default function StartRouteButton({ className = "" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/route-registration");
  };

  return (
    <button
      type="button"
      className={`ui-btn ui-btn--primary ui-btn--cta ${className}`}
      onClick={handleClick}
    >
      ▶ Iniciar ruta
    </button>
  );
}