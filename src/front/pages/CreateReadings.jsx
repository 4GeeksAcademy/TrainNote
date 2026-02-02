import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CreateReadings = () => {

    const { store, dispatch } = useGlobalReducer();

    const params = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [group, setGroup] = useState("");
    const [teacher, setTeacher] = useState("");   
    const [err, setErr] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (params.groupId) {
            setGroup(params.groupId);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr(null);
        setSuccess(null);

        try {

            const backend = import.meta.env.VITE_BACKEND_URL;

            const body = {
                title: title,
                content: content,
                teacher_id: teacher,   
                group_id: group
            };

            const resp = await fetch(`${backend}/readings/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await resp.json().catch(() => ({}));

            if (!resp.ok) {
                throw new Error(data.msg || "Error al crear lectura");
            }

            dispatch({
                type: "CREATE_READING_SUCCESS",
                payload: data
            });

            setSuccess("Lectura creada correctamente");

            setTitle("");
            setContent("");
            setTeacher("");   

        } catch (error) {
            setErr(error.message);
        }
    };

    return (

        <div className="container col-6 mt-5 mx-auto">

            <h1>Crear lectura</h1>

            {err && <div className="alert alert-danger mt-3">{err}</div>}

            {success && <div className="alert alert-success mt-3">{success}</div>}

            <form onSubmit={handleSubmit} className="mt-4">

               
                <div className="mb-3">
                    <label className="form-label">Teacher ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={teacher}
                        onChange={(e) => setTeacher(e.target.value)}
                    />
                </div>

                
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

              
                <div className="mb-3">
                    <label className="form-label">Contenido</label>
                    <textarea
                        className="form-control"
                        rows="5"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>

               
                <div className="mb-3">
                    <label className="form-label">Grupo ID</label>
                    <input
                        type="text"
                        className="form-control"
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-success">
                    Crear lectura
                </button>

                <Link to="/" className="btn btn-secondary ms-3">
                    Volver
                </Link>

            </form>

        </div>
    );
};
