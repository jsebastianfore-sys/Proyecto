import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./componentes/ProtectedRoute";

// Páginas Públicas de la Web
import Home from "./pages/home";
import ServiciosPage from "./pages/serviciosPage";
import ContactoPage from "./pages/contactoPage";
import LoginPage from "./pages/loginPage";
import RegistroPage from "./pages/registroPage";

// Contenedor Principal del Panel
import DashboardPage from "./pages/dashboardPage";

// Importación de las 11 Vistas de las Tablas
import CitasView from "./componentes/citasView";
import ConsultasView from "./componentes/consultasView";
import MascotasView from "./componentes/mascotasView";
import { EspecialidadesView } from "./componentes/especialidadesView";
import EspeciesView from "./componentes/especiesView";
import FacturasView from "./componentes/facturasView";
import MedicamentosView from "./componentes/medicamentosView";
import PropietariosView from "./componentes/propietariosView";
import TratamientosView from "./componentes/tratamientosView";
import UsuariosView from "./componentes/usuariosView";
import VeterinariosView from "./componentes/veterinariosView";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas del Sitio */}
        <Route path="/" element={<Home />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="citas" replace />} />

          <Route path="citas" element={<CitasView />} />
          <Route path="consultas" element={<ConsultasView />} />
          <Route path="mascotas" element={<MascotasView />} />
          <Route path="especialidades" element={<EspecialidadesView />} />
          <Route path="especies" element={<EspeciesView />} />
          <Route path="facturas" element={<FacturasView />} />
          <Route path="medicamentos" element={<MedicamentosView />} />
          <Route path="propietarios" element={<PropietariosView />} />
          <Route path="tratamientos" element={<TratamientosView />} />
          <Route path="usuarios" element={<UsuariosView />} />
          <Route path="veterinarios" element={<VeterinariosView />} />
        </Route>

        {/* Ruta comodín por si se pierde el usuario */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
