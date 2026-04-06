import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const TYPING_TEXT = "Necesito ayuda con un contrato de arriendo que no se ha cumplido. El arrendatario no ha pagado en 3 meses y necesito asesoría para..."

const PublicarCaso = () => {
  const [step, setStep] = useState(1)
  const [caseText, setCaseText] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [confirmedEmail, setConfirmedEmail] = useState('')
  const [typingText, setTypingText] = useState('')
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  const typingRef = useRef({ i: 0, active: true, timeout: null })

  const titles = {
    1: { main: <>Describe con <span className="text-[#1ECCA7]">detalle</span> tu caso</>, sub: 'Mientras más detalles nos des, mejores propuestas recibirás. Si quieres, puedes agregarle imágenes, pantallazos, correos o todo lo que estimes conveniente para poder ayudarnos a entender tu caso.' },
    2: { main: <>Ingresa como visitante o como <span className="text-[#1ECCA7]">usuario</span></>, sub: 'Crea una cuenta para acceder a todas las funcionalidades, o continúa como invitado para publicar tu caso rápidamente.' },
    3: { main: <>Caso <span className="text-[#1ECCA7]">publicado</span></>, sub: 'Tu caso ha sido publicado exitosamente. Pronto recibirás propuestas de abogados especializados.' }
  }

  useEffect(() => {
    if (step !== 1) return
    const state = typingRef.current
    state.active = true
    state.i = 0
    setTypingText('')

    const typeChar = () => {
      if (!state.active) return
      if (state.i < TYPING_TEXT.length) {
        setTypingText(TYPING_TEXT.slice(0, state.i + 1))
        state.i++
        state.timeout = setTimeout(typeChar, 35 + Math.random() * 45)
      } else {
        state.timeout = setTimeout(() => {
          if (!state.active) return
          state.i = 0
          setTypingText('')
          typeChar()
        }, 5000)
      }
    }

    state.timeout = setTimeout(typeChar, 1000)
    return () => {
      state.active = false
      clearTimeout(state.timeout)
    }
  }, [step])

  const handleTextareaFocus = () => {
    setShowPlaceholder(false)
    typingRef.current.active = false
    clearTimeout(typingRef.current.timeout)
  }
  const handleTextareaBlur = () => {
    if (!caseText) {
      setShowPlaceholder(true)
      typingRef.current.active = true
      typingRef.current.i = 0
      setTypingText('')
    }
  }

  const goToStep2 = () => {
    if (!caseText.trim()) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep(2)
  }
  const goToStep1 = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(1) }
  const goToStep3 = () => {
    if (!guestEmail || !guestEmail.includes('@')) {
      document.getElementById('guest-email-input')?.focus()
      return
    }
    setConfirmedEmail(guestEmail)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setStep(3)
  }

  const progressWidth = step === 1 ? '25%' : step === 2 ? '50%' : '100%'

  const stepCircleClass = (n) =>
    step >= n
      ? 'w-10 h-10 rounded-full bg-primary-container text-white font-bold flex items-center justify-center text-sm shadow-[0_4px_15px_rgba(30,204,167,0.4)] transition-all duration-500'
      : 'w-10 h-10 rounded-full bg-slate-100/80 text-slate-400 font-bold flex items-center justify-center text-sm border border-slate-200 transition-all duration-500'

  const stepLabelClass = (n) =>
    step >= n
      ? 'text-[13px] font-bold text-on-background text-center max-w-[160px] leading-[1.2] transition-all duration-300'
      : 'text-[13px] font-medium text-slate-400 text-center max-w-[160px] leading-[1.2] transition-all duration-300'

  return (
    <div className="pb-20 min-h-screen flex flex-col justify-center relative overflow-hidden">
      <style>{`
        #progress-fill { transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .social-btn { transition: all 0.2s ease; }
        .social-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
        .benefit-item { transition: all 0.2s ease; }
        .benefit-item:hover { transform: translateX(4px); }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-b from-[#e0e8ff]/80 via-[#f1f3ff] to-[#f9f9ff] -z-10"></div>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary-container/20 blur-[130px] rounded-full -z-10"></div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 relative z-10 mt-16">

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-[3.5rem] leading-tight font-extrabold tracking-tight text-[#141b2c] mb-4 font-headline">
            {titles[step].main}
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-medium">{titles[step].sub}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-14 shadow-[0_15px_50px_-10px_rgba(0,107,86,0.08)] border border-[#e0e8ff]/80">

          {/* Steps Indicator */}
          <div className="flex items-start justify-between relative mb-14 max-w-3xl mx-auto">
            <div className="absolute top-[20px] left-[5%] w-[90%] h-[3px] bg-slate-200 rounded-full overflow-hidden">
              <div id="progress-fill" className="h-full bg-[#1ECCA7]" style={{ width: progressWidth }}></div>
            </div>
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className={stepCircleClass(1)}>1</div>
              <span className={stepLabelClass(1)}>Describe el caso</span>
            </div>
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className={stepCircleClass(2)}>2</div>
              <span className={stepLabelClass(2)}>Ingresa como visitante o como usuario</span>
            </div>
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className={stepCircleClass(3)}>3</div>
              <span className={stepLabelClass(3)}>Caso publicado</span>
            </div>
          </div>

          {/* Steps Content */}
          <div className="relative max-w-4xl mx-auto" style={{ minHeight: '400px' }}>

            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <div className="relative group mt-2 mb-8">
                  {showPlaceholder && !caseText && (
                    <div className="absolute inset-0 px-8 py-6 pointer-events-none text-[13px] md:text-[15px] text-slate-400 font-medium leading-[1.6] opacity-65 blur-[0.4px]">
                      <span>{typingText}</span>
                      <span className="inline-block w-[2px] h-[1.2em] bg-slate-400 align-text-bottom ml-1 animate-pulse"></span>
                    </div>
                  )}
                  <textarea
                    rows={4}
                    value={caseText}
                    onChange={e => setCaseText(e.target.value)}
                    onFocus={handleTextareaFocus}
                    onBlur={handleTextareaBlur}
                    className="w-full bg-transparent border-[1.5px] border-slate-200 focus:border-[#1ECCA7]/60 focus:ring-4 focus:ring-[#1ECCA7]/10 rounded-[2.5rem] px-8 py-6 text-[13px] md:text-[15px] leading-[1.6] text-on-background font-medium resize-none transition-all outline-none placeholder-transparent relative z-10 shadow-sm hover:border-slate-300/80 hover:shadow-md"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                  <button className="flex items-center gap-3 py-3 px-5 -ml-3 rounded-2xl border-2 border-transparent border-dashed hover:border-slate-200 hover:bg-slate-50 transition-all text-slate-500 hover:text-on-background group text-left">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">attach_file</span>
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[15px] font-bold">Adjuntar documentos</span>
                      <span className="text-[13px] text-slate-400 font-medium">(imágenes, pantallazos, PDF)</span>
                    </div>
                  </button>
                  <button onClick={goToStep2} className="mint-gradient text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-[0_15px_30px_rgba(30,204,167,0.3)] hover:-translate-y-1 transition-all text-[16px] flex items-center justify-center gap-2">
                    Siguiente paso
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* LEFT: Register */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl md:text-[28px] font-extrabold text-on-background tracking-tight font-headline">Crea tu cuenta</h2>
                    <p className="text-[14px] text-slate-500 mt-2 leading-relaxed font-medium">Regístrate para acceder a todas las funcionalidades de LegalPath.</p>
                  </div>
                  <div className="space-y-3">
                    <button className="social-btn w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white border-[1.5px] border-slate-200 rounded-2xl font-semibold text-[15px] text-on-background hover:bg-slate-50">
                      <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                      Continuar con Google
                    </button>
                    <button className="social-btn w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-[#1877F2] border-[1.5px] border-[#1877F2] rounded-2xl font-semibold text-[15px] text-white hover:bg-[#166FE5]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Continuar con Facebook
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="text-[13px] text-slate-400 font-medium">o regístrate con tu correo</span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-bold text-on-background mb-1.5">Nombre completo</label>
                      <input type="text" placeholder="Ej: Juan Pérez" className="w-full py-3 px-5 rounded-xl border-[1.5px] border-slate-200 text-[15px] font-medium focus:border-[#1ECCA7] focus:ring-2 focus:ring-[#1ECCA7]/20 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-on-background mb-1.5">Correo electrónico</label>
                      <input type="email" placeholder="tu@correo.com" className="w-full py-3 px-5 rounded-xl border-[1.5px] border-slate-200 text-[15px] font-medium focus:border-[#1ECCA7] focus:ring-2 focus:ring-[#1ECCA7]/20 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-on-background mb-1.5">Contraseña</label>
                      <input type="password" placeholder="••••••••" className="w-full py-3 px-5 rounded-xl border-[1.5px] border-slate-200 text-[15px] font-medium focus:border-[#1ECCA7] focus:ring-2 focus:ring-[#1ECCA7]/20 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                    <button className="w-full mint-gradient text-white py-4 rounded-full font-bold text-[16px] shadow-lg hover:shadow-[0_15px_30px_rgba(30,204,167,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                      Crear cuenta y publicar caso
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                  </div>
                  <div className="bg-[#f0fdf9] border border-[#1ECCA7]/20 rounded-2xl p-5 space-y-3">
                    <p className="text-[13px] font-bold text-[#006b56] uppercase tracking-wider">Beneficios de crear tu cuenta</p>
                    <div className="space-y-2.5">
                      {[
                        'Acceso a todas las funcionalidades del sistema',
                        'Contacto directo con el abogado',
                        'Gestión digital de documentos y evidencias',
                        'Máxima protección y respaldo de LegalPath'
                      ].map((b, i) => (
                        <div key={i} className="benefit-item flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-[#1ECCA7] text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                          <span className="text-[13px] text-[#141b2c] font-medium">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Guest */}
                <div className="space-y-6">
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-8 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px] text-slate-500">person_outline</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-on-background tracking-tight font-headline">Continuar como invitado</h3>
                        <p className="text-[12px] text-slate-400 font-medium">Acceso limitado</p>
                      </div>
                    </div>
                    <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
                      Si prefieres no crear una cuenta, puedes publicar tu caso ingresando solo tu correo electrónico. Lo usaremos <strong className="text-on-background">únicamente para notificarte</strong> cuando un abogado te contacte.
                    </p>
                    <div>
                      <label className="block text-[13px] font-bold text-on-background mb-1.5">Correo electrónico</label>
                      <input id="guest-email-input" type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="tu@correo.com" className="w-full py-3 px-5 rounded-xl border-[1.5px] border-slate-200 bg-white text-[15px] font-medium focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                    <div className="flex items-start gap-2.5 bg-amber-50/80 border border-amber-200/50 rounded-xl p-3.5">
                      <span className="material-symbols-outlined text-amber-500 text-[18px] mt-0.5">info</span>
                      <p className="text-[12px] text-amber-700 leading-relaxed font-medium">Tu correo será utilizado exclusivamente para enviarte notificaciones cuando un abogado responda a tu caso. No compartimos tu información.</p>
                    </div>
                    <button onClick={goToStep3} className="w-full bg-white text-on-background border-[1.5px] border-slate-200 py-3.5 rounded-full font-bold text-[15px] hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                      Publicar como invitado
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                  </div>
                  <button onClick={goToStep1} className="flex items-center gap-2 text-[14px] text-slate-400 font-semibold hover:text-on-background transition-colors ml-1">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Volver al paso anterior
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-8">
                <div className="w-24 h-24 rounded-full bg-[#f0fdf9] border-2 border-[#1ECCA7]/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#1ECCA7] text-[48px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                </div>
                <div className="space-y-4 max-w-lg">
                  <h2 className="text-2xl md:text-[32px] font-extrabold text-on-background tracking-tight font-headline leading-tight">¡Tu caso ha sido <span className="text-[#1ECCA7]">publicado</span>!</h2>
                  <p className="text-[16px] text-slate-500 leading-relaxed font-medium">
                    Muchas gracias por haber publicado tu caso con nosotros. Te notificaremos vía correo electrónico cuando un abogado haya postulado para poder llevar tu caso.
                  </p>
                </div>
                <div className="bg-[#f0fdf9] border border-[#1ECCA7]/20 rounded-2xl px-8 py-5 inline-flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#1ECCA7] text-[22px]" style={{ fontVariationSettings: '"FILL" 1' }}>mail</span>
                  <p className="text-[14px] text-[#006b56] font-semibold">Las notificaciones llegarán a: <span className="text-[#141b2c]">{confirmedEmail}</span></p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/" className="mint-gradient text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-[0_15px_30px_rgba(30,204,167,0.3)] hover:-translate-y-1 transition-all text-[16px] flex items-center justify-center gap-2">
                    Volver al inicio
                    <span className="material-symbols-outlined text-[20px]">home</span>
                  </Link>
                  <button onClick={() => { setStep(1); setCaseText(''); setGuestEmail(''); setConfirmedEmail('') }} className="bg-white text-on-background border-[1.5px] border-slate-200 px-8 py-4 rounded-full font-bold text-[16px] hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                    Publicar otro caso
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicarCaso
