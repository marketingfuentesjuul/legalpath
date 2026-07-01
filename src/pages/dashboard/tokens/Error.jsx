// src/pages/dashboard/tokens/Error.jsx
import { useNavigate } from 'react-router-dom'

export default function TokenError() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100">

        {/* Ícono de error */}
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-100">
          <span className="material-symbols-outlined text-[36px]">cancel</span>
        </div>

        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
          El pago no se completó
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-2">
          La transacción fue cancelada o rechazada. No se realizó ningún cargo.
        </p>
        <p className="text-slate-400 text-xs font-semibold mb-8">
          Si el problema persiste, escríbenos a hola@legalpath.cl
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#EE6C4D] text-white py-4 rounded-2xl font-bold hover:bg-[#d95e41] transition-all shadow-md hover:shadow-lg"
          >
            Intentar nuevamente
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-slate-500 py-2 text-sm font-bold hover:text-slate-700 transition-colors"
          >
            Volver al dashboard
          </button>
        </div>

      </div>
    </div>
  )
}
