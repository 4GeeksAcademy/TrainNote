import { useState } from "react";
import { loginUser } from "../../services/authService";

export const useLogin = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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

        console.log("Login correcto");
        console.log(data);
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        handleLogin
    };
};