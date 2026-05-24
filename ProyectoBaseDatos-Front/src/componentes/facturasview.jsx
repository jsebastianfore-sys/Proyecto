import React from 'react';
import { DollarSign, Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function FacturasView() {
  const datos = [
    { id: 'FAC-701', cliente: 'María García', concepto: 'Consulta Médica + Medicamentos', total: '$85.000', estado: 'Pagada' },
    { id: 'FAC-702', cliente: 'Juan Pérez', concepto: 'Vacunación Anual Felina', total: '$30.000', estado: 'Pendiente' }
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-emerald-800" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Facturas</h1>
          </div>
          <span className="text-sm text-gray-500 font-medium">{datos.length} transacciones este mes</span>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-800 text-white rounded-full font-semibold hover:bg-emerald-900 shadow-sm text-sm transition-all">
          <Plus className="w-4 h-4" />
          <span>Nueva factura</span>
        </button>
      </div>

      <div className="w-full max-w-xl relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Buscar facturas..." className="w-full pl-12 pr-4 py-3 bg-[#fafaf6] border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-700 font-medium text-gray-700 transition-colors" />
      </div>

      <div className="w-full bg-[#fafaf6] border border-gray-200/60 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200/60 text-xs font-bold text-gray-400 tracking-wider bg-gray-50/50">
                <th className="py-4 px-6">Nº FACTURA</th>
                <th className="py-4 px-6">CLIENTE</th>
                <th className="py-4 px-6">CONCEPTO</th>
                <th className="py-4 px-6">ESTADO</th>
                <th className="py-4 px-6">TOTAL</th>
                <th className="py-4 px-6 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-gray-700 divide-y divide-gray-100">
              {datos.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-400 font-mono text-xs">{reg.id}</td>
                  <td className="py-4 px-6 font-bold text-gray-800">{reg.cliente}</td>
                  <td className="py-4 px-6 text-gray-500">{reg.concepto}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${reg.estado === 'Pagada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                      {reg.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-800">{reg.total}</td>
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