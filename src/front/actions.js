const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const actions = (store, dispatch) => {
    return {
        loadParentData: async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {

                const resp = await fetch(`${backendUrl}/api/parent-data`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    }
                });

                if (!resp.ok) throw new Error("Error cargando datos");
                const data = await resp.json();
                
                dispatch({ type: 'set_hijos', payload: data.hijos });
                dispatch({ type: 'set_autorizados', payload: data.autorizados });
            } catch (error) {
                console.error("Error en loadParentData:", error);
            }
        },

        addHijo: async (hijoData) => {
            const token = localStorage.getItem("token");
            try {
                const resp = await fetch(`${backendUrl}/api/hijos`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(hijoData)
                });
                if (resp.ok) {
                    const data = await resp.json();
                    dispatch({ type: 'add_hijo', payload: data.hijo });
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error al añadir hijo:", error);
                return false;
            }
        },

        deleteHijo: async (hijoId) => {
            const token = localStorage.getItem("token");
            try {
                const resp = await fetch(`${backendUrl}/api/hijos/${hijoId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if (resp.ok) {                    
                    dispatch({ type: 'delete_hijo', payload: hijoId });
                    
                    const respData = await fetch(`${backendUrl}/api/parent-data`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (respData.ok) {
                        const data = await respData.json();
                        dispatch({ type: 'set_autorizados', payload: data.autorizados });
                    }
                    return true;
                }
                
                const errorData = await resp.json();
                console.error("Respuesta del servidor:", errorData.msg);
                return false;
            } catch (error) {
                console.error("Error de red eliminando hijo:", error);
                return false;
            }
        },

        addAutorizado: async (authData) => {
            const token = localStorage.getItem("token");
            try {
                const resp = await fetch(`${backendUrl}/api/autorizados`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(authData)
                });
                if (resp.ok) {
                    const data = await resp.json();
                    dispatch({ type: 'add_autorizado', payload: data.autorizado });
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error al añadir autorizado:", error);
                return false;
            }
        },

        deleteAutorizado: async (authId) => {
            const token = localStorage.getItem("token");
            try {
                const resp = await fetch(`${backendUrl}/api/autorizados/${authId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if (resp.ok) {                    
                    dispatch({ type: 'delete_autorizado', payload: authId });
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error eliminando autorizado:", error);
                return false;
            }
        },

        deleteRutinaCompartida: async (asignacionId) => {
            const token = localStorage.getItem("token");
            try {
                const resp = await fetch(`${backendUrl}/api/cuidador/rutinas/${asignacionId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if (resp.ok) {
                    return true;
                }
                
                const errorData = await resp.json();
                console.error("Error del servidor:", errorData.msg);
                return false;
            } catch (error) {
                console.error("Error de red eliminando rutina compartida:", error);
                return false;
            }
        }
    };
};