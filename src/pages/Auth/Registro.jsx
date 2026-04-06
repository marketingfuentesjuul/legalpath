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
      <div className="hidden lg:flex w-1/2 bg-[#EE6C4D] text-white relative flex-col justify-between p-20 xl:p-28 overflow-hidden">
        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <img src="/assets/images/logo-white.png" alt="LegalPath Logo" className="h-10 w-auto" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] mb-8 max-w-xl">
            Únete a la red legal más grande de Chile.
          </h1>
          <p className="text-lg xl:text-xl opacity-90 leading-relaxed font-medium max-w-md">
            Digitaliza tu práctica jurídica, accede a cientos de clientes y gestiona tus casos en un solo lugar.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-12 h-12 rounded-full border-4 border-[#EE6C4D] bg-slate-200 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=A+B&background=cbd5e1&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#EE6C4D] bg-slate-300 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=C+D&background=94a3b8&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#EE6C4D] bg-slate-400 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=X+Y&background=64748b&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <p className="text-sm font-bold opacity-90">+2000 abogados ya confían en nosotros</p>
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
