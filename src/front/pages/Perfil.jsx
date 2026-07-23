import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import { AvatarCard } from "../components/AvatarCard";
import { PersonalDataForm } from "../components/PersonalDataForm";
import { SecurityForm } from "../components/SecurityForm";
import { actions } from "../store";

export const Perfil = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("tn_jwt_token");
    if (!token) {
      navigate("/");
      return;
    }
    actions.getProfile(dispatch, store);
  }, []);

  const user = store.user || JSON.parse(localStorage.getItem("tn_user_data") || "{}");

  const handleUpdateProfile = async (formData) => {
    const success = await actions.updateProfile(dispatch, store, formData);
    if (success) {
      actions.showAlert(dispatch, store, "¡Perfil actualizado con éxito! Redirigiendo...", "success");
      setTimeout(() => {
        navigate("/progreso");
      }, 1500); 
    }
  };

  const handleUpdateAvatar = async (secureUrl) => {
    await actions.updateProfile(dispatch, store, { avatar_url: secureUrl });
    actions.showAlert(dispatch, store, "¡Imagen de perfil actualizada!", "success");
  };

  const handleUpdatePassword = async (currentPassword, newPassword, confirmPassword, onSuccess) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      actions.showAlert(dispatch, store, "Por favor llena todos los campos de contraseña.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      actions.showAlert(dispatch, store, "Las nuevas contraseñas no coinciden.", "error");
      return;
    }

    const success = await actions.updatePassword(dispatch, store, currentPassword, newPassword);
    if (success) {
      onSuccess();
      actions.showAlert(dispatch, store, "¡Contraseña actualizada con éxito! Redirigiendo...", "success");
      setTimeout(() => {
        navigate("/progreso");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e2e1] font-sans p-4 sm:p-6 lg:p-8 space-y-6 w-full max-w-7xl mx-auto overflow-x-hidden">
      
      {/* ALERTA GLOBAL */}
      {store.alert?.show && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all animate-fade-in ${
            store.alert.type === "error"
              ? "text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab]/20 shadow-[0_0_15px_rgba(147,0,10,0.2)]"
              : "text-emerald-300 bg-emerald-950/40 border-emerald-800/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {store.alert.type === "error" ? "warning" : "check_circle"}
          </span>
          <span>{store.alert.message}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="pb-4 border-b border-white/5">
        <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white">
          PERFIL DE <span className="text-[#ff6b00]">USUARIO</span>
        </h2>
        <p className="text-[11px] font-mono text-[#e2bfb0]/60">GESTIÓN DE CREDENCIALES Y DATOS PERSONALES</p>
      </header>

      {/* SECCIÓN SUPERIOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4">
          <AvatarCard user={user} onUpdateAvatar={handleUpdateAvatar} />
        </div>
        <div className="lg:col-span-8 flex flex-col">
          <PersonalDataForm user={user} onSubmit={handleUpdateProfile} />
        </div>
      </div>

      {/* SECCIÓN INFERIOR */}
      <div className="w-full pb-10">
        <SecurityForm onSubmitPassword={handleUpdatePassword} />
      </div>
    </div>
  );
};