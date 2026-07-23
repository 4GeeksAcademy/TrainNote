import React from "react";

export const AuthTabs = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex border-b border-white/5 bg-white/[0.02]">
      <button
        onClick={() => setActiveTab("login")}
        className={`flex-1 px-4 py-5 font-mono text-xs font-bold uppercase tracking-widest transition-all relative cursor-pointer ${
          activeTab === "login"
            ? "text-[#ff6b00] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#ff6b00] after:shadow-[0_0_10px_#ff6b00]"
            : "text-[#e2bfb0]/60 hover:text-white"
        }`}
      >
        Iniciar Sesión
      </button>
      <button
        onClick={() => setActiveTab("register")}
        className={`flex-1 px-4 py-5 font-mono text-xs font-bold uppercase tracking-widest transition-all relative cursor-pointer ${
          activeTab === "register"
            ? "text-[#ff6b00] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#ff6b00] after:shadow-[0_0_10px_#ff6b00]"
            : "text-[#e2bfb0]/60 hover:text-white"
        }`}
      >
        Registro
      </button>
      <button
        onClick={() => setActiveTab("recover")}
        className={`flex-1 px-4 py-5 font-mono text-xs font-bold uppercase tracking-widest transition-all relative cursor-pointer ${
          activeTab === "recover"
            ? "text-[#ff6b00] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#ff6b00] after:shadow-[0_0_10px_#ff6b00]"
            : "text-[#e2bfb0]/60 hover:text-white"
        }`}
      >
        Recuperar
      </button>
    </nav>
  );
};