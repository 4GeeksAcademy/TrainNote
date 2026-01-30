import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function RouteRegistrationBottomNav({
  onStart,
  isRecording = false,

  // NUEVO: si viene, el FAB navega a esa ruta (en vez de ejecutar onStart)
  fabTo = null,

  // Opcionales para afinar accesibilidad/UX desde cada página
  fabLabel,
  fabTitle,
  fabIcon,
}) {
  const navigate = useNavigate();

  const computed = useMemo(() => {
    const defaultLabel = isRecording ? "Detener registro" : "Iniciar";
    const defaultTitle = isRecording ? "Stop" : "Start";
    const defaultIcon = isRecording ? "■" : "▶";

    return {
      label: fabLabel ?? defaultLabel,
      title: fabTitle ?? defaultTitle,
      icon: fabIcon ?? defaultIcon,
    };
  }, [fabIcon, fabLabel, fabTitle, isRecording]);

  const handleFabClick = () => {
    if (fabTo) return navigate(fabTo);
    if (typeof onStart === "function") return onStart();
  };

  return (
    <div className="rr-bottom">
      <div className="rr-bottom-nav">
        <button
          type="button"
          className="rr-nav-item"
          onClick={() => navigate("/explore")}
        >
          EXPLORAR
        </button>

        <button
          type="button"
          className="rr-nav-item"
          onClick={() => navigate("/saved-routes")}
        >
          RUTAS
        </button>

        <button
          type="button"
          className="rr-fab"
          onClick={handleFabClick}
          aria-label={computed.label}
          title={computed.title}
        >
          {computed.icon}
        </button>

        <button
          type="button"
          className="rr-nav-item"
          onClick={() => navigate("/taller")}
        >
          TALLER
        </button>

        <button
          type="button"
          className="rr-nav-item"
          onClick={() => navigate("/profile")}
        >
          PERFIL
        </button>
      </div>
    </div>
  );
}
