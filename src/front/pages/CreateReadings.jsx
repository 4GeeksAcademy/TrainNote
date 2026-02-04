import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const CreateReadings = () => {

    const { store, dispatch } = useGlobalReducer();
    const params = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [group, setGroup] = useState("");
    const [teacher, setTeacher] = useState("");
    const [err, setErr] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (params.groupId) {
            setGroup(params.groupId);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setErr(null);
        setSuccess(null);
        setLoading(true);

        try {
            const backend = import.meta.env.VITE_BACKEND_URL;

            const body = {
                title,
                content,
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

            setSuccess("Lectura creada con éxito");

            setTitle("");
            setContent("");
            setTeacher("");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            setErr(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid text-center">
            <div className="row">

                <div className="col-3 vh-100 text-start" style={{ backgroundColor: "#e9e9e9" }}>
                    <h5 className="text-black p-4 text-start">
                        Bienvenido, Profesor Jose
                    </h5>
                </div>

                <div className="col-9 vh-100 d-flex flex-column p-0">

                    <div className="text-white p-4 text-start" style={{ backgroundColor: "#49BBBD" }}>
                        <h3>Generador de lecturas</h3>
                        <h6 className="fw-light">Curso: Desarrollo Web</h6>
                    </div>

                    <div className="p-3 flex-grow-1" style={{ backgroundColor: "#9DCCFF" }}>
                        <div className="mx-auto col-11">

                            <div className="text-start mt-3 mb-4">
                                <h5>Crear lecturas</h5>
                                <p>
                                    En la siguiente sección podrás crear una nueva lectura.
                                </p>
                            </div>

                            <form className="text-start bg-body rounded-4 p-4" onSubmit={handleSubmit}>

                                {success && (
                                    <div className="alert alert-success mb-3">
                                        {success}
                                    </div>
                                )}

                                {err && (
                                    <div className="alert alert-danger mb-3">
                                        {err}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">Profesor que asigna:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={teacher}
                                        onChange={(e) => setTeacher(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Grupo Asignado:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={group}
                                        onChange={(e) => setGroup(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Título de la lectura:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Instrucciones para el alumno:</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-4 m-auto">

                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            disabled={loading}
                                        >
                                            {loading ? "Creando..." : "Crear lectura"}
                                        </button>

                                        <Link to="/" className="btn btn-secondary ms-3">
                                            Volver
                                        </Link>

                                    </div>
                                </div>

                            </form>

                        </div>
                    </div>

                </div>
            </div>
        </div>
        
    );
};
