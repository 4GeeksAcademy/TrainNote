import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";



export const Signup = () => {
     const { store, dispatch } = useGlobalReducer();

     const [first_name, setFirst_name] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [err, setErr] = useState(null);
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
          e.preventDefault();
          setErr(null);

          try {
               const backend = import.meta.env.VITE_BACKEND_URL;

            const body = {
                name: first_name,
                email: email,
                password: password

            };

            const resp = await fetch(`${backend}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await resp.json().catch(() => ({}));

            if (!resp.ok) {
                throw new Error(data.msg || "Error al registrar alumno");
            }

            dispatch({
                type: "REGISTER_STUDENT_SUCCESS",
                payload: data
            });

            setSuccess("Alumno registrado correctamente");

            setFirst_name("");
            setEmail("");
            setPassword("");   

        } catch (error) {
            setErr(error.message);
        }
    };

     return (

          <div className="container col-5 mt-5 mx-auto">

               <h1>Registro</h1>

               {err && <div className="alert alert-danger mt-3">{err}</div>}

               <form onSubmit={handleSubmit} className="mt-3">



                    <div className="mb-3 p-8">
                         <label htmlFor="first_name" className="form-label">Nombre</label>

                         <input
                              id="first_name"
                              type="text"
                              className="form-control"
                              value={first_name}
                              onChange={(e) => setFirst_name(e.target.value)}
                         />
                    </div>


                    <div className="mb-3 p-8">
                         <label htmlFor="email" className="form-label">Dirección de Email</label>

                         <input
                              id="email"
                              type="email"
                              className="form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                         />

                    </div>

                    <div className="mb-3">
                         <label htmlFor="password" className="form-label">Contraseña</label>
                         <input
                              id="password"
                              type="password"
                              className="form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                         />
                         <div id="emailHelp" className="form-text">No compartas tu contraseña.</div>
                    </div>

                    <button type="submit" className="btn btn-success">Registro</button>
               </form>

               

          </div>
     );


}
