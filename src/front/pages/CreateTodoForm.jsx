import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";






export const CreateTodoForm = () => {



  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [groupId, setGroupId] = useState("");
  const [description, setDescription] = useState("");

  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGroups = async () => {

      try {
        setError(null);


        const backend = import.meta.env.VITE_BACKEND_URL;
        const resp = await fetch(`${backend}/groups`);

        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.msg || "Error cargando groups");

        setGroups(data.groups ?? data);

      }
      catch (e) {
        setError(e.message);
      }
    };
    loadGroups();

  }, []);

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!title || !dueDate || !groupId) {
      setError("Título, fecha y grupo son obligatorios");
      return;
    }

    try {

      setError(null);

      const backend = import.meta.env.VITE_BACKEND_URL;

      const payload = {
        title,
        due_date: dueDate,
        group_id: Number(groupId),
        description
      };


      const resp = await fetch(`${backend}/todo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.msg || "Error creando tarea");

      setTitle("");
      setDueDate("");
      setGroupId("");
      setDescription("");

    } catch (e) {

      setError(e.message);
    }

  }


  return (

    <div className="container text-center">
      <div className="row">
        <div className="col-3 vh-100 text-start" style={{ backgroundColor: "#e9e9e9" }}>

          <h5 className=" text-black p-4 text-start">  Bienvenido </h5>
        </div>

        <div className="col-9 vh-100 d-flex flex-column p-0  "  >

          <div className=" text-white p-4 text-start" style={{ backgroundColor: "#49BBBD" }}>

            <h3> Generador de tareas </h3>
            <h6 className="fw-light"> Curso: Desarrollo Web </h6>
          </div>



          <div className="p-3 flex-grow-1  " style={{ backgroundColor: "#9DCCFF" }}>

            <div className="mx-auto col-11">

              <div className="text-start mt-3 mb-4">

                <h5>Crear tarea</h5>
                <p>En la siguiente sección podrás crear una nueva tarea. Recordá asignarla al
                  grupo correspondiente y definir la fecha de finalización. Si necesitás adjuntar
                  un archivo, hacé clic en el botón Archivo y agregalo a la descripción de la consigna.</p>
              </div>

              <form className="text-start bg-body rounded-4 p-4  " onSubmit={handleSubmit}>
                <fieldset>

                  <div className="mb-5 ">
                    <label htmlFor="exampleInput" className="form-label ">Título de entrega</label>
                    <input type="text" className="form-control " id="exampleInput" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="fecha" className="form-label">Selecciona una fecha:</label>
                    <input type="date" className="form-control" id="fecha" name="fecha" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  </div>


                  <div className="mb-5">
                    <label htmlFor="grupo" className="form-label">Grupos:</label>
                    <select className="form-select" aria-label="Default select example" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                      <option value="">Seleccionar el grupo</option>

                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>




                      ))}

                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Agregar descripción de tarea</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>




                  <div class="mb-3">
                    <label htmlFor="formFile" className="form-label">Default file input example</label>
                    <input className="form-control" type="file" id="formFile" />
                  </div>



                </fieldset>
              </form>

              <button type="submit" className="btn text-white mt-3 " style={{ backgroundColor: "#49BBBD" }}> Subir </button>




            </div>

          </div>

        </div>


      </div>


    </div>

  )

}