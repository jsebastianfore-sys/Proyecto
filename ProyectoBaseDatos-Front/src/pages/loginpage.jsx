import React from 'react';
import Navbar from "../componentes/navbar";
import Footer from "../componentes/footer";
import LoginForm from "../componentes/loginForm";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f3ea] flex flex-col justify-between">
      {/* Barra superior */}
      <Navbar />
      
      {/* Contenedor central que equilibra y centra perfectamente la tarjeta */}
      <main className="w-full flex items-center justify-center px-6 py-12 flex-grow">
        <LoginForm />
      </main>

      {/* Barra inferior */}
      <Footer />
    </div>
  );
}