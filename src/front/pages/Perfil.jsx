import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { AvatarCard } from "../components/AvatarCard";
import { PersonalDataForm } from "../components/PersonalDataForm";
import { SecurityForm } from "../components/SecurityForm";
import { actions } from "../store";

export const Perfil = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [tempAvatar, setTempAvatar] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("tn_jwt_token");
    if (!token) {
      navigate("/");
      return;
    }
    dispatch({
      type: "set_alert",
      payload: { show: false, message: "", type: "" }
    });
    actions.getProfile(dispatch, store);
  }, []);

  const user = store.user || JSON.parse(localStorage.getItem("tn_user_data") || "{}");
  const userName = user?.Nombre || user?.nombre || "Atleta";

  // GUARDAR PERFIL 
  const handleUpdateProfile = async (formData) => {
    const finalAvatarUrl = tempAvatar || user?.urlFoto || user?.url_foto || user?.avatar_url || user?.imagen || "";

    const dataToSend = {
      ...formData,
      url_foto: finalAvatarUrl
    };

    const success = await actions.updateProfile(dispatch, store, dataToSend);
    if (success) {
      const updatedUser = await actions.getProfile(dispatch, store);
      
      if (updatedUser) {
        localStorage.setItem("tn_user_data", JSON.stringify(updatedUser));
        
        dispatch({
          type: "set_user",
          payload: updatedUser
        });
      }

      dispatch({
        type: "set_alert",
        payload: { show: true, message: "¡Perfil actualizado con éxito! Redirigiendo...", type: "success" }
      });
      
      setTempAvatar("");
      setTimeout(() => {
        navigate("/progreso");
      }, 1500); 
    }
  };

  // ACTUALIZAR CONTRASEÑA Y REDIRIGIR
  const handleUpdatePassword = async (currentPassword, newPassword, confirmPassword, onSuccess) => {
    dispatch({
      type: "set_alert",
      payload: { show: false, message: "", type: "" }
    });

    if (!currentPassword || !newPassword || !confirmPassword) {
      dispatch({
        type: "set_alert",
        payload: { show: true, message: "Por favor llena todos los campos de contraseña.", type: "error" }
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatch({
        type: "set_alert",
        payload: { show: true, message: "Las nuevas contraseñas no coinciden.", type: "error" }
      });
      return;
    }

    const success = await actions.updatePassword(dispatch, store, currentPassword, newPassword);
    
    if (success) {
      onSuccess();
      dispatch({
        type: "set_alert",
        payload: { show: true, message: "¡Contraseña actualizada con éxito! Redirigiendo...", type: "success" }
      });
      setTimeout(() => {
        navigate("/progreso");
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4 pb-6">
      <div className="relative z-10 space-y-4">
        
        {/* ALERTA GLOBAL */}
        {store.alert?.show && (
          <div className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium ${
            store.alert.type === "error" ? "text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab]/20" : "text-emerald-300 bg-emerald-950/40 border-emerald-800/40"
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {store.alert.type === "error" ? "warning" : "check_circle"}
            </span>
            <span>{store.alert.message}</span>
          </div>
        )}

        {/* HEADER UNIFICADO */}
        <header className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 pl-10 lg:pl-0 border-b border-white/5">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold uppercase tracking-tight text-white leading-tight break-words">
              PERFIL DE <span className="text-[#ff6b00]">USUARIO</span>
            </h2>
            <p className="text-[10px] sm:text-[11px] font-mono text-[#e2bfb0]/60">
              GESTIÓN DE CREDENCIALES Y DATOS PERSONALES
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#1a1a1a]/65 border border-white/10 px-3 py-1.5 rounded-xl w-full sm:w-auto shrink-0">
            <span className="material-symbols-outlined text-[#ff6b00] text-sm shrink-0">
              account_circle
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white uppercase truncate">{userName}</p>
              <p className="text-[9px] font-mono text-[#ff6b00] truncate">
                Objetivo: {user?.Objetivo || user?.objetivo || "Rendimiento Atlético"}
              </p>
            </div>
          </div>
        </header>

        {/* SECCIÓN SUPERIOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-4 min-w-0">
            <AvatarCard 
              user={user} 
              tempAvatar={tempAvatar} 
              onImageSelect={(url) => setTempAvatar(url)} 
            />
          </div>
          <div className="lg:col-span-8 flex flex-col min-w-0">
            <PersonalDataForm user={user} onSubmit={handleUpdateProfile} />
          </div>
        </div>

        {/* SECCIÓN INFERIOR */}
        <div className="w-full min-w-0">
          <SecurityForm onSubmitPassword={handleUpdatePassword} />
        </div>
      </div>
    </div>
  );
};