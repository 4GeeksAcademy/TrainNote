import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

export const useRegister = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    

    const handleRegister = async () => {
        setError("");
        setSuccess(false);

        try {
            const data = await registerUser(email, password, username);
            
            if (data && data.user && data.user.id) {
                localStorage.setItem("userId", data.user.id);
            }
            
            if (data && data.token) {
                localStorage.setItem("token", data.token);
            }

            setSuccess(true);
            console.log("Registro correcto", data);
        } catch (err) {
            setError(err.message || "Error en el registro");
        }
    };

    useEffect(() => {
        if (success) {
            navigate('/data-profile');
        }
    }, [success, navigate]);

    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        error,
        success,
        handleRegister
    };
};