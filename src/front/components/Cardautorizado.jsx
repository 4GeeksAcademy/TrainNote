import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Swal from 'sweetalert2';

export const Cardautorizado = ({ autorizado }) => {
  const { store, actions } = useGlobalReducer(); 

  const hijoVinculado = store.hijos?.find(h => h.id === autorizado.hijoId);

  const handleDelete = (e) => {
    e.stopPropagation();

    Swal.fire({
      title: '¿Eliminar?',
      text: `Se borrará la autorización de ${autorizado.nombre} permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-descanso)', 
      cancelButtonColor: '#c2c2c2',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      width: '400px', 
      customClass: {
        popup: 'my-custom-popup', 
        confirmButton: 'rounded-pill px-3 shadow-sm',
        cancelButton: 'rounded-pill px-3'
      }
    }).then(async (result) => { 
      if (result.isConfirmed) {        
       
        const success = await actions.deleteAutorizado(autorizado.id);

        if (success) {
          Swal.fire({
            title: 'Eliminado',
            text: 'Registro de autorizado borrado.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            width: '280px',
            customClass: { popup: 'my-custom-popup' }
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el registro del servidor.',
            icon: 'error'
          });
        }
      }
    });
  };

  return (
    <div className="col-12 mb-2">
      <div 
        className="card border-0 shadow-sm position-relative" 
        style={{ borderRadius: "15px", backgroundColor: "#fff", border: "1px solid #f0f0f0" }}
      >
        <button 
          onClick={handleDelete}
          className="btn btn-sm position-absolute" 
          style={{ top: "10px", right: "10px", color: "#c2c2c2", background: "transparent", border: "none", zIndex: 10 }}
        >
          <i className="fas fa-times" style={{ fontSize: "1rem" }}></i>
        </button>

        <div className="card-body d-flex align-items-center p-3">
          <div className="me-3 shadow-sm" style={{ width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid white" }}>
            <img 
              src={autorizado.fotoUrl || "https://via.placeholder.com/150"} 
              alt={autorizado.nombre} 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          
          <div className="flex-grow-1">
            <h6 className="mb-0 fw-bold" style={{ fontSize: "0.9rem", color: "#333" }}>
                {autorizado.nombre} {autorizado.apellidos}
            </h6>
            
            <p className="mb-1 text-primary fw-bold" style={{ fontSize: "0.7rem" }}>
              <i className="fas fa-child me-1"></i> 
              Recoge a: {hijoVinculado ? hijoVinculado.nombre : "Hijo no encontrado"}
            </p>

            <p className="mb-1 text-muted" style={{ fontSize: "0.7rem" }}>
              {autorizado.parentesco || "Autorizado"}
              {autorizado.esPermanente && <span className="ms-2 badge rounded-pill bg-success-subtle text-success border border-success-subtle" style={{fontSize: "0.6rem"}}>Permanente</span>}
            </p>
            
            <button 
              className="btn btn-sm p-0 d-flex align-items-center" 
              data-bs-toggle="modal" 
              data-bs-target={`#modalAuth-${autorizado.id}`}
              style={{ color: "var(--color-primario)", fontSize: "0.7rem", fontWeight: "600", border: "none", background: "transparent" }}
            >
              <i className="fas fa-info-circle me-1"></i> Ver detalles
            </button>
          </div>
        </div>

        <div className="modal fade" id={`modalAuth-${autorizado.id}`} tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content" style={{ borderRadius: "20px", border: "none" }}>
              <div className="modal-body text-center pt-4 pb-4 px-4">
                
                <img 
                  src={autorizado.fotoUrl || "https://via.placeholder.com/150"} 
                  alt={autorizado.nombre} 
                  className="shadow-sm mb-3"
                  style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid #f8f9fa" }}
                />
                
                <h5 className="fw-bold mb-0">{autorizado.nombre}</h5>
                <p className="text-muted small mb-3">{autorizado.apellidos}</p>
                
                <div className="text-start">
                    <div className="mb-2 border-bottom pb-1 bg-primary-subtle p-2 rounded-2">
                        <label className="text-primary d-block mb-0" style={{ fontSize: "0.65rem", fontWeight: "bold" }}>AUTORIZADO PARA RECOGER A:</label>
                        <span className="fw-bold" style={{ color: "#0d6efd", fontSize: "0.9rem" }}>
                          {hijoVinculado ? `${hijoVinculado.nombre} ${hijoVinculado.apellido}` : "Hijo no encontrado"}
                        </span>
                    </div>

                    <div className="mb-2 border-bottom pb-1">
                        <label className="text-muted d-block mb-0" style={{ fontSize: "0.65rem", fontWeight: "bold" }}>DNI / NIE</label>
                        <span style={{ color: "#444", fontSize: "0.85rem" }}>{autorizado.dni}</span>
                    </div>

                    <div className="mb-2 border-bottom pb-1">
                        <label className="text-muted d-block mb-0" style={{ fontSize: "0.65rem", fontWeight: "bold" }}>TELÉFONO</label>
                        <span style={{ color: "#444", fontSize: "0.85rem" }}>{autorizado.telefono}</span>
                    </div>

                    <div className="mb-2 border-bottom pb-1">
                        <label className="text-muted d-block mb-0" style={{ fontSize: "0.65rem", fontWeight: "bold" }}>PARENTESCO</label>
                        <span style={{ color: "#444", fontSize: "0.85rem" }}>{autorizado.parentesco || "Autorizado"}</span>
                    </div>

                    <div className="bg-light p-2 rounded-3 mt-3 shadow-sm border">
                        <label className="text-muted d-block text-center mb-1" style={{ fontSize: "0.6rem", fontWeight: "bold", textTransform: "uppercase" }}>Validez del Permiso</label>
                        
                        {autorizado.esPermanente ? (
                          <div className="text-center py-1">
                            <span className="badge rounded-pill bg-success text-white px-3" style={{ fontSize: "0.7rem" }}>
                              <i className="fas fa-infinity me-1"></i> ACCESO PERMANENTE
                            </span>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between px-2">
                              <div className="text-center">
                                  <small className="d-block text-muted" style={{fontSize: "0.55rem"}}>Desde</small>
                                  <small className="fw-bold text-success" style={{ fontSize: "0.75rem" }}>{autorizado.validoDesde}</small>
                              </div>
                              <div className="text-center border-start ps-2">
                                  <small className="d-block text-muted" style={{fontSize: "0.55rem"}}>Hasta</small>
                                  <small className="fw-bold text-danger" style={{ fontSize: "0.75rem" }}>{autorizado.validoHasta}</small>
                              </div>
                          </div>
                        )}
                    </div>
                </div>

                <button 
                    type="button" 
                    className="btn mt-4 w-100 text-white fw-bold shadow-sm" 
                    data-bs-dismiss="modal" 
                    style={{ backgroundColor: "var(--color-primario)", borderRadius: "12px", fontSize: "0.9rem" }}>
                  Cerrar Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};