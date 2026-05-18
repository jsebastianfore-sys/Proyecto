import React from 'react'; // Buena práctica tenerlo importado
import Navbar from "../componentes/navbar";
import Hero from "../componentes/hero";
import CTA from '../componentes/cta';
import Footer from '../componentes/footer';

function Home() {
  return (
    // Reemplazamos los fragmentos por un div contenedor con el fondo base
    <div className="min-h-screen bg-[#f4f3ea]">
      {/* 1. Tu barra de navegación */}
      <Navbar />

      {/* 2. Colocamos el componente Hero en lugar del h1 anterior */}
      <Hero />

      <CTA />

      <Footer />

    </div>
  );
}

export default Home;