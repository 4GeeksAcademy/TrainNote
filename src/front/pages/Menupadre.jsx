import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Cardhijo } from "../components/Cardhijo.jsx";
import { Carduser } from "../components/Carduser.jsx";
import { Cardautorizado } from "../components/Cardautorizado.jsx";
import { HeaderApp2 } from "../components/HeaderApp2.jsx";

export const Menupadre = () => {
  const { store, actions } = useGlobalReducer();
  const [activeTab, setActiveTab] = useState("hijos");

  useEffect(() => {
    actions.loadParentData();
  }, []);

  return (
    <div className="w-100 h-100 d-flex flex-column bg-white">
      <HeaderApp2 showBackButton={false} />

      <div className="p-3 d-flex flex-column flex-grow-1 overflow-hidden">
        <Carduser />
        
        <ul className="nav nav-pills nav-fill gap-2 p-1 bg-light rounded-pill my-3 shadow-sm" style={{ border: "1px solid #eee" }}>
          <li className="nav-item">
            <button 
              className={`nav-link rounded-pill fw-bold ${activeTab === "hijos" ? "active text-white" : "text-muted"}`}
              onClick={() => setActiveTab("hijos")}
              style={{ 
                  fontSize: "0.85rem", 
                  backgroundColor: activeTab === "hijos" ? "var(--color-primario)" : "transparent",
                  transition: "0.3s"
              }}
            >
              <i className="fas fa-baby me-2"></i>Mis Hijos
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link rounded-pill fw-bold ${activeTab === "autorizados" ? "active text-white" : "text-muted"}`}
              onClick={() => setActiveTab("autorizados")}
              style={{ 
                  fontSize: "0.85rem", 
                  backgroundColor: activeTab === "autorizados" ? "var(--color-primario)" : "transparent",
                  transition: "0.3s"
              }}
            >
              <i className="fas fa-user-shield me-2"></i>Autorizados
            </button>
          </li>
        </ul>

        <div className="flex-grow-1 overflow-auto px-1 mb-3">
          
          {activeTab === "hijos" && (
            <div className="row g-3 m-0">
              {store.hijos && store.hijos.length > 0 ? (
                store.hijos.map(hijo => (
                  <Cardhijo key={hijo.id} hijo={hijo} />
                ))
              ) : (
                <div className="text-center mt-5 text-muted">
                  <i className="fas fa-child fa-3x opacity-25 mb-3"></i>
                  <p className="small">No hay hijos registrados.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "autorizados" && (
            <div className="row g-3 m-0">
              {store.autorizados && store.autorizados.length > 0 ? (
                store.autorizados.map(auth => (
                  <Cardautorizado key={auth.id} autorizado={auth} />
                ))
              ) : (
                <div className="text-center mt-5 text-muted">
                  <i className="fas fa-user-lock fa-3x opacity-25 mb-3"></i>
                  <p className="small">No hay personas autorizadas.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto">
          {activeTab === "hijos" ? (
              <Link to="/addhijo" className="text-decoration-none">
                  <button className="btn text-white fw-bold shadow-sm w-100" style={{ backgroundColor: "var(--color-descanso)", borderRadius: "12px", padding: "12px" }}>
                      <i className="fas fa-plus me-2"></i>Añadir Hijo
                  </button>
              </Link>
          ) : (
              <Link to="/add-autorizado" className="text-decoration-none">
                  <button className="btn text-white fw-bold shadow-sm w-100" style={{ backgroundColor: "var(--color-descanso)", borderRadius: "12px", padding: "12px" }}>
                      <i className="fas fa-user-plus me-2"></i>Añadir Autorizado
                  </button>
              </Link>
          )}
        </div>
      </div>
    </div>
  );
};