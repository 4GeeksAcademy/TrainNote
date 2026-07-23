import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("tn_jwt_token");
    localStorage.removeItem("tn_user_data");
    navigate("/");
  };

  const navItems = [
    { label: "Perfil", path: "/perfil", icon: "person" },
    { label: "Entrenamiento", path: "/entrenamiento", icon: "fitness_center" },
    { label: "Nutrición", path: "/nutricion", icon: "restaurant" },
    { label: "Peso", path: "/peso", icon: "monitor_weight" },
    { label: "Progreso", path: "/progreso", icon: "trending_up" },
    { label: "Plan IA", path: "/plania", icon: "psychology" }
  ];

  return (
    <>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-white/10 text-[#ff6b00] flex items-center justify-center shadow-lg"
        >
          <span className="material-symbols-outlined">{isOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 z-30 backdrop-blur-sm"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 max-w-[80vw] bg-[#0a0a0a] border-r border-white/5 flex flex-col justify-between p-6 z-40 transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div
            className="flex items-center gap-3 mb-8 cursor-pointer mt-2 lg:mt-0"
            onClick={() => {
              navigate("/progreso");
              setIsOpen(false);
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#ff6b00] flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.4)] shrink-0">
              <span className="material-symbols-outlined text-white text-xl">bolt</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-extrabold tracking-wider text-lg truncate">TRAINNOTE</h1>
              <p className="text-[9px] font-mono text-[#ff6b00] tracking-widest uppercase truncate">
                Forma tu mejor versión
              </p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#ff6b00]/10 border border-[#ff6b00]/30 text-[#ff6b00] shadow-[0_0_15px_rgba(255,107,0,0.1)] font-bold"
                      : "text-[#e2bfb0]/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <span className="material-symbols-outlined text-base shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-[#ff6b00] hover:bg-[#ff6b00]/10 transition-all cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-base shrink-0">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};