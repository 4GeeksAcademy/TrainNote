export const initialStore=()=>{
  return{
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    user: null,
    role: null,
    isAuthenticated: false,
    Readings: [],
    Students :[]
  }
}


export default function storeReducer(store, action = {}) {
  switch(action.type){

    case "REGISTER_STAFF_SUCCESS":
      return {
        ...store,
        user: action.payload.user,
        role: action.payload.role,
        isAuthenticated: true,
        message: "Staff registrado correctamente"
      };

    case "LOGOUT":
      return {
        ...store,
        user: null,
        role: null,
        isAuthenticated: false
      };

    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    case "CREATE_READING_SUCCESS":
  return {
    ...store,
    readings: [...store.readings, action.payload],
    message: "Lectura creada correctamente"
  };

  case "REGISTER_STUDENTS_SUCCESS":
  return {
    ...store,
    students: [...store.students, action.payload],
    message: "Alumno registrado correctamente"
  };

    default:
      throw Error('Unknown action.');
  }    
}
