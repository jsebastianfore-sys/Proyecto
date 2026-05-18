import React, { useState } from "react";
import { PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://proyectobs-backend.onrender.com/api/auth/login",
        {
          username: loginData.username,
          password: loginData.password,
        },
      );

      console.log("RESPUESTA COMPLETA:");
      console.log(response);

      console.log("DATA:");
      console.log(response.data);
    } catch (error) {
      console.log("ERROR:");
      console.log(error);

      if (error.response) {
        console.log("DATA ERROR:");
        console.log(error.response.data);
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-[#fafaf6] border border-gray-200/60 rounded-[32px] p-10 flex flex-col items-center gap-6 shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-700 text-white shadow-sm">
        <PawPrint className="w-6 h-6" />
      </div>

      <div className="text-center flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Bienvenido de vuelta
        </h1>

        <p className="text-sm text-gray-500 font-medium">
          Inicia sesión para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 mt-2">
        {/* USERNAME */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 pl-1">
            Usuario
          </label>

          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleChange}
            placeholder="admin"
            className="w-full px-4 py-3.5 bg-[#f4f3ea]/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-600"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 pl-1">
            Contraseña
          </label>

          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3.5 bg-[#f4f3ea]/60 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-600"
            required
          />
        </div>

        <div className="mt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-all shadow-md"
          >
            Iniciar sesión
          </button>
        </div>
      </form>

      <div className="text-sm text-gray-600 font-medium mt-2">
        ¿No tienes cuenta?{" "}
        <Link
          to="/registro"
          className="text-emerald-700 font-bold hover:underline"
        >
          Regístrate
        </Link>
      </div>
    </div>
  );
}
