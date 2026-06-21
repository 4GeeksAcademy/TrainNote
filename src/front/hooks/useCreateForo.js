import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createForo } from "../../services/createForoService"; 

export const useCreateForo = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [img, setImg] = useState(null);
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreateForo = async (e) => {
    if (e) e.preventDefault();
    
    setError("");
    setSuccess(false);
    
    if (!title.trim()) {
      setError("El título del foro es obligatorio.");
      return;
    }

    setLoading(true);

    try {
      const foroData = { 
        title, 
        img,
        description 
      };
      
      const data = await createForo(foroData);
      
      setSuccess(true);
      return data;
      
      setTitle("");
      setImg("");
      setDescription("");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError(err.message || "Ocurrió un error al intentar crear el foro.");
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    img,
    setImg,
    description,
    setDescription,
    error,
    loading,
    success,
    handleCreateForo
  };
};