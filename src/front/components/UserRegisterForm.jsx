import React, { useState } from "react";

export const UserRegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {


            const backendUrl = import.meta.env.VITE_BACKEND_URL + "/api/users";

            const response = await fetch(backendUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log("¡Datos enviados con éxito!", data);
                alert("¡Usuario registrado con éxito!");


                setFormData({
                    name: "",
                    email: "",
                    password: ""
                });


            } else {

                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
                alert(errorData.message || "Error al registrar el usuario. Revisa los datos.");
            }

        } catch (error) {

            console.error("Hubo un error de conexión:", error);
            alert("Error de conexión con el servidor.");
        }
    };

    return (
        <div className="card p-4 shadow-sm">
            <h3 className="text-center mb-3">Crear cuenta de Usuario</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success w-100 mt-3">
                    Registrarme
                </button>
            </form>
        </div>
    );
};