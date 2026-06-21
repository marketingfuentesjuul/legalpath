import React from 'react';

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100/50 text-center animate-in zoom-in-95 duration-200 flex flex-col items-center relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Cerrar"
        >
          <span className="material-symbols-outlined text-[20px] block">close</span>
        </button>

        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
          <span className="material-symbols-outlined text-[36px]">warning</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-extrabold text-slate-800 mb-3">
          ¿Eliminar caso?
        </h3>

        {/* Message */}
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
          ¿Está seguro de que desea eliminar su caso? En caso de que desee eliminarlo, este no podrá ser recuperado y tendrá que e ingresarlo nuevamente en caso de que desee retomarlo.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-5 rounded-xl text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 px-5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Eliminando...</span>
              </>
            ) : (
              <span>Sí, Eliminar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
