export default function RouteRegistrationBottomNav({ onStart }) {
  return (
    <div className="rr-bottom">
      <div className="rr-bottom-nav">
        <button type="button" className="rr-nav-item">
          EXPLORAR
        </button>
        <button type="button" className="rr-nav-item">
          RUTAS
        </button>

        <button type="button" className="rr-fab" onClick={onStart} aria-label="Iniciar registro">
          
        </button>

        <button type="button" className="rr-nav-item">
          TALLER
        </button>
        <button type="button" className="rr-nav-item">
          PERFIL
        </button>
      </div>
    </div>
  );
}
