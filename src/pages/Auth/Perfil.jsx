import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Perfil = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({ nombre: '', email: '' })
  const [rutValue, setRutValue] = useState('')
  const [rutError, setRutError] = useState('')

  useEffect(() => {
    const data = sessionStorage.getItem('temp_user_data')
    if (!data) {
    //   navigate('/auth/registro')
    } else {
      setUserData(JSON.parse(data))
    }
  }, [navigate])

  const validateRut = (rut) => {
    if (!rut || rut.length < 8) return false
    
    // Remove dots and dash
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()
    if (cleanRut.length < 8) return false
    
    const body = cleanRut.slice(0, -1)
    const dv = cleanRut.slice(-1)
    
    // Modulus 11 validation
    let sum = 0
    let multiplier = 2
    
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier
        multiplier = multiplier === 7 ? 2 : multiplier + 1
    }
    
    const expectedDv = 11 - (sum % 11)
    let dvChar = ''
    if (expectedDv === 11) dvChar = '0'
    else if (expectedDv === 10) dvChar = 'K'
    else dvChar = expectedDv.toString()
    
    return dvChar === dv
  }

  const handleRutChange = (e) => {
    let val = e.target.value.replace(/[^0-9kK-]/g, '')
    setRutValue(val)
    if (val && !validateRut(val)) {
        setRutError('RUT no válido')
    } else {
        setRutError('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rutValue && !validateRut(rutValue)) {
        setRutError('Por favor, ingresa un RUT válido antes de continuar.')
        return
    }

    // Clear temporary data upon completion
    sessionStorage.removeItem('temp_user_data')
    navigate('/auth/validacion')
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] py-12 px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link to="/">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200"></div>
            <div>
              <p className="text-sm font-bold leading-none">{userData.nombre || 'Abogado Profesional'}</p>
              <p className="text-[10px] text-secondary">{userData.email || 'perfil@estudio.cl'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-on-background">Completa tu perfil profesional</h1>
          <p className="text-secondary font-medium">Necesitamos validar tu identidad y antecedentes para que puedas empezar a recibir casos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Bloque 1: Información Personal */}
          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EE6C4D]/10 flex items-center justify-center text-[#EE6C4D]">
                <span className="material-symbols-outlined">person</span>
              </div>
              <h3 className="text-xl font-bold">1. Información Personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">RUT</label>
                <input 
                    type="text" 
                    value={rutValue}
                    onChange={handleRutChange}
                    className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-2xl focus:bg-white outline-none transition-all font-medium ${rutError ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-[#EE6C4D]'}`} 
                    placeholder="12.345.678-9" 
                    required
                />
                {rutError && <p className="text-[10px] text-red-500 ml-1 font-bold">{rutError}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Teléfono de contacto</label>
                <input type="tel" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#EE6C4D] focus:bg-white outline-none transition-all font-medium" placeholder="+56 9 XXXX XXXX" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dirección de oficina (opcional)</label>
                <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#EE6C4D] focus:bg-white outline-none transition-all font-medium" placeholder="Ej: Av. Apoquindo 1234, Of 501, Las Condes" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EE6C4D]/10 flex items-center justify-center text-[#EE6C4D]">
                <span className="material-symbols-outlined">school</span>
              </div>
              <h3 className="text-xl font-bold">2. Antecedentes Académicos</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Universidad</label>
                  <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#EE6C4D] focus:bg-white outline-none transition-all font-medium" placeholder="Ej: Universidad de Chile" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Año de titulación</label>
                  <input type="number" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#EE6C4D] focus:bg-white outline-none transition-all font-medium" placeholder="2015" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Especialidades (Máximo 3)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Civil', 'Familia', 'Laboral', 'Penal', 'Inmobiliario', 'Comercial', 'Tributario', 'Otro'].map(esp => (
                    <label key={esp} className="flex items-center gap-3 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-[#EE6C4D]/30 transition-all has-[:checked]:border-[#EE6C4D] has-[:checked]:bg-[#EE6C4D]/5">
                      <input type="checkbox" className="w-4 h-4 accent-[#EE6C4D]" />
                      <span className="text-sm font-bold">{esp}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Diplomados / Magíster (opcional)</label>
                <div className="space-y-3">
                    <input type="text" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#EE6C4D] focus:bg-white outline-none transition-all font-medium" placeholder="Ej: Magíster en Derecho Laboral, Universidad Católica" />
                    <button type="button" className="text-xs font-bold text-[#EE6C4D] flex items-center gap-1 hover:gap-2 transition-all">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                        Agregar otro grado académico
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 3: Datos Legales */}
          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EE6C4D]/10 flex items-center justify-center text-[#EE6C4D]">
                <span className="material-symbols-outlined">gavel</span>
              </div>
              <h3 className="text-xl font-bold">3. Datos Legales y Certificación</h3>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                <span className="material-symbols-outlined text-amber-600 mt-0.5">info</span>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Para habilitar tu cuenta, nuestro equipo validará tus antecedentes en la base de datos nacional de abogados. Esto puede tardar hasta 24 horas hábiles.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Carga de documentos (Obligatorio)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50 group-hover:border-[#EE6C4D]/30 transition-all">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-[#EE6C4D] group-hover:scale-110 transition-all">upload_file</span>
                      <div className="text-center">
                        <p className="text-xs font-bold">Certificado de Título</p>
                        <p className="text-[10px] text-slate-400">PDF, JPG (Máx 5MB)</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required />
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50 group-hover:border-[#EE6C4D]/30 transition-all">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-[#EE6C4D] group-hover:scale-110 transition-all">badge</span>
                      <div className="text-center">
                        <p className="text-xs font-bold">Foto CI (Ambos lados)</p>
                        <p className="text-[10px] text-slate-400">PDF, JPG (Máx 5MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 px-1 pt-4">
                  <input type="checkbox" className="mt-1 accent-[#EE6C4D]" required id="veracity" />
                  <label htmlFor="veracity" className="text-xs text-secondary leading-relaxed font-medium">
                      Declaro bajo juramento que toda la información y documentos proporcionados son veraces y corresponden a mi identidad profesional. Entiendo que cualquier falsedad resultará en la inhabilitación permanente.
                  </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-12">
            <Link to="/" className="px-10 py-5 text-secondary font-bold hover:text-on-background transition-colors">Guardar y continuar después</Link>
            <button type="submit" className="px-12 py-5 abogado-gradient text-white font-black rounded-2xl shadow-xl shadow-[#EE6C4D]/20 hover:scale-[1.03] active:scale-95 transition-all text-lg">
                Enviar perfil a revisión
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Perfil
