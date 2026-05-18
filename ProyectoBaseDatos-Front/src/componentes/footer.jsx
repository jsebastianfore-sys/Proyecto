import React from 'react';
import { PawPrint } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#f4f3ea] py-8 border-t border-gray-200/50">
      {/* Usamos px-4 para móvil, pero md:px-8 o md:px-12 para estirarlo en PC sin romper nada */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 font-medium px-6 md:px-12">
        
        {/* SECCIÓN IZQUIERDA */}
        <div className="flex items-center gap-2">
          <PawPrint className="w-4 h-4 text-emerald-700" />
          <span>© 2026 Huellitas Veterinaria</span>
        </div>

        {/* SECCIÓN DERECHA */}
        <div className="text-center sm:text-right">
          <p>Cuidando a tu mejor amigo con amor y dedicación.</p>
        </div>

      </div>
    </footer>
  );
}