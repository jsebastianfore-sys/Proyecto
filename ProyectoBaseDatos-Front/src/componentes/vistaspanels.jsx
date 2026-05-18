import React from 'react';
import { FileText, Heart, Award, Grid, DollarSign, Pill, Users, Activity, User, ShieldAlert, Plus, Search } from 'lucide-react';

// Estructura base para reutilizar el diseño de la cabecera y buscador
const BaseLayout = ({ title, icon, subtitle, buttonText }) => (
  <div className="w-full flex flex-col gap-6">
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          {icon}
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h1>
        </div>
        <span className="text-sm text-gray-500 font-medium">{subtitle}</span>
      </div>
      <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all">
        <Plus className="w-4 h-4" />
        <span>{buttonText}</span>
      </button>
    </div>
    <div className="w-full max-w-xl relative">
      <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      <input type="text" placeholder={`Buscar en ${title.toLowerCase()}...`} className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors" />
    </div>
    <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] p-8 text-center shadow-sm text-gray-400 font-medium">
      No hay registros cargados en la base de datos de {title.toLowerCase()}.
    </div>
  </div>
);

// 1. Consultas
export const ConsultasView = () => (
  <BaseLayout title="Consultas" icon={<FileText className="w-7 h-7 text-emerald-800" />} subtitle="Historial clínico y revisiones" buttonText="Nueva consulta" />
);

// 2. Mascotas
export const MascotasView = () => (
  <BaseLayout title="Mascotas" icon={<Heart className="w-7 h-7 text-emerald-800" />} subtitle="Pacientes peludos registrados" buttonText="Nueva mascota" />
);

// 3. Especialidades
export const EspecialidadesView = () => (
  <BaseLayout title="Especialidades" icon={<Award className="w-7 h-7 text-emerald-800" />} subtitle="Áreas de atención médica" buttonText="Nueva especialidad" />
);

// 4. Especies
export const EspeciesView = () => (
  <BaseLayout title="Especies" icon={<Grid className="w-7 h-7 text-emerald-800" />} subtitle="Categorías filogenéticas de animales" buttonText="Nueva especie" />
);

// 5. Facturas
export const FacturasView = () => (
  <BaseLayout title="Facturas" icon={<DollarSign className="w-7 h-7 text-emerald-800" />} subtitle="Control de pagos y cajas" buttonText="Nueva factura" />
);

// 6. Medicamentos
export const MedicamentosView = () => (
  <BaseLayout title="Medicamentos" icon={<Pill className="w-7 h-7 text-emerald-800" />} subtitle="Inventario de farmacia veterinaria" buttonText="Nuevo medicamento" />
);

// 7. Propietarios
export const PropietariosView = () => (
  <BaseLayout title="Propietarios" icon={<Users className="w-7 h-7 text-emerald-800" />} subtitle="Dueños y acudientes de mascotas" buttonText="Nuevo propietario" />
);

// 8. Tratamientos
export const TratamientosView = () => (
  <BaseLayout title="Tratamientos" icon={<Activity className="w-7 h-7 text-emerald-800" />} subtitle="Procedimientos médicos activos" buttonText="Nuevo tratamiento" />
);

// 9. Usuarios
export const UsuariosView = () => (
  <BaseLayout title="Usuarios" icon={<User className="w-7 h-7 text-emerald-800" />} subtitle="Cuentas con acceso al sistema" buttonText="Nuevo usuario" />
);

// 10. Veterinarios
export const VeterinariosView = () => (
  <BaseLayout title="Veterinarios" icon={<ShieldAlert className="w-7 h-7 text-emerald-800" />} subtitle="Personal médico especialista" buttonText="Nuevo veterinario" />
);