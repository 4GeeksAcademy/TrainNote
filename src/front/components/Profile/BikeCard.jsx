import MaintenanceCard from "../Maintenance/MaintenanceCard";

const BikeCard = ({
  name,
  specs,
  km,
  image,
  active,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <article className={`bike-card ${active ? "bike-card--active" : ""}`}>

      {active && <span className="badge badge--active">Activa</span>}

      {/* HEADER */}
      <header className="bike-card-header">
        <button
          type="button"
          className="bike-card-image-btn"
          onClick={onViewDetails}
        >
          {image ? (
            <img src={image} alt={name} className="bike-card-image" />
          ) : (
            <div className="bike-card-image-placeholder">
              <span>Sin foto</span>
            </div>
          )}
        </button>
      </header>

      {/* BODY */}
      <div className="bike-card-body">
        <h3 className="bike-card-title">{name}</h3>

        {specs && (
          <p className="bike-card-specs">{specs}</p>
        )}
      </div>

      {/* MANTENIMIENTO */}
      <MaintenanceCard
        data={{ llantas: 100, frenos: 100, cadena: 100 }}
      />

      {/* FOOTER */}
      <footer className="bike-card-footer">
        <span className="bike-card-km">
          🚴 {km || 0} km registrados
        </span>

        <div className="bike-card-actions">
          <button
            type="button"
            className="ui-btn ui-btn--secondary"
            onClick={onEdit}
          >
            {active ? "📋 Detalles" : "✏️ Editar"}
          </button>

          <button
            type="button"
            className="ui-btn ui-btn--danger bike-card-delete-btn"
            onClick={onDelete}
          >
            🗑️
          </button>
        </div>
      </footer>

    </article>
  );
};

export default BikeCard;
