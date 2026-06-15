import React from 'react';

export default function AdminLoading({ text = 'Cargando...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 w-full text-center">
      <div className="relative flex flex-col items-center justify-center">
        {/* Círculo celeste de carga alrededor del logo */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* El spinner circular celeste con un track sutil */}
          <div className="absolute inset-0 border-4 border-sky-400/20 border-t-sky-400 rounded-full animate-spin"></div>
          {/* El logo en el centro */}
          <img
            src="/assets/images/logo-loading.png"
            alt="LegalPath Logo"
            className="w-16 h-16 object-contain relative z-10"
          />
        </div>
        <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mt-6 animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
}
