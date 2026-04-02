import { Link } from 'react-router-dom'

const Validacion = () => {
  return (
    <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-[3rem] p-12 lg:p-20 text-center shadow-2xl border border-slate-100 space-y-10 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#EE6C4D]/5 blur-3xl rounded-full translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1ECCA7]/5 blur-3xl rounded-full -translate-x-16 translate-y-16"></div>

        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
            <span className="material-symbols-outlined text-emerald-500 text-5xl font-black" style={{fontVariationSettings: '"opsz" 48, "wght" 700'}}>verified</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-on-background">¡Perfil enviado con éxito!</h1>
            <p className="text-secondary font-medium leading-relaxed">
              Hemos recibido tus antecedentes. Nuestro equipo legal los revisará y activará tu cuenta en un plazo máximo de <span className="text-on-background font-bold underline decoration-[#EE6C4D] decoration-2 underline-offset-4">24 horas hábiles</span>.
            </p>
          </div>

          {/* Progress box */}
          <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Estado de validación</span>
              <span className="text-[#EE6C4D]">En revisión</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full w-[45%] abogado-gradient rounded-full animate-[shimmer_2s_infinite]"></div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <span className="material-symbols-outlined text-[#EE6C4D] text-sm" style={{fontVariationSettings: '"FILL" 1'}}>schedule</span>
              <p className="text-[10px] text-secondary font-medium leading-tight">Te enviaremos un correo electrónico a <b>juan@estudio.cl</b> una vez que hayamos verificado tus credenciales.</p>
            </div>
          </div>

          <div className="pt-6 w-full space-y-4">
            <Link to="/" className="block w-full py-5 bg-on-background text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg">
                Volver al inicio
            </Link>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">LegalPath Professional Series</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

export default Validacion
