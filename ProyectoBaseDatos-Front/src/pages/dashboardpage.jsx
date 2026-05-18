import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../componentes/sidebar';

export default function DashboardPage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f3ea] flex">
      
      {/* Menú Lateral Fijo a la Izquierda */}
      <Sidebar />

      {/* Contenedor del Contenido Dinámico de la Derecha */}
      {/* El pl-64 evita de forma limpia que la barra lateral tape las tablas */}
      <main className="flex-grow pl-64 min-h-screen w-full">
        <div className="p-10 max-w-6xl mx-auto">
          {/* React Router renderizará aquí la vista según la pestaña activa */}
          <Outlet /> 
        </div>
      </main>

    </div>
  );
}