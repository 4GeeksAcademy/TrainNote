export const initialStore = () => {
  return {
    hijos: [],
    autorizados: [],
    user: JSON.parse(localStorage.getItem("user")) || null
  };
};

export default function storeReducer(store, action) {
  switch (action.type) {
    case 'set_hijos':
      return { ...store, hijos: action.payload };

    case 'add_hijo':
      return { ...store, hijos: [...store.hijos, action.payload] };

    case 'delete_hijo':
      return { ...store, hijos: store.hijos.filter(hijo => hijo.id !== action.payload) };

    case 'set_autorizados':
      return { ...store, autorizados: action.payload };

    case 'add_autorizado':
      return { ...store, autorizados: [...store.autorizados, action.payload] };

    case 'delete_autorizado':
      return { ...store, autorizados: store.autorizados.filter(auth => auth.id !== action.payload) };

    case 'set_user':
      return { ...store, user: action.payload };

    case 'logout':
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.clear(); 
      return {
        ...store,
        user: null,
        hijos: [],
        autorizados: []
      };

    default:
      return store;
  }
}