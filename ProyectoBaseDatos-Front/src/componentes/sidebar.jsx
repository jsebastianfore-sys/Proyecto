import {
  PawPrint,
  Calendar,
  FileText,
  Award,
  Grid,
  DollarSign,
  Heart,
  Pill,
  Users,
  Activity,
  User,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Citas",
      to: "/dashboard/citas",
    },
    {
      icon: <FileText className="w-5 h-5" />,
      label: "Consultas",
      to: "/dashboard/consultas",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Mascotas",
      to: "/dashboard/mascotas",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "Especialidades",
      to: "/dashboard/especialidades",
    },
    {
      icon: <Grid className="w-5 h-5" />,
      label: "Especies",
      to: "/dashboard/especies",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Facturas",
      to: "/dashboard/facturas",
    },
    {
      icon: <Pill className="w-5 h-5" />,
      label: "Medicamentos",
      to: "/dashboard/medicamentos",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Propietarios",
      to: "/dashboard/propietarios",
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: "Tratamientos",
      to: "/dashboard/tratamientos",
    },
    {
      icon: <User className="w-5 h-5" />,
      label: "Usuarios",
      to: "/dashboard/usuarios",
    },
    {
      icon: <ShieldAlert className="w-5 h-5" />,
      label: "Veterinarios",
      to: "/dashboard/veterinarios",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[#fafaf6] border-r border-gray-200/80 flex flex-col justify-between shrink-0 fixed left-0 top-0 z-50">
      <Link
        to="/"
        className="flex items-center gap-3 px-6 py-5 border-b border-b-gray-200/60 hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-700 text-white">
          <PawPrint className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold text-gray-800">Huellitas</span>
      </Link>

      <div className="grow overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-400 tracking-wider px-4 mb-2">
            GESTIÓN
          </span>

          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#e3ebd7] text-emerald-900 font-bold shadow-sm"
                    : "text-gray-600 hover:bg-gray-200/50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={isActive ? "text-emerald-800" : "text-gray-400"}
                  >
                    {item.icon}
                  </div>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200/60 bg-[#fafaf6]">
        <div className="px-2 py-2 flex flex-col gap-0.5 mb-2">
          <span className="text-sm font-bold text-gray-800 truncate">
            {user.username || "Usuario"}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {user.rol || "Sin rol"}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {user.email || "Sin rol"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
