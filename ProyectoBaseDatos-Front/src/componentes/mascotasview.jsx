import React from 'react';
import { Heart, Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function MascotasView() {
  const datos = [
    { id: 'M-001', nombre: 'Luna', especie: 'Perro', raza: 'Golden Retriever', edad: '2 años', propietario: 'María García' },
    { id: 'M-002', nombre: 'Max', especie: 'Gato', raza: 'Siamés', edad: '1 año', propietario: 'Juan Pérez' }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Heart className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Mascotas</h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">{datos.length} pacientes registrados</span>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all">
          <Plus className="w-4 h-4" />
          <span>Nueva mascota</span>
        </button>
      </div>

      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Buscar mascotas..." className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors" />
      </div>

      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">NOMBRE</th>
                <th className="py-4 px-6">ESPECIE</th>
                <th className="py-4 px-6">RAZA</th>
                <th className="py-4 px-6">EDAD</th>
                <th className="py-4 px-6">PROPIETARIO</th>
                <th className="py-4 px-6 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
              {datos.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-400 font-mono text-xs">{reg.id}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{reg.nombre}</td>
                  <td className="py-4 px-6 text-gray-600">{reg.especie}</td>
                  <td className="py-4 px-6 text-gray-500">{reg.raza}</td>
                  <td className="py-4 px-6 text-gray-500">{reg.edad}</td>
                  <td className="py-4 px-6 text-emerald-800 font-semibold">{reg.propietario}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
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