import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {

 const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false)

const handleLogin = async () => {

    setError("");

    const data = await loginUser(
        email,
        password
    );

    if (!data) {
        setError("Error de conexión");
        return;
    }

    if (!data.success) {
        setError(data.msg);
        return;
    }

    localStorage.setItem(
        "token",
        data.token
    );

    localStorage.setItem(
        "user",
        JSON.stringify(data.user)
    );

    navigate("/feed");

    console.log("Login correcto");
    console.log(data);
};

    return {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        error,
        handleLogin
    };
};