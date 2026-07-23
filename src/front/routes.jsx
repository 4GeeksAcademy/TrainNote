import React from "react";
import { createHashRouter, createRoutesFromElements, Route, Outlet } from "react-router-dom";

import { Home } from "./pages/Home.jsx";
import { Perfil } from "./pages/Perfil.jsx";
import { Entrenamiento } from "./pages/Entrenamiento.jsx";
import { Nutricion } from "./pages/Nutricion.jsx";
import { Peso } from "./pages/Peso.jsx";
import { Progreso } from "./pages/Progreso.jsx";
import { PlanIA } from "./pages/PlanIA.jsx";

import { Sidebar } from "./components/Sidebar.jsx";
import { Footer } from "./components/Footer.jsx";

const MainLayout = () => (
  <div className="flex min-h-screen bg-[#0a0a0a] text-[#e5e2e1] font-sans w-full overflow-x-hidden">
    <Sidebar />
    <div className="lg:ml-64 flex-1 flex flex-col justify-between min-h-screen w-full">
     <main className="p-4 sm:p-6 lg:p-8 pt-24 lg:pt-8 space-y-6 lg:space-y-8 flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
);

export const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* HOME INDEPENDIENTE (Pantalla completa) */}
      <Route index element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="home.html" element={<Home />} />

      {/* PÁGINAS INTERNAS (Con Sidebar y Footer) */}
      <Route element={<MainLayout />}>
        <Route path="progreso" element={<Progreso />} />
        <Route path="progreso.html" element={<Progreso />} />

        <Route path="perfil" element={<Perfil />} />
        <Route path="perfil.html" element={<Perfil />} />

        <Route path="entrenamiento" element={<Entrenamiento />} />
        <Route path="entrenamiento.html" element={<Entrenamiento />} />

        <Route path="nutricion" element={<Nutricion />} />
        <Route path="nutricion.html" element={<Nutricion />} />

        <Route path="peso" element={<Peso />} />
        <Route path="peso.html" element={<Peso />} />

        <Route path="plania" element={<PlanIA />} />
        <Route path="plania.html" element={<PlanIA />} />
      </Route>

      <Route path="*" element={<h1 className="text-white p-10 font-bold">404 - Página no encontrada</h1>} />
    </Route>
  )
);