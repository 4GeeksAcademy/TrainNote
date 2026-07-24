import React, { useState, useEffect } from "react";

export const AvatarCard = ({ user, tempAvatar, onImageSelect }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const defaultAthleteAvatar = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop";

  useEffect(() => {
    const rawImage = 
      tempAvatar || 
      user?.urlFoto || 
      user?.url_foto || 
      user?.avatar_url || 
      user?.imagen || 
      "";

    const isValidImage = 
      rawImage && 
      rawImage.trim() !== "" && 
      rawImage !== "default.png" && 
      !rawImage.endsWith("/default.png");

    setPreview(isValidImage ? rawImage : defaultAthleteAvatar);
  }, [tempAvatar, user]);

  const localData = JSON.parse(localStorage.getItem("tn_user_data") || "{}");
  const userEmail = 
    user?.email || user?.correo || user?.Email || user?.Correo || 
    localData?.email || localData?.correo || "No disponible";

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trainnote_preset");

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.secure_url) {
        setPreview(data.secure_url);
        onImageSelect(data.secure_url);
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#1a1a1a]/65 backdrop-blur-md border border-white/10 p-4 sm:p-5 rounded-xl flex flex-col items-center text-center space-y-3 shadow-xl h-full justify-between">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-[#ff6b00]/40 shadow-[0_0_15px_rgba(255,107,0,0.2)] mx-auto">
        <img
          src={preview}
          alt="Avatar de perfil"
          className="w-full h-full object-cover"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] font-mono text-[#ff6b00]">
            Subiendo...
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-bold text-white uppercase">{user?.Nombre || user?.nombre || "Atleta"}</h3>
        <p className="text-[10px] font-mono text-[#ff6b00]">{user?.Objetivo || user?.objetivo || "Rendimiento Atlético"}</p>
      </div>

      <div className="w-full pt-1">
        <label className="w-full block bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-extrabold font-mono text-[11px] uppercase py-2.5 px-3 rounded-lg cursor-pointer transition-all text-center shadow-[0_0_10px_rgba(255,107,0,0.3)]">
          {uploading ? "Procesando..." : "Cambiar Imagen"}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      <div className="w-full text-left pt-2 border-t border-white/5 space-y-1">
        <span className="text-[10px] font-mono text-[#e2bfb0]/70 uppercase block">Correo Electrónico</span>
        <div className="w-full bg-black/50 p-2.5 rounded-lg border border-white/10 text-white text-xs font-mono truncate">
          {userEmail}
        </div>
      </div>
    </div>
  );
};