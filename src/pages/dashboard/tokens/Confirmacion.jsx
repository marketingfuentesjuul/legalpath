// src/pages/dashboard/tokens/Confirmacion.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabaseClient'

export default function TokenConfirmacion() {
  const navigate = useNavigate()
  const [saldo, setSaldo] = useState(null)

  useEffect(() => {
    // Esperar 2 segundos para que el webhook procese y luego leer el saldo
    const timer = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: ledger } = await supabase
        .from('token_ledger')
        .select('amount')
        .eq('lawyer_id', user.id)

      if (ledger) {
        const balance = ledger.reduce((acc, curr) => acc + curr.amount, 0)
        setSaldo(balance)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100">

        {/* Ícono de éxito */}
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 border border-emerald-100 shadow-sm">
          <span className="material-symbols-outlined text-[36px]">check_circle</span>
        </div>

        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
          ¡Pago exitoso!
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
          Tus tokens han sido acreditados y ya puedes comenzar a enviar propuestas.
        </p>

        {saldo !== null && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-8 shadow-sm">
            <p className="text-xs text-orange-600 font-extrabold uppercase tracking-wider mb-1">Saldo actual</p>
            <p className="text-4xl font-black text-orange-500 tracking-tight">{saldo}</p>
            <p className="text-xs text-orange-600 font-semibold mt-1">tokens disponibles</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#EE6C4D] text-white py-4 rounded-2xl font-bold hover:bg-[#d55e42] transition-all shadow-md hover:shadow-lg"
          >
            Volver al dashboard
          </button>
        </div>

      </div>
    </div>
  )
}
