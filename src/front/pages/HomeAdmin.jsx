import { useEffect, useMemo, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

useEffect(() => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");
    if (!t || r !== "ADMIN") navigate("/login");
}, [navigate]);

export const HomeAdmin = () => {
    const { store } = useGlobalReducer();
    const role = store.role || localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const backend = import.meta.env.VITE_BACKEND_URL;

    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState("");

    const [loadingGroups, setLoadingGroups] = useState(false);
    const [groupsError, setGroupsError] = useState(null);

    const [actionMsg, setActionMsg] = useState(null);
    const [actionErr, setActionErr] = useState(null);

    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [groupTeacherId, setGroupTeacherId] = useState("");

    const [teacherId, setTeacherId] = useState("");

    const [studentId, setStudentId] = useState("");
    const [groupStudents, setGroupStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const authHeaders = useMemo(() => {
        const h = { "Content-Type": "application/json" };
        if (token) h.Authorization = `Bearer ${token}`;
        return h;
    }, [token]);

    const clearAlerts = () => {
        setActionMsg(null);
        setActionErr(null);
    };

    const loadGroups = async () => {
        clearAlerts();
        setGroupsError(null);
        setLoadingGroups(true);

        try {
            const resp = await fetch(`${backend}/groups`, {
                method: "GET",
                headers: authHeaders,
            });

            const data = await resp.json().catch(() => null);

            if (!resp.ok) {
                throw new Error(data?.msg || "Error obteniendo grupos");
            }

            setGroups(Array.isArray(data) ? data : []);
            if (!selectedGroupId && Array.isArray(data) && data.length > 0) {
                setSelectedGroupId(String(data[0].id));
            }
        } catch (e) {
            setGroupsError(e.message);
        } finally {
            setLoadingGroups(false);
        }
    };

    const createGroup = async (e) => {
        e.preventDefault();
        clearAlerts();

        try {
            const payload = {
                name: groupName.trim(),
                teacher_id: Number(groupTeacherId),
            };

            if (groupDescription && groupDescription.trim() !== "") {
                payload.description = groupDescription.trim();
            }

            const resp = await fetch(`${backend}/groups`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify(payload),
            });

            const data = await resp.json().catch(() => null);

            if (!resp.ok) {
                throw new Error(data?.msg || "Error creando grupo");
            }

            setActionMsg(`✅ ${data?.msg || "Grupo creado"} (id: ${data?.group_id})`);
            setGroupName("");
            setGroupDescription("");
            setGroupTeacherId("");

            await loadGroups();
            if (data?.group_id) setSelectedGroupId(String(data.group_id));
        } catch (e2) {
            setActionErr(`❌ ${e2.message}`);
        }
    };

    const assignTeacherToGroup = async () => {
        clearAlerts();

        if (!selectedGroupId) {
            setActionErr("❌ Elegí un grupo primero");
            return;
        }
        if (!teacherId) {
            setActionErr("❌ Ingresá teacher_id");
            return;
        }

        try {
            const resp = await fetch(`${backend}/groups/${selectedGroupId}/teacher`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify({ teacher_id: Number(teacherId) }),
            });

            const data = await resp.json().catch(() => null);

            if (!resp.ok) {
                throw new Error(data?.msg || "Error asignando profesor");
            }

            setActionMsg(`✅ ${data?.msg || "Profesor asignado"}`);
            setTeacherId("");

            // refrescar listado de grupos
            await loadGroups();
        } catch (e) {
            setActionErr(`❌ ${e.message}`);
        }
    };

    const loadGroupStudents = async (gid) => {
        clearAlerts();

        if (!gid) {
            setGroupStudents([]);
            return;
        }

        setLoadingStudents(true);
        try {
            const resp = await fetch(`${backend}/groups/${gid}/students`, {
                method: "GET",
                headers: authHeaders,
            });

            const data = await resp.json().catch(() => null);

            if (!resp.ok) {
                throw new Error(data?.msg || "Error obteniendo estudiantes del grupo");
            }

            setGroupStudents(Array.isArray(data) ? data : []);
        } catch (e) {
            setActionErr(`❌ ${e.message}`);
            setGroupStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    const addStudentToGroup = async () => {
        clearAlerts();

        if (!selectedGroupId) {
            setActionErr("❌ Elegí un grupo primero");
            return;
        }
        if (!studentId) {
            setActionErr("❌ Ingresá user_id del estudiante");
            return;
        }

        try {
            const resp = await fetch(`${backend}/groups/${selectedGroupId}/students`, {
                method: "POST",
                headers: authHeaders,
                body: JSON.stringify({ user_id: Number(studentId) }),
            });

            const data = await resp.json().catch(() => null);

            if (!resp.ok) {
                throw new Error(data?.msg || "Error agregando estudiante");
            }

            setActionMsg(`✅ ${data?.msg || "Estudiante agregado"}`);
            setStudentId("");

            await loadGroupStudents(selectedGroupId);
        } catch (e) {
            setActionErr(`❌ ${e.message}`);
        }
    };

    const removeStudentFromGroup = async (userId) => {
        clearAlerts();

        if (!selectedGroupId) {
            setActionErr("❌ Elegí un grupo primero");
            return;
        }

        try {
            const resp = await fetch(
                `${backend}/groups/${selectedGroupId}/students/${userId}`,
                {
                    method: "DELETE",
                    headers: authHeaders,
                }
            );

            const data = await resp.json().catch(() => null);

            if (!resp.ok) {
                throw new Error(data?.msg || "Error removiendo estudiante");
            }

            setActionMsg(`✅ ${data?.msg || "Estudiante removido"}`);
            await loadGroupStudents(selectedGroupId);
        } catch (e) {
            setActionErr(`❌ ${e.message}`);
        }
    };

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedGroupId) loadGroupStudents(selectedGroupId);
        else setGroupStudents([]);
    }, [selectedGroupId]);

    return (
        <div className="container mt-4">
            <h1>Home Admin</h1>
            <p>
                Rol actual: <strong>{role}</strong>
            </p>

            {!token && (
                <div className="alert alert-warning">
                    No hay token en localStorage. Iniciá sesión primero.
                </div>
            )}

            {actionMsg && <div className="alert alert-success">{actionMsg}</div>}
            {actionErr && <div className="alert alert-danger">{actionErr}</div>}
            {groupsError && <div className="alert alert-danger">{groupsError}</div>}

            <hr />

            <div className="d-flex align-items-center gap-2 mb-3">
                <button className="btn btn-outline-primary" onClick={loadGroups}>
                    {loadingGroups ? "Cargando..." : "Refrescar grupos"}
                </button>

                <div style={{ minWidth: 320 }}>
                    <label className="form-label mb-1">Grupo seleccionado</label>
                    <select
                        className="form-select"
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                    >
                        {groups.length === 0 && <option value="">(sin grupos)</option>}
                        {groups.map((g) => (
                            <option key={g.id} value={String(g.id)}>
                                #{g.id} — {g.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="card p-3 mb-4">
                <h4 className="mb-3">Crear grupo</h4>

                <form onSubmit={createGroup}>
                    <div className="mb-2">
                        <label className="form-label">Nombre</label>
                        <input
                            className="form-control"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Ej: Grupo React"
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Descripción (opcional)</label>
                        <input
                            className="form-control"
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            placeholder="Ej: Grupo de práctica"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">teacher_id</label>
                        <input
                            className="form-control"
                            value={groupTeacherId}
                            onChange={(e) => setGroupTeacherId(e.target.value)}
                            placeholder="Ej: 1"
                            required
                        />
                    </div>

                    <button className="btn btn-success" type="submit">
                        Crear grupo
                    </button>
                </form>
            </div>


            <div className="card p-3 mb-4">
                <h4 className="mb-3">Asignar profesor a grupo</h4>

                <div className="row g-2 align-items-end">
                    <div className="col-md-6">
                        <label className="form-label">teacher_id</label>
                        <input
                            className="form-control"
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                            placeholder="Ej: 3"
                        />
                    </div>

                    <div className="col-md-6">
                        <button
                            className="btn btn-primary w-100"
                            type="button"
                            onClick={assignTeacherToGroup}
                        >
                            Asignar profesor al grupo seleccionado
                        </button>
                    </div>
                </div>
            </div>

            <div className="card p-3 mb-4">
                <h4 className="mb-3">Estudiantes del grupo</h4>

                <div className="row g-2 align-items-end mb-3">
                    <div className="col-md-6">
                        <label className="form-label">student user_id</label>
                        <input
                            className="form-control"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="Ej: 10"
                        />
                    </div>

                    <div className="col-md-6">
                        <button
                            className="btn btn-dark w-100"
                            type="button"
                            onClick={addStudentToGroup}
                        >
                            Agregar estudiante al grupo seleccionado
                        </button>
                    </div>
                </div>

                {loadingStudents ? (
                    <p>Cargando estudiantes...</p>
                ) : groupStudents.length === 0 ? (
                    <p className="text-muted">No hay estudiantes en este grupo.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-sm align-middle">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupStudents.map((s) => (
                                    <tr key={s.user_id}>
                                        <td>{s.user_id}</td>
                                        <td>{s.name}</td>
                                        <td>{s.email}</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeStudentFromGroup(s.user_id)}
                                                type="button"
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <hr />

            <h6 className="text-muted">Acciones Admin (resumen)</h6>
            <ul className="text-muted">
                <li>Crear grupos</li>
                <li>Asignar profesor a un grupo</li>
                <li>Agregar/remover estudiantes de un grupo</li>
            </ul>
        </div>
    );
};
