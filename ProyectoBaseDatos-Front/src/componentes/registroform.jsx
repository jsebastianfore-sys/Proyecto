import React, { useState } from 'react';
import { PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegistroForm() {
  const [registroData, setRegistroData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setRegistroData({
      ...registroData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica de contraseñas
    if (registroData.password !== registroData.confirmPassword) {
      alert("¡Las contraseñas no coinciden!");
      return;
    }

    console.log("Registrando usuario con datos:", registroData);
  };

  return (
    <div className="w-full max-w-md bg-[#fafaf6] border border-gray-200/60 rounded-[32px] p-10 flex flex-col items-center gap-6 shadow-sm">
      
      {/* Icono Huellitas */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-700 text-white shadow-sm">
        <PawPrint className="w-6 h-6" />
      </div>

      {/* Título de Bienvenida */}
      <div className="text-center flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Crea tu cuenta
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Únete a la familia Huellitas
        </p>
      </div>

      {/* Formulario de registro */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-2">
        
        {/* Input Nombre Completo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700 pl-1">Nombre completo</label>
          <input 
            type="text" 
            name="nombre"
            value={registroData.nombre}
            onChange={handleChange}
            placeholder="María García"
            className="w-full px-4 py-3 bg-[#f4f3ea]/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-600 font-medium text-gray-700 placeholder-gray-400/80 transition-colors"
            required
          />
        </div>

        {/* Input Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700 pl-1">Email</label>
          <input 
            type="email" 
            name="email"
            value={registroData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 bg-[#f4f3ea]/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-600 font-medium text-gray-700 placeholder-gray-400/80 transition-colors"
            required
          />
        </div>

        {/* Input Contraseña */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700 pl-1">Contraseña</label>
          <input 
            type="password" 
            name="password"
            value={registroData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            className="w-full px-4 py-3 bg-[#f4f3ea]/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-600 font-medium text-gray-700 placeholder-gray-400/80 transition-colors"
            minLength="6"
            required
          />
        </div>

        {/* CAMBIO AQUÍ: Input Confirmar Contraseña en vez de Teléfono */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-700 pl-1">Confirmar contraseña</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={registroData.confirmPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            className="w-full px-4 py-3 bg-[#f4f3ea]/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-600 font-medium text-gray-700 placeholder-gray-400/80 transition-colors"
            required
          />
        </div>

        {/* Botón Enviar */}
        <div className="mt-3">
          <button 
            type="submit"
            className="w-full py-3.5 rounded-full bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-all shadow-md text-center"
          >
            Crear cuenta
          </button>
        </div>

      </form>

      {/* Volver al Login */}
      <div className="text-sm text-gray-600 font-medium mt-1">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-emerald-700 font-bold hover:underline">
          Inicia sesión
        </Link>
      </div>

    </div>
  );
}