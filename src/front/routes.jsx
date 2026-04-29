import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Registro } from "./pages/Registro";
import { Login } from "./pages/Login";
import { FamiliaRutina } from "./pages/FamiliaRutina";
import { Menupadre } from "./pages/Menupadre";
import { Addhijo } from "./pages/Addhijo.jsx";
import { AddAutorizado } from "./pages/AddAutorizado.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { AsignarRutina } from "./pages/AsignarRutina.jsx";
import { Rutinas } from "./pages/Rutinas.jsx";
import { CrearRutina } from "./pages/CrearRutina.jsx";
import { DetalleRutinaHijo } from "./pages/DetalleRutinaHijo.jsx";
import { VistaCuidador } from "./pages/VistaCuidador.jsx"; 

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        
        <Route index element={<Login />} />
        <Route path="registro" element={<Registro />} />

        <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="rutinas" element={<ProtectedRoute><Rutinas /></ProtectedRoute>} />
        <Route path="crear-rutina" element={<ProtectedRoute><CrearRutina /></ProtectedRoute>} />
        <Route path="asignar-rutina" element={<ProtectedRoute><AsignarRutina /></ProtectedRoute>} />
        
        <Route path="detalle-rutina-hijo/:id" element={<ProtectedRoute><DetalleRutinaHijo /></ProtectedRoute>} />
        
        <Route path="familia-rutina/:id" element={<ProtectedRoute><FamiliaRutina /></ProtectedRoute>} />
        <Route path="menupadre" element={<ProtectedRoute><Menupadre /></ProtectedRoute>} />
        <Route path="addhijo" element={<ProtectedRoute><Addhijo /></ProtectedRoute>} />
        <Route path="add-autorizado" element={<ProtectedRoute><AddAutorizado /></ProtectedRoute>} />
        
        <Route path="single/:theId" element={<ProtectedRoute><Single /></ProtectedRoute>} />
        <Route path="demo" element={<ProtectedRoute><Demo /></ProtectedRoute>} />
        
        
        <Route path="vistacuidador" element={<ProtectedRoute><VistaCuidador /></ProtectedRoute>} />

      </Route>
    )
);