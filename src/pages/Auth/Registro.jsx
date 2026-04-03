import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Registro = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', terms: false })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { firstName, lastName, email, password, terms } = form
    if (!firstName || !lastName || !email || !password || !terms) return
    if (password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    sessionStorage.setItem('lp_firstName', firstName)
    sessionStorage.setItem('lp_lastName', lastName)
    sessionStorage.setItem('lp_email', email)
    navigate('/auth/perfil')
  }

  return (
    <div className="antialiased min-h-screen flex bg-background">
      {/* Left Side: Branding */}
      <div className="hidden lg:flex w-1/2 bg-surface text-on-background relative flex-col items-center pt-[15vh] p-12 overflow-hidden border-r border-slate-200/60">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EE6C4D]/5 pointer-events-none"></div>
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#EE6C4D] rounded-full blur-[100px] opacity-[0.05] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[480px] flex flex-col gap-10 xl:gap-12 py-10">
          <div className="flex items-end gap-2">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-9 w-auto" />
            <span className="text-secondary font-medium text-[16px] mb-0.5 tracking-tight">Abogados</span>
          </div>

          <div>
            <h1 className="text-4xl lg:text-[44px] font-extrabold tracking-tighter leading-[1.1] mb-6">
              El ecosistema diseñado para hacer crecer <span className="text-[#EE6C4D]">tu práctica legal</span>.
            </h1>
            <p className="text-lg text-secondary leading-relaxed">
              Únete a la red donde los clientes calificados vienen a ti. Olvídate del marketing y enfócate en lo que mejor haces: <b>resolver casos</b>.
            </p>
            <div className="space-y-4 mt-8">
              {[
                'Acceso a cientos de casos pre-filtrados al mes.',
                'Sistema Just-in-Time: paga sólo por los prospectos que eliges.',
                'Herramientas gratuitas para gestión y seguimiento de cartera.'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EE6C4D]/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#EE6C4D] text-[12px]">check</span>
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/60 p-4 rounded-xl border border-slate-200/50 backdrop-blur-md w-fit shadow-sm">
            <div className="flex -space-x-2">
              <img src="https://ui-avatars.com/api/?name=Dr+C&background=1ecca7&color=fff&size=32" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
              <img src="https://ui-avatars.com/api/?name=Abog&background=EE6C4D&color=fff&size=32" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">+2k</div>
            </div>
            <div className="text-[11px] text-secondary font-medium leading-tight">
              Más de <span className="font-bold text-on-background">2,000 profesionales</span> ya confían en LegalPath.
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex justify-center pt-[15vh] p-6 sm:p-12 relative overflow-y-auto bg-white">
        <div className="absolute top-6 left-6 lg:hidden flex items-end gap-2">
          <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-7 w-auto" />
          <span className="text-secondary font-medium text-xs mb-0.5 tracking-tight">Abogados</span>
        </div>

        <div className="w-full max-w-md mt-10 md:mt-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-[30px] font-extrabold tracking-tight text-on-background mb-2">Comienza ahora.</h2>
            <p className="text-sm text-secondary">Crea tu cuenta profesional y recibe acceso inmediato al panel de casos.</p>
          </div>

          <div className="space-y-3 mb-6">
            <button type="button" className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl px-4 py-3 bg-white hover:bg-slate-50 transition-colors shadow-sm focus:ring-2 focus:ring-[#EE6C4D]/20 focus:outline-none">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Logo" className="w-5 h-5" />
              <span className="text-[14px] font-bold text-slate-700">Registrarse con Google</span>
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl px-4 py-3 bg-white hover:bg-slate-50 transition-colors shadow-sm focus:ring-2 focus:ring-[#EE6C4D]/20 focus:outline-none">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook Logo" className="w-5 h-5" />
              <span className="text-[14px] font-bold text-slate-700">Registrarse con Facebook</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-t border-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">O continúa con tu mail</span>
            <hr className="flex-1 border-t border-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="block text-[13px] font-bold text-on-background">Nombre(s) <span className="text-[#EE6C4D]">*</span></label>
                <input type="text" id="firstName" name="firstName" required autoComplete="given-name" maxLength={80} value={form.firstName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="Ej. Ignacio" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="block text-[13px] font-bold text-on-background">Apellidos <span className="text-[#EE6C4D]">*</span></label>
                <input type="text" id="lastName" name="lastName" required autoComplete="family-name" maxLength={80} value={form.lastName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="Ej. Torres" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[13px] font-bold text-on-background">Correo electrónico <span className="text-[#EE6C4D]">*</span></label>
              <input type="email" id="email" name="email" required autoComplete="email" maxLength={254} value={form.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="tucorreo@ejemplo.com" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[13px] font-bold text-on-background">Contraseña <span className="text-[#EE6C4D]">*</span></label>
              <input type="password" id="password" name="password" required autoComplete="new-password" maxLength={128} minLength={8} value={form.password} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="••••••••" />
            </div>
            <div className="flex items-start gap-2 pt-2">
              <input id="terms" name="terms" type="checkbox" required checked={form.terms} onChange={handleChange} className="mt-1 h-4 w-4 bg-slate-50 border-slate-300 rounded text-[#EE6C4D] focus:ring-[#EE6C4D]" />
              <label htmlFor="terms" className="text-[12px] text-secondary leading-snug">
                Al registrarme, acepto los <a href="#" className="font-bold text-[#EE6C4D] hover:underline">Términos de Servicio</a> y la <a href="#" className="font-bold text-[#EE6C4D] hover:underline">Política de Privacidad</a> de LegalPath. Confirmo que soy un profesional legal debidamente habilitado.
              </label>
            </div>
            <button type="submit" className="w-full mt-6 abogado-gradient text-white py-3.5 rounded-xl font-bold text-[15px] shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex justify-center items-center gap-2">
              Completar primer paso <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <div className="mt-8 text-center text-[13px] text-secondary">
            ¿Ya tienes una cuenta? <a href="#" className="font-bold text-on-background hover:text-[#EE6C4D] underline decoration-2 underline-offset-2 transition-colors">Iniciar sesión aquí</a>.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registro
