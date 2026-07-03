import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../../services/profileService";

export const useProfile = () => {
    const navigate = useNavigate();
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [profileImg, setProfileImg] = useState(null);
    const [description, setDescription] = useState("");
    
    
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleUpdateProfile = async () => {
        setError("");
        setLoading(true);

        const userId = localStorage.getItem("userId");

        try {
            const profileData = { firstName, lastName, birthDate, profileImg, description };
            const data = await updateProfile(userId, profileData);
            
            setSuccess(true);
            console.log("Perfil completado con éxito:", data);
            
            navigate("/"); 
        } catch (err) {
            setError(err.message || "Error al actualizar el perfil");
        } finally {
            setLoading(false);
        }
    };

    return {
        firstName, setFirstName,
        lastName, setLastName,
        birthDate, setBirthDate,
        profileImg, setProfileImg,
        description, setDescription,
        error,
        loading,
        success,
        handleUpdateProfile
    };
};