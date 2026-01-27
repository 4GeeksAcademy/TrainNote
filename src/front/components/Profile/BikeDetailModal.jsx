import "../../styles/Profile/bikeDetailModal.css";

const BikeDetailModal = ({ bike, open, onClose }) => {
  if (!open || !bike) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bike-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{bike.name}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="bike-detail-content">
          {/* Imagen principal */}
          <div className="bike-image-container">
            <img src={bike.image_url} alt={bike.name} className="bike-main-image" />
            {bike.is_active && <span className="badge-active">Activa</span>}
          </div>

          {/* Información básica */}
          <div className="bike-info-section">
            <h3>Información General</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Modelo</span>
                <span className="info-value">
                  {bike.bike_model ? bike.bike_model.full_name : bike.model || "—"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Kilómetros totales</span>
                <span className="info-value">{bike.km_total} km</span>
              </div>
              {bike.bike_model && (
                <>
                  <div className="info-item">
                    <span className="info-label">Marca</span>
                    <span className="info-value">{bike.bike_model.brand}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Tipo</span>
                    <span className="info-value bike-type-badge">
                      {bike.bike_model.bike_type}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Especificaciones */}
          {bike.specs && (
            <div className="bike-info-section">
              <h3>Especificaciones</h3>
              <p className="specs-text">{bike.specs}</p>
            </div>
          )}

          {/* Componentes */}
          {bike.parts && bike.parts.length > 0 && (
            <div className="bike-info-section">
              <h3>Componentes ({bike.parts.length})</h3>
              <div className="parts-grid">
                {bike.parts.map((part, index) => (
                  <div key={part.id || index} className="part-card">
                    <div className="part-header">
                      <span className="part-number">{index + 1}</span>
                      <span className="part-name">{part.part_name || "Sin nombre"}</span>
                    </div>
                    <div className="part-details">
                      {part.brand && (
                        <div className="part-detail-item">
                          <span className="part-label">Marca:</span>
                          <span>{part.brand}</span>
                        </div>
                      )}
                      {part.model && (
                        <div className="part-detail-item">
                          <span className="part-label">Modelo:</span>
                          <span>{part.model}</span>
                        </div>
                      )}
                      {part.km_life > 0 && (
                        <div className="part-detail-item">
                          <span className="part-label">Vida útil:</span>
                          <span>{part.km_life} km</span>
                        </div>
                      )}
                      {part.km_current > 0 && (
                        <div className="part-wear">
                          <div className="wear-bar">
                            <div
                              className="wear-progress"
                              style={{
                                width: `${Math.min((part.km_current / part.km_life) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="wear-text">
                            {part.km_current} / {part.km_life} km
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vídeo */}
          {bike.video_url && (
            <div className="bike-info-section">
              <h3>Vídeo</h3>
              <a
                href={bike.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="video-link"
              >
                🎥 Ver vídeo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BikeDetailModal;
