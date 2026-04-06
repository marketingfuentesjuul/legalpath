import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here we would validate and login
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-4">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e0e8ff]/80 via-[#f1f3ff] to-[#f9f9ff] -z-10"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#EE6C4D]/15 blur-[120px] rounded-full -z-10"></div>

      {/* Main Container */}
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_15px_50px_-10px_rgba(238,108,77,0.1)] border border-slate-100">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#141b2c] mb-2 font-headline">
              Bienvenido de vuelta
            </h1>
            <p className="text-[14px] text-secondary font-medium">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button type="button" className="w-full flex items-center justify-center gap-3 border border-slate-300 rounded-xl px-4 py-3 bg-white hover:bg-slate-50 transition-colors shadow-sm font-semibold text-[14px] text-slate-700">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Ingresar con Google
            </button>
            <button type="button" className="w-full flex items-center justify-center gap-3 border-[#1877F2] rounded-xl px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] transition-colors shadow-sm font-semibold text-[14px] text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Ingresar con Facebook
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-t border-slate-200" />
            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">O con tu correo</span>
            <hr className="flex-1 border-t border-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-on-background mb-1.5">Correo electrónico</label>
              <input 
                type="email" 
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@correo.com" 
                className="w-full py-3 px-4 rounded-xl border-[1.5px] border-slate-200 text-[14px] font-medium focus:border-[#EE6C4D] focus:ring-2 focus:ring-[#EE6C4D]/20 outline-none transition-all placeholder:text-slate-300"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[13px] font-bold text-on-background">Contraseña</label>
                <a href="#" className="text-[12px] font-bold text-[#EE6C4D] hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <input 
                type="password" 
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full py-3 px-4 rounded-xl border-[1.5px] border-slate-200 text-[14px] font-medium focus:border-[#EE6C4D] focus:ring-2 focus:ring-[#EE6C4D]/20 outline-none transition-all placeholder:text-slate-300"
                required
              />
            </div>
            
            <button type="submit" className="w-full mt-4 bg-[#EE6C4D] text-white py-3.5 rounded-full font-bold text-[15px] shadow-[0_8px_20px_rgba(238,108,77,0.25)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(238,108,77,0.35)] transition-all flex justify-center items-center gap-2">
              Ingresar a mi cuenta
              <span className="material-symbols-outlined text-[18px]">login</span>
            </button>
          </form>

        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-[14px] font-medium text-secondary hover:text-[#141b2c] transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login
