import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Registro = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateEmail = (email) => {
    // RFC 5322 compliant regex
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)
  }

  const validatePassword = (password) => {
    // At least 8 characters, one letter and one number
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(password)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(formData.email)) {
      setError('Por favor, ingresa un correo electrónico válido.')
      return
    }

    if (!validatePassword(formData.password)) {
      setError('La contraseña debe tener al menos 8 caracteres, incluir una letra y un número.')
      return
    }
    
    // Store in transition storage (temporary)
    sessionStorage.setItem('temp_user_data', JSON.stringify({
      nombre: formData.nombre,
      email: formData.email
    }))
    
    navigate('/auth/perfil')
  }

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Visual side */}
      <div className="hidden lg:flex lg:w-1/2 abogado-gradient p-20 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
        <div className="relative z-10">
          <Link to="/">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-10 w-auto brightness-0 invert" />
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-6xl font-black tracking-tight leading-tight">Únete a la red legal más grande de Chile.</h1>
          <p className="text-xl opacity-80 max-w-md font-medium">Digitaliza tu práctica jurídica, accede a cientos de clientes y gestiona tus casos en un solo lugar.</p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
          </div>
          <p className="text-sm font-bold">+2000 abogados ya confían en nosotros</p>
        </div>
      </div>

      {/* Form side */}
      <div className="w-full lg:w-1/2 bg-white p-8 lg:p-24 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-background">Crear cuenta</h2>
            <p className="text-secondary font-medium">¿Ya tienes cuenta? <Link to="/auth/registro" className="text-[#EE6C4D] font-bold hover:underline">Inicia sesión aquí</Link></p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3.5 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors font-bold text-sm">
                <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" className="w-5 h-5" alt="Google" />
                Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3.5 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors font-bold text-sm text-[#1877F2]">
                <img src="https://www.vectorlogo.zone/logos/facebook/facebook-f.svg" className="w-5 h-5" alt="Facebook" />
                Facebook
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full h-px bg-slate-100"></div>
            <span className="absolute bg-white px-4 text-xs font-bold text-slate-300 uppercase tracking-widest">o usa tu correo</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Nombre completo</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#EE6C4D] focus:bg-white outline-none transition-all font-medium" 
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email profesional</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#EE6C4D] focus:bg-white outline-none transition-all font-medium" 
                placeholder="juan@estudio.cl"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Contraseña</label>
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#EE6C4D] focus:bg-white outline-none transition-all font-medium" 
                placeholder="••••••••"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1 ml-1 italic">Mínimo 8 caracteres, 1 número y 1 letra.</p>
            </div>

            <div className="flex items-start gap-3 px-1">
                <input type="checkbox" className="mt-1 accent-[#EE6C4D]" required id="terms" />
                <label htmlFor="terms" className="text-xs text-secondary leading-relaxed">Al registrarme, acepto los <a href="#" className="text-[#EE6C4D] font-bold">Términos de Servicio</a> y la <a href="#" className="text-[#EE6C4D] font-bold">Política de Privacidad</a> de LegalPath.</label>
            </div>

            <button type="submit" className="w-full py-5 abogado-gradient text-white font-black rounded-2xl shadow-xl shadow-[#EE6C4D]/20 hover:scale-[1.02] active:scale-95 transition-all text-lg">
                Crear mi cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Registro
