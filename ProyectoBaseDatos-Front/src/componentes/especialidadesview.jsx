import React from 'react';
import { Award, Plus, Search, Edit2, Trash2 } from 'lucide-react';

export function EspecialidadesView() {
  const datos = [
    { id: 'ESP-001', nombre: 'Cardiología', descripcion: 'Tratamiento de problemas del corazón y sistema circulatorio.' },
    { id: 'ESP-002', nombre: 'Dermatología', descripcion: 'Afecciones de la piel, control de alergias y otitis.' },
    { id: 'ESP-003', nombre: 'Cirugía General', descripcion: 'Procedimientos quirúrgicos complejos y tejidos blandos.' },
    { id: 'ESP-004', nombre: 'Oftalmología', descripcion: 'Tratamiento de úlceras corneales, cataratas y problemas de visión.' }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Cabecera de la sección */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Award className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Especialidades</h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {datos.length} especialidades médicas configuradas para el personal
          </span>
        </div>
        
        {/* Botón de acción */}
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all">
          <Plus className="w-4 h-4" />
          <span>Nueva especialidad</span>
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Buscar especialidades por nombre o descripción..." 
          className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors" 
        />
      </div>

      {/* Contenedor de la Tabla */}
      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">NOMBRE DE LA ESPECIALIDAD</th>
                <th className="py-4 px-6">DESCRIPCIÓN CLÍNICA</th>
                <th className="py-4 px-6 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
              {datos.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* ID único con estilo monoespaciado */}
                  <td className="py-4 px-6 text-gray-400 font-mono text-xs">{reg.id}</td>
                  
                  {/* Nombre resaltado */}
                  <td className="py-4 px-6 font-bold text-gray-800">{reg.nombre}</td>
                  
                  {/* Descripción corta */}
                  <td className="py-4 px-6 text-gray-500 max-w-md truncate">{reg.descripcion}</td>
                  
                  {/* Botones de acción */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        title="Editar registro"
                        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        title="Eliminar registro"
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}