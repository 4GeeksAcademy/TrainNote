import React, { useState } from "react";
import logoApp from "../assets/Logo Baby Zzync 1.png";
import { Link, useNavigate } from "react-router-dom";
import Cloudinary from "../components/Cloudinary";
import GoogleInput from "../components/GoogleInput";

export const Registro = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "", nombre: "", apellidos: "",
    edad: "", direccionHogar: "", direccionTrabajo: "", prefijo: "+34",
    telefono: "", fotoPerfil: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefono") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUploaded = (url) => setFormData({ ...formData, fotoPerfil: url });

  const handleHogarSelect = (place) => {
    setFormData({ ...formData, direccionHogar: place.formatted_address });
  };

  const handleTrabajoSelect = (place) => {
    setFormData({ ...formData, direccionTrabajo: place.formatted_address });
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const showMatchError = formData.confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!formData.fotoPerfil) return;

    if (!passwordsMatch) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const dataToSend = {
      ...formData,
      telefonoCompleto: `${formData.prefijo} ${formData.telefono}`
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        navigate("/"); 
      } else {
        const data = await response.json();
        alert(data.msg || "Error al registrar la cuenta");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="w-100 p-4">
        <div className="text-center mb-3">
          <img src={logoApp} alt="Logo" style={{ width: "180px" }} />
        </div>
        
        <div className="mb-4 text-center">
          <Cloudinary onImageUploaded={handleImageUploaded} />
          {validated && !formData.fotoPerfil && (
            <small className="text-danger d-block mt-1">Campo Obligatorio</small>
          )}
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-envelope me-3 text-muted" style={{ width: "20px" }}></i>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control input-line" placeholder="CORREO ELECTRÓNICO" required />
            </div>
            {validated && !formData.email && <small className="text-danger ms-5">Campo Obligatorio</small>}
          </div>
          
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-lock me-3 text-muted" style={{ width: "20px" }}></i>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="form-control input-line" placeholder="CONTRASEÑA" required />
              <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'} ms-2`} onClick={() => setShowPassword(!showPassword)} style={{cursor:"pointer", color:"var(--color-descanso)"}}></i>
            </div>
            {validated && !formData.password && <small className="text-danger ms-5">Campo Obligatorio</small>}
          </div>
          
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-lock me-3 text-muted" style={{ width: "20px" }}></i>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                className="form-control input-line" 
                placeholder="CONFIRMAR CONTRASEÑA" 
                style={{ borderBottom: showMatchError ? "1px solid red" : "1px solid #ccc" }}
                required
              />
              <i className={`fas ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'} ms-2`} onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{cursor:"pointer", color:"var(--color-descanso)"}}></i>
            </div>
            {showMatchError && <small className="text-danger d-block mt-1" style={{ marginLeft: "38px" }}>Las contraseñas no coinciden</small>}
          </div>
          
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-id-card me-3 text-muted" style={{ width: "20px" }}></i>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control input-line" placeholder="NOMBRE" required />
            </div>
            {validated && !formData.nombre && <small className="text-danger ms-5">Campo Obligatorio</small>}
          </div>
          
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-users me-3 text-muted" style={{ width: "20px" }}></i>
              <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="form-control input-line" placeholder="APELLIDOS" required />
            </div>
            {validated && !formData.apellidos && <small className="text-danger ms-5">Campo Obligatorio</small>}
          </div>
          
          <div className="mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-calendar me-3 text-muted" style={{ width: "20px" }}></i>
              <input type="number" name="edad" value={formData.edad} onChange={handleChange} className="form-control input-line" placeholder="EDAD" required />
            </div>
            {validated && !formData.edad && <small className="text-danger ms-5">Campo Obligatorio</small>}
          </div>

          <GoogleInput
            icon="fas fa-home"
            placeholder="DIRECCIÓN DEL HOGAR"
            value={formData.direccionHogar}
            onPlaceSelected={handleHogarSelect}
            onChange={(e) => setFormData({ ...formData, direccionHogar: e.target.value })}
            required={true}
          />

          <GoogleInput
            icon="fas fa-building"
            placeholder="DIRECCIÓN DEL TRABAJO"
            value={formData.direccionTrabajo}
            onPlaceSelected={handleTrabajoSelect}
            onChange={(e) => setFormData({ ...formData, direccionTrabajo: e.target.value })}
            required={false}
          />

          <div className="mb-4">
            <div className="d-flex align-items-center">
              <i className="fas fa-phone me-3 text-muted" style={{ width: "20px" }}></i>
              <select name="prefijo" value={formData.prefijo} onChange={handleChange} className="form-control input-line me-2" style={{ maxWidth: "85px" }}>
                <option value="+34">🇪🇸 +34</option>
                <option value="+52">🇲🇽 +52</option>
                <option value="+1">🇺🇸 +1</option>
              </select>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="form-control input-line w-100" placeholder="TELÉFONO DE CONTACTO" required />
            </div>
            {validated && !formData.telefono && <small className="text-danger ms-5">Campo Obligatorio</small>}
          </div>
          
          <div className="mb-3 text-center">
            <Link to="/" className="small text-decoration-none fw-bold" style={{ color: "var(--color-descanso)" }}>¿Ya tienes una cuenta?</Link>
          </div>
          
          <button type="submit" className="btn w-100 py-2 mt-2 mb-4" style={{ backgroundColor: "var(--color-primario)", color: "white", borderRadius: "50px", border: "none" }}>Crear Cuenta</button>
        </form>
    </div>
  );
};