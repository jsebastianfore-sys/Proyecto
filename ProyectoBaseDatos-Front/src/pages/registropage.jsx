import React from 'react';
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import RegistroForm from "../componentes/registroForm";

export default function RegistroPage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f3ea] flex flex-col justify-between">
      {/* Navbar Superior */}
      <Navbar />
      
      {/* Zona central flexible y centrada */}
      <main className="w-full flex items-center justify-center px-6 py-12 flex-grow">
        <RegistroForm />
      </main>

      {/* Footer Inferior */}
      <Footer />
    </div>
  );
}