import React from "react";

export const Footer = () => {
  return (
    <footer className="relative z-10 w-full py-4 text-center border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-sm">
      <p className="text-xs font-mono text-[#e2bfb0]/60 tracking-wider">
        © 2026 <span className="text-[#ff6b00] font-bold">TrainNote</span>. Todos los derechos reservados.
      </p>
    </footer>
  );
};