import { useState } from "react";
import { PawPrint } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginRequest } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

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

      const { token, user } = response.data;

      login({ token, user });

      toast.success(`Bienvenido ${user.username}`);

      // Redirección según rol
      switch (user.rol) {
        case "SUPERADMIN":
          navigate("/dashboard");
          break;

        case "ADMIN":
          navigate("/dashboard");
          break;

        case "USUARIO":
          navigate("/dashboard");
          break;

        case "CONSULTA":
          navigate("/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (error) {
      console.log(error);

      const message =
        error?.response?.data?.message || "Credenciales inválidas";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#fafaf6] border border-gray-200/60 rounded-[4xl] p-10 flex flex-col items-center gap-6 shadow-sm">
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
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
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
