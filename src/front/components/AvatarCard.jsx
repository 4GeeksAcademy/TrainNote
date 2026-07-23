import React, { useState } from "react";

export const AvatarCard = ({ user, onUpdateAvatar }) => {
  const [uploading, setUploading] = useState(false);

  // Declaramos userEmail al inicio para evitar errores de inicialización
  const localData = JSON.parse(localStorage.getItem("tn_user_data") || "{}");
  const userEmail = 
    user?.email || 
    user?.correo || 
    user?.Email || 
    user?.Correo || 
    localData?.email || 
    localData?.correo || 
    localData?.Email || 
    localData?.Correo || 
    "No disponible";

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "trainnote_preset");

    try {
      const cloudName = "tu_api_key_aqui";
      formData.append("upload_preset", "trainnote_preset");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.secure_url) {
        onUpdateAvatar(data.secure_url);
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  const defaultAthleteAvatar = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop";

  return (
    <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-xl">
      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#ff6b00]/40 shadow-[0_0_20px_rgba(255,107,0,0.2)]">
        <img
          src={user?.avatar_url || user?.imagen || defaultAthleteAvatar}
          alt="Avatar de perfil"
          className="w-full h-full object-cover"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs font-mono text-[#ff6b00]">
            Subiendo...
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-white uppercase">{user?.Nombre || user?.nombre || "Atleta"}</h3>
        <p className="text-xs font-mono text-[#ff6b00]">{user?.Objetivo || user?.objetivo || "Rendimiento Atlético"}</p>
      </div>

      <div className="w-full pt-2">
        <label className="w-full block bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-extrabold font-mono text-xs uppercase py-3.5 px-4 rounded-xl cursor-pointer transition-all text-center shadow-[0_0_15px_rgba(255,107,0,0.3)]">
          {uploading ? "Procesando..." : "Cambiar Imagen"}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      <div className="w-full text-left pt-3 border-t border-white/5 space-y-1">
        <span className="text-[10px] font-mono text-[#e2bfb0]/60 uppercase block">Correo Electrónico</span>
        <div className="w-full bg-black/40 p-2.5 rounded-xl border border-white/5 text-white text-xs font-mono truncate">
          {userEmail}
        </div>
      </div>
    </div>
  );
};