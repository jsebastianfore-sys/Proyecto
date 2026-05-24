import React from 'react';
import { Calendar, Search, Plus, Edit3, Trash2 } from 'lucide-react';

export default function CitasView() {
  const citas = [
    { id: 'C-001', mascota: 'Luna', veterinario: 'Dra. Pérez', fecha: '2026-05-20', estado: 'Confirmada' },
    { id: 'C-002', mascota: 'Max', veterinario: 'Dr. Soto', fecha: '2026-05-21', estado: 'Pendiente' },
    { id: 'C-003', mascota: 'Rocky', veterinario: 'Dra. Pérez', fecha: '2026-05-22', estado: 'Completada' },
  ];

  // Función interna para pintar los badges de estado exactamente como tu diseño
  const getEstadoEstilo = (estado) => {
    switch (estado) {
      case 'Confirmada':
        return 'bg-[#e3ebd7] text-emerald-800 border border-emerald-200/30';
      case 'Pendiente':
        return 'bg-amber-50 text-amber-800 border border-amber-200/30';
      case 'Completada':
        return 'bg-gray-100 text-gray-700 border border-gray-200/50';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* TÍTULO Y BOTÓN SUPERIOR */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Calendar className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Citas</h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            3 registros · vista de ejemplo
          </span>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all">
          <Plus className="w-4 h-4" />
          <span>Nuevo cita</span>
        </button>
      </div>

      {/* INPUT DE BÚSQUEDA */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          placeholder="Buscar en citas..."
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors"
        />
      </div>

      {/* TABLA DE CITAS */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200/80 bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-20">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Mascota</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Veterinario</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-24 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/60">
            {citas.map((cita) => (
              <tr key={cita.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{cita.id}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">{cita.mascota}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">{cita.veterinario}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600 tracking-tight">{cita.fecha}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getEstadoEstilo(cita.estado)}`}>
                    {cita.estado}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center justify-center gap-4 text-gray-700">
                    <button className="hover:text-emerald-700 transition-colors p-1 rounded-lg hover:bg-gray-100">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}