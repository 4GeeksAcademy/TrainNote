import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import portada from "../assets/img/portada.png";

export const IndividualTodoViewStudent = () => {


    const params = useParams();

    const [todo, setTodo] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        getTodo();
    }, [params.id]);

    const getTodo = async () => {

        setErr(null);

        try {

            const backend = import.meta.env.VITE_BACKEND_URL;

            const resp = await fetch(`${backend}/todos/${params.id}`);

            const data = await resp.json().catch(() => ({}));

            if (!resp.ok) {
                throw new Error("Error al cargar tarea");
            }

            setTodo(data);

        } catch (error) {
            setErr(error.message);
        }
    };

    if (err) {
        return <div className="container mt-5 alert alert-danger">{err}</div>;
    }

    if (!todo) {
        return <div className="container mt-5">Cargando tarea...</div>;
    }

    return (

        <div className="container mt-1">



            <div className="m-0 p-0">
                <img
                    src={portada}
                    className="img-fluid w-100 rounded"
                    alt="cover"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                />
            </div>


            <div className="text-center col-8 mx-auto">

                <h2 className="mb-4">
                    Título de tarea: {todo.title}
                </h2>

                <hr />

                <h5>Instrucciones de tarea:</h5>
                <p className="mt-3">
                    {todo.content}
                </p>

                <Link to="/todos" className="btn btn-success mt-4 mb-3">
                    Volver a todas las tareas
                </Link>

            </div>

        </div>
    );
}
