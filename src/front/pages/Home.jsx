import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { actions } from "../store";

import { BentoGrid } from "../components/BentoGrid";
import { AuthTabs } from "../components/AuthTabs";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { RecoverForm } from "../components/RecoverForm";
import { Footer } from "../components/Footer"; 

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (email, password) => {
    const success = await actions.login(dispatch, store, email, password);
    if (success) {
      navigate("/progreso");
    }
  };

  const handleRegister = async (formData) => {
    const success = await actions.register(dispatch, store, formData);
    if (success) {
      setActiveTab("login");
    }
  };

  const handleResetComplete = async (formData) => {
    const success = await actions.resetPassword(dispatch, store, formData);
    if (success) {
      setActiveTab("login");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#e5e2e1] font-sans flex flex-col justify-between overflow-x-hidden">

      {/* EFECTOS DE FONDO */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a]/95 to-black/80"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#ff6b00]/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#ff6b00]/5 rounded-full blur-[150px]"></div>
      </div>

      {/* CONTENEDOR PRINCIPAL*/}
      <main className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mx-auto p-4 sm:p-6 lg:p-8 flex-1 my-auto">
        
        {/* LADO IZQUIERDO*/}
        <div className="lg:col-span-5 flex flex-col">
          <BentoGrid />
        </div>

        {/* LADO DERECHO */}
        <div className="lg:col-span-7 flex flex-col w-full">
          <div className="bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:border-[#ff6b00]/30 transition-all duration-300 flex-1 flex flex-col justify-between">
            <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="p-6 sm:p-8 lg:p-12 flex-1 flex flex-col justify-center">
              {store.alert?.show && (
                <div
                  className={`mb-6 flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
                    store.alert.type === "error"
                      ? "text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab]/20"
                      : "text-emerald-300 bg-emerald-950/30 border-emerald-800/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <span>{store.alert.message}</span>
                </div>
              )}

              {activeTab === "login" && (
                <LoginForm
                  onSubmit={handleLogin}
                  onForgotPassword={() => setActiveTab("recover")}
                  loading={store.loading}
                />
              )}

              {activeTab === "register" && (
                <RegisterForm
                  onSubmit={handleRegister}
                  loading={store.loading}
                />
              )}

              {activeTab === "recover" && (
                <RecoverForm
                  onSendCode={(email) => actions.sendCode(dispatch, store, email)}
                  onVerifyCode={(email, code) => actions.verifyCode(dispatch, store, email, code)}
                  onResetPassword={handleResetComplete}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};