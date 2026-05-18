import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", loginData);
  };

  return (
    <div className="w-full max-w-md bg-[#fafaf6] border border-gray-200/60 rounded-[32px] p-10 flex flex-col items-center gap-6 shadow-sm">
      
      {/* Icono de la marca */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-700 text-white shadow-sm">
        <PawPrint className="w-6 h-6" />
      </div>

      {/* Textos de Bienvenida */}
      <div className="text-center flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Bienvenido de vuelta
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Inicia sesión para continuar
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 mt-2">
        
        {/* Input Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 pl-1">Email</label>
          <input 
            type="email" 
            name="email"
            value={loginData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full px-4 py-3.5 bg-[#f4f3ea]/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-600 font-medium text-gray-700 placeholder-gray-400/80 transition-colors"
            required
          />
        </div>

        {/* Input Contraseña */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 pl-1">Contraseña</label>
          <input 
            type="password" 
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3.5 bg-[#f4f3ea]/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-600 font-medium text-gray-700 placeholder-gray-400/80 transition-colors"
            required
          />
        </div>

        {/* Botón Ingresar */}
        <div className="mt-2">
          <button 
            type="submit"
            className="w-full py-3.5 rounded-full bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-all shadow-md text-center"
          >
            Iniciar sesión
          </button>
        </div>

      </form>

      {/* Enlace de Registro */}
      <div className="text-sm text-gray-600 font-medium mt-2">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="text-emerald-700 font-bold hover:underline">
          Regístrate
        </Link>
      </div>

    </div>
  );
}