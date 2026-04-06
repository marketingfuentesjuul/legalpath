import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

const ALLOWED_SPECIALTIES = [
  'Derecho Civil', 'Derecho Penal', 'Derecho Laboral', 'Derecho de Familia',
  'Derecho Comercial / Mercantil', 'Derecho Tributario', 'Derecho Administrativo',
  'Derecho Ambiental', 'Derecho de Aguas', 'Derecho de Minería',
  'Derecho de Propiedad Intelectual', 'Derecho del Consumidor', 'Derecho Constitucional',
  'Derecho de Seguros', 'Derecho Marítimo', 'Derecho de Salud', 'Derecho de Migración',
  'Libre Competencia', 'Arbitraje y Mediación', 'Derecho Inmobiliario'
]

const defaultStudy = () => ({ studyLevel: '', university: '', gradYear: '', file: null, fileName: '' })

const Perfil = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [rut, setRut] = useState('')
  const [rutAsociado, setRutAsociado] = useState('')
  const [region, setRegion] = useState('')
  const [city, setCity] = useState('')
  const [colegioId, setColegioId] = useState('')
  
  const [studies, setStudies] = useState([defaultStudy()])
  const [specialties, setSpecialties] = useState(['Derecho Penal', 'Derecho Civil'])
  
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Intentar cargar desde sessionStorage (flujo inmediato tras registro)
    setFirstName(sessionStorage.getItem('lp_firstName') || '')
    setLastName(sessionStorage.getItem('lp_lastName') || '')
    setEmail(sessionStorage.getItem('lp_email') || '')

    // Si ya hay usuario autenticado, podríamos precargar datos de la DB
    if (user) {
      setEmail(user.email || '')
      if (user.user_metadata) {
        setFirstName(user.user_metadata.first_name || '')
        setLastName(user.user_metadata.last_name || '')
      }
    }
  }, [user])

  const addStudy = () => setStudies(prev => [...prev, defaultStudy()])
  const removeStudy = (idx) => setStudies(prev => prev.filter((_, i) => i !== idx))
  const updateStudy = (idx, field, value) => {
    setStudies(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  const handleFileChange = (idx, e) => {
    const file = e.target.files[0]
    if (file) {
      updateStudy(idx, 'file', file)
      updateStudy(idx, 'fileName', file.name)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const addSpecialty = (val) => {
    if (val && !specialties.includes(val)) setSpecialties(prev => [...prev, val])
  }
  const removeSpecialty = (val) => setSpecialties(prev => prev.filter(s => s !== val))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('Debes estar autenticado para guardar tu perfil.')
      return
    }
    
    if (specialties.length === 0) {
      setError('Por favor, selecciona al menos una Área de Especialidad.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let avatarUrl = null
      
      // 1. Subir Avatar si existe
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}/${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('certificates') // Usamos certificates o crear uno para avatares? Usaré certificates por ahora
          .upload(`avatars/${fileName}`, avatarFile)
        
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl(`avatars/${fileName}`)
        avatarUrl = publicUrl
      }

      // 2. Upsert Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          rut_personal: rut,
          rut_pjud: rutAsociado,
          region: region,
          city: city,
          colegio_id: colegioId,
          specialties: specialties,
          avatar_url: avatarUrl,
          role: 'abogado',
          verification_status: 'pending',
          updated_at: new Date()
        })

      if (profileError) throw profileError

      // 3. Subir certificados y guardar educación
      for (const study of studies) {
        if (!study.studyLevel || !study.university) continue

        let certUrl = null
        if (study.file) {
          const fileExt = study.file.name.split('.').pop()
          const fileName = `${user.id}/${Math.random()}.${fileExt}`
          const { error: certUploadError } = await supabase.storage
            .from('certificates')
            .upload(`${fileName}`, study.file)
          
          if (certUploadError) throw certUploadError
          const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl(`${fileName}`)
          certUrl = publicUrl
        }

        const { error: eduError } = await supabase
          .from('lawyer_education')
          .insert({
            profile_id: user.id,
            study_level: study.studyLevel,
            institution: study.university,
            graduation_year: parseInt(study.gradYear),
            certificate_url: certUrl
          })
        
        if (eduError) throw eduError
      }

      sessionStorage.removeItem('lp_firstName')
      sessionStorage.removeItem('lp_lastName')
      sessionStorage.removeItem('lp_email')
      
      navigate('/auth/validacion')
    } catch (err) {
      setError(err.message || 'Error al guardar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="antialiased min-h-screen bg-[#F8FAFC] pb-20">
      <main className="max-w-4xl mx-auto px-4 pt-10 sm:px-6">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">Completa tu Perfil Profesional</h1>
          <p className="text-slate-500 mt-2">Sube tus antecedentes para verificar tu cuenta de abogado</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

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
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                  />
                  <label htmlFor="avatar-upload" className="w-[124px] h-[124px] rounded-full border-[3px] border-dashed border-slate-200 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[#8A95AA] text-[28px] mb-1">cloud_upload</span>
                        <span className="text-[10px] font-bold text-[#8A95AA] tracking-wide uppercase">SUBIR</span>
                      </>
                    )}
                  </label>
                  <label htmlFor="avatar-upload" className="absolute bottom-1 right-2 w-7 h-7 bg-[#EE6C4D] rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-sm">
                    <span className="material-symbols-outlined text-white text-[14px]">edit</span>
                  </label>
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
                  <input type="email" id="email" name="email" required autoComplete="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow disabled:bg-slate-50 disabled:text-slate-400" placeholder="elena.ramirez@legal.com" disabled={!!user} />
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
                    <input 
                      type="file" 
                      id={`cert-${idx}`} 
                      className="hidden" 
                      onChange={e => handleFileChange(idx, e)}
                      accept=".pdf,image/*"
                    />
                    <label htmlFor={`cert-${idx}`} className="border border-dashed border-[#EE6C4D] bg-[#EE6C4D]/5 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 cursor-pointer hover:bg-[#EE6C4D]/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#EE6C4D] text-[20px]">description</span>
                        <span className="text-[13px] text-slate-500 text-center sm:text-left">
                          {study.fileName || 'Subir PDF o documento JPG'}
                        </span>
                      </div>
                      <span className="text-[11px] font-extrabold text-[#EE6C4D] tracking-wide uppercase">
                        {study.fileName ? 'CAMBIAR ARCHIVO' : 'SELECCIONAR ARCHIVO'}
                      </span>
                    </label>
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
                <input type="text" id="rut" name="rut" required value={rut} onChange={e => setRut(e.target.value)} autoComplete="off" maxLength={12} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="12.345.678-9" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="rutAsociado" className="block text-[13px] font-bold text-on-background">RUT (Asociado PJUD) <span className="text-[#EE6C4D]">*</span></label>
                <input type="text" id="rutAsociado" name="rutAsociado" required value={rutAsociado} onChange={e => setRutAsociado(e.target.value)} autoComplete="off" maxLength={12} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="76.543.210-K" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="geografia" className="block text-[13px] font-bold text-on-background">Región Geográfica <span className="text-[#EE6C4D]">*</span></label>
                <div className="relative">
                  <select id="geografia" name="geografia" value={region} onChange={e => setRegion(e.target.value)} required className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow appearance-none text-on-background">
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
                <input type="text" id="ciudad" name="ciudad" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="e.g. Providencia" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="colegio" className="block text-[13px] font-bold text-on-background">Colegio de Abogados</label>
                <input type="text" id="colegio" name="colegio" value={colegioId} onChange={e => setColegioId(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#EE6C4D]/50 focus:border-[#EE6C4D] outline-none transition-shadow" placeholder="ID de miembro (Opcional)" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`abogado-gradient text-white px-10 py-4 rounded-xl font-bold text-[15px] shadow-lg transition-all flex justify-center items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
            >
              {loading ? 'Guardando...' : (
                <>
                  Finalizar proceso de registro <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Perfil
