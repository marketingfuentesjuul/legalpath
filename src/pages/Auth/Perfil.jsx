import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ALLOWED_SPECIALTIES = [
  'Derecho Civil', 'Derecho Penal', 'Derecho Laboral', 'Derecho de Familia',
  'Derecho Comercial / Mercantil', 'Derecho Tributario', 'Derecho Administrativo',
  'Derecho Ambiental', 'Derecho de Aguas', 'Derecho de Minería',
  'Derecho de Propiedad Intelectual', 'Derecho del Consumidor', 'Derecho Constitucional',
  'Derecho de Seguros', 'Derecho Marítimo', 'Derecho de Salud', 'Derecho de Migración',
  'Libre Competencia', 'Arbitraje y Mediación', 'Derecho Inmobiliario'
]

const defaultStudy = () => ({ studyLevel: '', university: '', gradYear: '' })

const Perfil = () => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [studies, setStudies] = useState([defaultStudy()])
  const [specialties, setSpecialties] = useState(['Derecho Penal', 'Derecho Civil'])

  useEffect(() => {
    setFirstName(sessionStorage.getItem('lp_firstName') || '')
    setLastName(sessionStorage.getItem('lp_lastName') || '')
    setEmail(sessionStorage.getItem('lp_email') || '')
  }, [])

  const addStudy = () => setStudies(prev => [...prev, defaultStudy()])
  const removeStudy = (idx) => setStudies(prev => prev.filter((_, i) => i !== idx))
  const updateStudy = (idx, field, value) => setStudies(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))

  const addSpecialty = (val) => {
    if (val && !specialties.includes(val)) setSpecialties(prev => [...prev, val])
  }
  const removeSpecialty = (val) => setSpecialties(prev => prev.filter(s => s !== val))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (specialties.length === 0) {
      alert('Por favor, selecciona al menos una Área de Especialidad.')
      return
    }
    sessionStorage.removeItem('lp_firstName')
    sessionStorage.removeItem('lp_lastName')
    sessionStorage.removeItem('lp_email')
    navigate('/auth/validacion')
  }

  return (
    <div className="antialiased min-h-screen bg-background pb-20">


      <main className="max-w-4xl mx-auto px-6 mt-12">
        <div className="mb-10">
          <h1 className="text-[32px] sm:text-[36px] font-extrabold text-on-background tracking-tight mb-3">Únete a la Red Legal</h1>
          <p className="text-secondary text-[15px] max-w-2xl leading-relaxed">
            Completa tu perfil profesional para comenzar a recibir referidos de casos y gestionar tu práctica.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>

          {/* Card 1: Información Personal */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: 'rgba(238,108,77,0.1)', color: '#EE6C4D' }}>1</div>
              <h2 className="text-xl font-bold text-on-background tracking-tight">Información Personal</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-10">
              {/* Photo Upload */}
              <div className="flex flex-col items-center shrink-0 w-[140px]">
                <span className="text-[11px] font-extrabold text-[#8A95AA] uppercase tracking-wider mb-3">FOTO DE PERFIL</span>
                <div className="relative mb-3">
                  <div className="w-[124px] h-[124px] rounded-full border-[3px] border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <span className="material-symbols-outlined text-[#8A95AA] text-[28px] mb-1">cloud_upload</span>
                    <span className="text-[10px] font-bold text-[#8A95AA] tracking-wide uppercase">SUBIR</span>
                  </div>
                  <div className="absolute bottom-1 right-2 w-7 h-7 bg-[#EE6C4D] rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-sm">
                    <span className="material-symbols-outlined text-white text-[14px]">edit</span>
                  </div>
                </div>
                <p className="text-[10px] text-center text-[#8A95AA] leading-tight">JPG, PNG or GIF. Max 5MB. Face must be visible.</p>
              </div>
              {/* Personal Fields */}
              <div className="flex-1 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="block text-[13px] font-bold text-on-background">Nombres</label>
                    <input type="text" id="firstName" name="firstName" required autoComplete="given-name" maxLength={80} value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="e.g. Elena" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="block text-[13px] font-bold text-on-background">Apellidos</label>
                    <input type="text" id="lastName" name="lastName" required autoComplete="family-name" maxLength={80} value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="e.g. Ramirez" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-[13px] font-bold text-on-background">Correo Electrónico</label>
                  <input type="email" id="email" name="email" required autoComplete="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="elena.ramirez@legal.com" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Antecedentes Académicos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: 'rgba(238,108,77,0.1)', color: '#EE6C4D' }}>2</div>
              <h2 className="text-xl font-bold text-on-background tracking-tight">Antecedentes Académicos</h2>
            </div>
            <div className="space-y-5">
              {studies.map((study, idx) => (
                <div key={idx} className="relative bg-slate-50/70 border border-slate-200/60 p-5 rounded-xl space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-bold text-on-background">Nivel de Estudio</label>
                      <div className="relative">
                        <select value={study.studyLevel} onChange={e => updateStudy(idx, 'studyLevel', e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow appearance-none text-on-background">
                          <option value="" disabled>Seleccionar nivel...</option>
                          <option value="grado">Licenciatura / Grado</option>
                          <option value="diplomado">Diplomado</option>
                          <option value="postgrado">Magíster / Postgrado</option>
                          <option value="doctorado">Doctorado</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none text-[20px]">unfold_more</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-bold text-on-background">Universidad / Institución</label>
                      <input type="text" value={study.university} onChange={e => updateStudy(idx, 'university', e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="e.g. Yale Law School" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[13px] font-bold text-on-background">Año de titulación</label>
                      <input type="number" value={study.gradYear} onChange={e => updateStudy(idx, 'gradYear', e.target.value)} min="1950" max="2026" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="e.g. 2018" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[13px] font-bold text-on-background">Certificado de Título <span className="text-red-500">*</span></label>
                    <div className="border border-dashed border-[#EE6C4D] bg-[#EE6C4D]/5 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer hover:bg-[#EE6C4D]/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#EE6C4D] text-[20px]">description</span>
                        <span className="text-[13px] text-slate-500 text-center sm:text-left">Subir PDF o documento JPG</span>
                      </div>
                      <span className="text-[11px] font-extrabold text-[#EE6C4D] tracking-wide uppercase">SELECCIONAR ARCHIVO</span>
                    </div>
                  </div>
                  {idx > 0 && (
                    <button type="button" onClick={() => removeStudy(idx)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm border border-slate-200" title="Eliminar estudio">
                      <span className="material-symbols-outlined text-[16px] block">close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addStudy} className="flex items-center gap-2 text-[#EE6C4D] font-bold text-[13px] hover:text-[#EE6C4D]/80 transition-colors mt-4">
              <span className="material-symbols-outlined text-[18px]">add_circle</span> Agregar más estudios
            </button>
          </div>

          {/* Card 3: Datos Legales y Profesionales */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: 'rgba(238,108,77,0.1)', color: '#EE6C4D' }}>3</div>
              <h2 className="text-xl font-bold text-on-background tracking-tight">Datos Legales y Profesionales</h2>
            </div>

            {/* Specialties */}
            <div className="space-y-2 mb-6">
              <label className="block text-[13px] font-bold text-on-background">Áreas de Especialidad <span className="text-[#EE6C4D]">*</span></label>
              <div className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 min-h-[52px] flex items-center gap-2 flex-wrap">
                <div className="flex flex-wrap gap-2">
                  {specialties.map(s => (
                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white bg-[#EE6C4D] text-[12px] font-bold shadow-sm mb-1">
                      {s}{' '}
                      <button type="button" onClick={() => removeSpecialty(s)} aria-label={`Eliminar ${s}`} className="hover:text-white/80 select-none flex items-center justify-center">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative inline-block mt-1 sm:mt-0">
                  <select onChange={e => { addSpecialty(e.target.value); e.target.selectedIndex = 0 }} className="appearance-none bg-white border border-slate-200 text-secondary text-[12px] font-medium rounded-full px-3 py-1.5 focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none cursor-pointer pr-8 shadow-sm">
                    <option value="" disabled>+ Agregar Área</option>
                    {ALLOWED_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[16px] select-none">expand_more</span>
                </div>
              </div>
            </div>

            {/* RUT fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="space-y-1.5">
                <label htmlFor="rut" className="block text-[13px] font-bold text-on-background">RUT (Personal) <span className="text-[#EE6C4D]">*</span></label>
                <input type="text" id="rut" name="rut" required autoComplete="off" maxLength={12} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="12.345.678-9" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="rutAsociado" className="block text-[13px] font-bold text-on-background">RUT (Asociado PJUD) <span className="text-[#EE6C4D]">*</span></label>
                <input type="text" id="rutAsociado" name="rutAsociado" required autoComplete="off" maxLength={12} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="76.543.210-K" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="geografia" className="block text-[13px] font-bold text-on-background">Región Geográfica <span className="text-[#EE6C4D]">*</span></label>
                <div className="relative">
                  <select id="geografia" name="geografia" required className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow appearance-none text-on-background">
                    <option value="" disabled>Seleccionar región...</option>
                    <option value="Arica y Parinacota">XV de Arica y Parinacota</option>
                    <option value="Tarapacá">I de Tarapacá</option>
                    <option value="Antofagasta">II de Antofagasta</option>
                    <option value="Atacama">III de Atacama</option>
                    <option value="Coquimbo">IV de Coquimbo</option>
                    <option value="Valparaíso">V de Valparaíso</option>
                    <option value="Metropolitana">RM de Santiago</option>
                    <option value="O'Higgins">VI del Libertador Gral. Bernardo O'Higgins</option>
                    <option value="Maule">VII del Maule</option>
                    <option value="Ñuble">XVI de Ñuble</option>
                    <option value="Biobío">VIII del Biobío</option>
                    <option value="Araucanía">IX de la Araucanía</option>
                    <option value="Los Ríos">XIV de Los Ríos</option>
                    <option value="Los Lagos">X de Los Lagos</option>
                    <option value="Aysén">XI de Aysén del Gral. Carlos Ibáñez del Campo</option>
                    <option value="Magallanes">XII de Magallanes y de la Antártica Chilena</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none select-none text-[20px]">unfold_more</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ciudad" className="block text-[13px] font-bold text-on-background">Ciudad (Opcional)</label>
                <input type="text" id="ciudad" name="ciudad" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="e.g. Providencia" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="colegio" className="block text-[13px] font-bold text-on-background">Colegio de Abogados</label>
                <input type="text" id="colegio" name="colegio" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="ID de miembro (Opcional)" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button type="submit" className="abogado-gradient text-white px-10 py-4 rounded-xl font-bold text-[15px] shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex justify-center items-center gap-2">
              Finalizar proceso de registro <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Perfil
