import React from 'react';
import { Activity, Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function TratamientosView() {
  const datos = [
    { id: 'TRAT-01', mascota: 'Luna', tratamiento: 'Limpieza dental profunda', duracion: 'Sesión Única', estado: 'Completado' },
    { id: 'TRAT-02', mascota: 'Rocky', tratamiento: 'Fisioterapia pata trasera', duracion: '5 sesiones (2/5)', estado: 'En Curso' }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Activity className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Tratamientos</h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">{datos.length} procedimientos en ejecución</span>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all">
          <Plus className="w-4 h-4" />
          <span>Nuevo tratamiento</span>
        </button>
      </div>

      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Buscar tratamientos..." className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors" />
      </div>

      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">MASCOTA</th>
                <th className="py-4 px-6">PROCEDIMIENTO / TRATAMIENTO</th>
                <th className="py-4 px-6">DURACIÓN</th>
                <th className="py-4 px-6">ESTADO</th>
                <th className="py-4 px-6 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
              {datos.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-400 font-mono text-xs">{reg.id}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{reg.mascota}</td>
                  <td className="py-4 px-6 text-gray-600">{reg.tratamiento}</td>
                  <td className="py-4 px-6 text-gray-500">{reg.duracion}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${reg.estado === 'Completado' ? 'bg-gray-100 text-gray-700' : 'bg-emerald-50 text-emerald-800'}`}>
                      {reg.estado}
                    </span>
                  </td>
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