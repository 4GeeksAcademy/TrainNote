import React, { useState } from "react";
import { UserRegisterForm } from "../components/UserRegisterForm";
import { CompanyRegisterForm } from "../components/CompanyRegisterForm";

export const Register = () => {
    // Estado para controlar qué formulario se muestra (true = Usuario, false = Empresa)
    const [isUserView, setIsUserView] = useState(true);

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h1 className="mb-4">Registro en 4tickets</h1>
                
                {/* Botones para alternar la vista */}
                <div className="btn-group" role="group">
                    <button 
                        type="button" 
                        className={`btn ${isUserView ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setIsUserView(true)}
                    >
                        Soy Usuario
                    </button>
                    <button 
                        type="button" 
                        className={`btn ${!isUserView ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setIsUserView(false)}
                    >
                        Soy Empresa
                    </button>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    {/* Renderizado condicional: si isUserView es true, muestra UserRegisterForm, si no, CompanyRegisterForm */}
                    {isUserView ? <UserRegisterForm /> : <CompanyRegisterForm />}
                </div>
            </div>
        </div>
    );
};