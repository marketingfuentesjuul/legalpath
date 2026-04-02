import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ProgressBar = ({ step }) => {
  return (
    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden flex gap-1">
      {[1, 2, 3].map((s) => (
        <div 
          key={s} 
          className={`h-full flex-1 transition-all duration-500 rounded-full ${
            s <= step ? 'bg-primary-container' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

const PublicarCaso = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [caseDescription, setCaseDescription] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const typingRef = useRef(null)

  const validateEmail = (email) => {
    // RFC 5322 compliant regex
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)
  }

  const handleNextStep = () => {
    if (step === 1 && !caseDescription.trim()) {
      setError('Por favor, describe tu caso para continuar.')
      return
    }
    setError('')
    setStep(step + 1)
  }

  const handleGuestPublish = (e) => {
    e.preventDefault()
    if (!validateEmail(guestEmail)) {
      setError('Por favor, ingresa un correo electrónico válido.')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setStep(3)
    }, 1500)
  }

  return (
    <div className="min-h-[80vh] py-12 px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {step < 3 && (
          <div className="mb-12 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-primary-container mb-2 block">Paso {step} de 2</span>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-background">
                  {step === 1 ? 'Cuéntanos tu caso' : 'Tu información de contacto'}
                </h1>
              </div>
              <span className="text-sm font-bold text-slate-400">{step === 1 ? '50%' : '100%'}</span>
            </div>
            <ProgressBar step={step} />
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
              <label className="text-sm font-bold text-on-background block ml-1">Describe tu situación legal con el mayor detalle posible:</label>
              <textarea 
                className="w-full min-h-[200px] p-8 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-primary-container focus:bg-white outline-none transition-all font-medium text-lg leading-relaxed placeholder:text-slate-300"
                placeholder="Ej: Necesito ayuda con un contrato de arriendo que no se ha cumplido. El arrendatario no ha pagado en 3 meses y necesito asesoría para iniciar el proceso de desalojo..."
                value={caseDescription}
                onChange={(e) => setCaseDescription(e.target.value)}
              />
              {error && <p className="text-sm text-red-500 font-bold ml-1">{error}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-container/30 transition-all cursor-pointer group bg-slate-50/50">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary-container group-hover:scale-110 transition-all">attach_file</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Adjuntar documentos</span>
              </div>
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary-container/30 transition-all cursor-pointer group bg-slate-50/50">
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary-container group-hover:scale-110 transition-all">photo_camera</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Subir fotos</span>
              </div>
            </div>

            <button 
              onClick={handleNextStep}
              className="w-full py-5 mint-gradient text-white font-black rounded-2xl shadow-xl shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all text-xl"
            >
              Siguiente paso
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-on-background">Continuar como invitado</h3>
                  <p className="text-xs text-secondary leading-relaxed">No necesitas crear una cuenta ahora. Solo ingresa tu email para recibir las propuestas de los abogados.</p>
                </div>
                
                <form onSubmit={handleGuestPublish} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tu correo electrónico</label>
                    <input 
                      type="email" 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-container focus:bg-white outline-none transition-all font-medium" 
                      placeholder="ejemplo@correo.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500 font-bold ml-1">{error}</p>}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-on-background text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Enviando...
                      </>
                    ) : (
                      'Publicar mi caso'
                    )}
                  </button>
                </form>
              </div>

              <div className="bg-primary-container rounded-[2.5rem] p-10 text-on-primary-container flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="space-y-6 relative z-10">
                  <h3 className="text-2xl font-black leading-tight">Crea tu cuenta de LegalPath</h3>
                  <p className="text-sm font-medium opacity-90 leading-relaxed">Gestiona tus propuestas, chatea con abogados y mantén el historial de tus casos en un solo lugar.</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-xs font-bold bg-white/20 px-4 py-2 rounded-full w-fit">
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      Gestión más rápida
                    </li>
                    <li className="flex items-center gap-2 text-xs font-bold bg-white/20 px-4 py-2 rounded-full w-fit">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      Mayor seguridad
                    </li>
                  </ul>
                </div>
                <Link to="/auth/registro" className="w-full py-4 bg-white text-primary-container font-black rounded-2xl shadow-lg hover:bg-slate-50 transition-colors text-center mt-8 relative z-10">
                  Registrarme ahora
                </Link>
              </div>
            </div>
            
            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-slate-400 font-bold hover:text-on-background transition-colors mx-auto"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a la descripción
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-[3rem] p-12 lg:p-20 text-center shadow-2xl border border-slate-100 space-y-10 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
              <span className="material-symbols-outlined text-emerald-500 text-5xl font-black" style={{fontVariationSettings: '"opsz" 48, "wght" 700'}}>verified</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-on-background">¡Caso publicado con éxito!</h1>
              <p className="text-secondary font-medium leading-relaxed max-w-sm mx-auto">
                Tu caso ha sido enviado a nuestra red de abogados expertos. Recibirás las propuestas en tu correo <span className="text-on-background font-bold underline decoration-primary-container decoration-2 underline-offset-4">{guestEmail || 'su@correo.com'}</span>.
              </p>
            </div>

            <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4 text-left">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Estado del Proceso</span>
                <span className="text-primary-container">Enviando a Expertos</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-[35%] bg-primary-container rounded-full"></div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-tight italic">
                * Las primeras propuestas suelen llegar en menos de 12 horas.
              </p>
            </div>

            <div className="pt-6 space-y-4">
              <Link to="/" className="block w-full py-5 bg-on-background text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-lg">
                Volver al inicio
              </Link>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest tracking-[0.2em]">LegalPath Service Platform</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicarCaso
