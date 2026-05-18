import React from 'react';
import Navbar from "../componentes/navbar";
import Servicios from "../componentes/servicios";
import Footer from "../componentes/footer";

export default function ServiciosPage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f3ea] block">
      <Navbar />
      {/* Reutilizamos el componente con las 8 tarjetas que creamos antes */}
      <div className="pt-20"> 
        <Servicios />
      </div>
      <Footer />
    </div>
  );
}