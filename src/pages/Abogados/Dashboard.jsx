import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [expandedCaseId, setExpandedCaseId] = useState(null)
  const [expandedSearchCaseId, setExpandedSearchCaseId] = useState(null)
  const [individualTokens, setIndividualTokens] = useState(10)

  // Estados para casos de la base de datos
  const [searchCasesList, setSearchCasesList] = useState([])
  const [loadingCases, setLoadingCases] = useState(true)

  // Función para obtener casos publicados desde Supabase
  const fetchPublishedCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('admin_status', 'aprobado')
        .eq('status', 'activo')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSearchCasesList(data || [])
    } catch (err) {
      console.error('Error al obtener los casos publicados:', err)
    } finally {
      setLoadingCases(false)
    }
  }

  // Cargar casos inicialmente y suscribirse a cambios en tiempo real
  useEffect(() => {
    fetchPublishedCases()

    // Suscripción al segundo (Realtime) para la tabla 'cases'
    const channel = supabase
      .channel('realtime:cases')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cases' },
        (payload) => {
          console.log('Cambio en tiempo real detectado:', payload)
          fetchPublishedCases()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Datos provisorios recientes (Dashboard widget)
  const recentCases = [
    { id: 1, title: 'Demanda por despido injustificado', client: 'Juan P.', date: 'Hoy', status: 'Nuevo' },
    { id: 2, title: 'Divorcio de mutuo acuerdo', client: 'María G.', date: 'Ayer', status: 'En revisión' },
    { id: 3, title: 'Asesoría creación de empresa', client: 'Empresa SpA', date: 'Hace 2 días', status: 'Cerrado' }
  ]

  // Casos activos
  const activeCasesList = [
    { 
      id: 1, 
      type: 'Migratorio', 
      title: 'Regularización de visa sujeta a contrato',
      client: 'Carlos M.', 
      date: '10 Oct 2026', 
      status: 'En progreso',
      details: 'El cliente ingresó a Chile hace 3 años. El empleador actual no ha pagado cotizaciones en los últimos 6 meses, lo que está trabando la renovación de la visa. Se requiere preparar la documentación para apelación en el Servicio Nacional de Migraciones.'
    },
    { 
      id: 2, 
      type: 'Inmobiliario', 
      title: 'Estudio de títulos para compraventa',
      client: 'Inversiones Sur SpA', 
      date: '05 Oct 2026', 
      status: 'Documentación pendiente',
      details: 'Revisión exhaustiva de 20 años de inscripciones en el Conservador de Bienes Raíces de Santiago para una propiedad comercial en Providencia. Faltan certificados de hipotecas y gravámenes actualizados y verificar estado de contribuciones.'
    },
    { 
      id: 3, 
      type: 'Fraude bancario', 
      title: 'Phishing y suplantación de identidad en BancoEstado',
      client: 'Ana R.', 
      date: '12 Oct 2026', 
      status: 'Auditoría',
      details: 'La clienta fue víctima de estafa telefónica donde se le sustrajeron $4.500.000 CLP. El banco niega restitución de fondos alegando negligencia. Se preparará reclamo ante la CMF y demanda por ley de fraudes (Ley 21.234).'
    }
  ]

  const renderDashboardView = () => (
    <div className="w-full">
      <header className="flex justify-between items-center mb-10 w-full">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Resumen.</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Tu actividad y estadísticas en LegalPath.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#EE6C4D] shadow-sm transition-all relative">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EE6C4D] rounded-full border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer">
            <img src="https://ui-avatars.com/api/?name=A+B&background=EE6C4D&color=fff" alt="Perfil" />
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Main Hero Card */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 group flex flex-col justify-between min-h-[300px]">
          <div className="relative z-10 flex flex-col items-start h-full pb-4">
            <span className="bg-white/10 text-white text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full backdrop-blur-md mb-6 border border-white/5 shadow-sm">
              Nuevos Casos Disponibles
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-[1.1] tracking-tight">
              Impulsa tu práctica<br/>con más clientes.
            </h2>
            <p className="text-slate-300 mb-8 max-w-sm text-sm font-medium leading-relaxed">
              Revisa los casos ingresados recientemente por usuarios y amplía tu cartera hoy mismo.
            </p>
            <button 
              onClick={() => setActiveTab('buscar')}
              className="mt-auto bg-white/10 hover:bg-white text-white hover:text-slate-900 px-6 py-3.5 rounded-2xl font-bold transition-all group-hover:scale-105 flex items-center gap-2 backdrop-blur-md border border-white/10"
            >
              Explorar Casos <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          
          {/* Decorative soft gradients */}
          <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-[#EE6C4D]/30 rounded-full blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="absolute right-10 -bottom-20 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        </div>

        {/* Stats Column */}
        <div className="flex flex-col gap-6">
          
          {/* Vibrant Metric Card (Clickable to Casos Activos) */}
          <button 
            onClick={() => setActiveTab('casos')}
            className="w-full text-left flex-1 bg-gradient-to-br from-[#EE6C4D] to-orange-400 rounded-[32px] p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all group focus:outline-none"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6 border border-white/10 group-hover:bg-white/30 transition-colors">
                <span className="material-symbols-outlined text-white">folder_open</span>
              </div>
              <div>
                <h3 className="text-5xl font-black mb-1 tracking-tight">3</h3>
                <p className="font-semibold text-white/90 text-sm">Casos Activos</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full blur-2xl pointer-events-none"></div>
          </button>
          
          {/* Tokens Metric Card */}
          <div className="flex-1 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between">
            <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#EE6C4D]/10 group-hover:text-[#EE6C4D] transition-colors border border-slate-100">
              <span className="material-symbols-outlined">toll</span>
            </div>
            <div>
              <h3 className="text-5xl font-black text-slate-800 mb-1 tracking-tight">450</h3>
              <p className="font-semibold text-slate-500 text-sm">Tokens Disponibles</p>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Cases Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Casos Recientes</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Última actividad en tus casos asesorados.</p>
          </div>
          <button onClick={() => setActiveTab('casos')} className="flex items-center gap-1 text-[#EE6C4D] text-sm font-bold bg-[#EE6C4D]/5 hover:bg-[#EE6C4D]/10 px-4 py-2 rounded-xl transition-colors">
            Ver todos <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {recentCases.map((caseItem) => (
            <div key={caseItem.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#EE6C4D]/30 hover:shadow-sm transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#EE6C4D] group-hover:bg-[#EE6C4D]/10 transition-colors">
                  <span className="material-symbols-outlined">gavel</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-0.5">{caseItem.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{caseItem.client} • {caseItem.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  caseItem.status === 'Nuevo' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  caseItem.status === 'En revisión' ? 'bg-orange-50 text-[#EE6C4D] border border-orange-100' :
                  'bg-slate-50 text-slate-600 border border-slate-100'
                }`}>
                  {caseItem.status}
                </span>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-[#EE6C4D] transition-colors">chevron_right</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCasosActivosView = () => (
    <div className="w-full">
      <header className="flex justify-between items-center mb-10 w-full">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Casos Activos.</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Gestiona tus casos en curso y revisa la información detallada.</p>
        </div>
      </header>

      <div className="space-y-4">
        {activeCasesList.map(caseItem => (
          <div key={caseItem.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
             
             {/* Acordion Header */}
             <button 
               onClick={() => setExpandedCaseId(expandedCaseId === caseItem.id ? null : caseItem.id)}
               className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left focus:outline-none"
             >
               <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-[#EE6C4D]/10 rounded-xl flex items-center justify-center text-[#EE6C4D]">
                   <span className="material-symbols-outlined text-[24px]">
                     {caseItem.type === 'Migratorio' ? 'public' : caseItem.type === 'Inmobiliario' ? 'real_estate_agent' : 'account_balance'}
                   </span>
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{caseItem.type}</span>
                     <span className="text-sm font-bold text-slate-400">•</span>
                     <span className="text-sm font-bold text-slate-500">{caseItem.date}</span>
                   </div>
                   <h3 className="text-lg font-bold text-slate-800">{caseItem.title}</h3>
                   <p className="text-sm text-slate-500 font-medium">Cliente: {caseItem.client}</p>
                 </div>
               </div>
               <div className="flex items-center gap-6">
                 <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                   {caseItem.status}
                 </span>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${expandedCaseId === caseItem.id ? 'bg-[#EE6C4D] text-white' : 'bg-slate-100 text-slate-500'}`}>
                   <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: expandedCaseId === caseItem.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                 </div>
               </div>
             </button>
             
             {/* Acordion Content */}
             <div 
               className="transition-all duration-300 ease-in-out overflow-hidden" 
               style={{ maxHeight: expandedCaseId === caseItem.id ? '500px' : '0px', opacity: expandedCaseId === caseItem.id ? 1 : 0 }}
             >
               <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                 <h4 className="font-bold text-slate-800 mb-2">Detalles del caso</h4>
                 <p className="text-slate-600 text-[15px] leading-relaxed mb-6 max-w-4xl">
                   {caseItem.details}
                 </p>
                 <div className="flex gap-3">
                   <button className="bg-[#EE6C4D] hover:bg-[#d65f42] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2">
                     <span className="material-symbols-outlined text-[18px]">visibility</span> Ver expediente completo
                   </button>
                   <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                     <span className="material-symbols-outlined text-[18px]">chat</span> Contactar cliente
                   </button>
                 </div>
               </div>
             </div>
             
          </div>
        ))}
      </div>
    </div>
  )

  const renderBuscarCasosView = () => (
    <div className="w-full">
      <header className="mb-10 w-full space-y-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Buscar Casos.</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Explora las últimas solicitudes ingresadas y conecta con nuevos prospectos.</p>
        </div>

        {/* Advanced Search & Filters */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-5">
          {/* Search Input */}
          <div className="relative w-full">
             <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[24px]">search</span>
             <input 
                type="text" 
                placeholder="Busca por palabra clave, por ejemplo: fraude, visas, demanda..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-[15px] font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#EE6C4D]/30 focus:border-[#EE6C4D] outline-none transition-all" 
             />
          </div>
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 mr-2">
              <span className="material-symbols-outlined text-[20px]">tune</span> Filtros:
            </div>
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <select className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 focus:outline-[#EE6C4D] appearance-none cursor-pointer">
                <option value="">Área del derecho</option>
                <option>Migratorio</option>
                <option>Inmobiliario</option>
                <option>Penal</option>
                <option>Civil</option>
              </select>
              <select className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 focus:outline-[#EE6C4D] appearance-none cursor-pointer">
                <option value="">Nivel de urgencia</option>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
              <select className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 focus:outline-[#EE6C4D] appearance-none cursor-pointer">
                <option value="">Región</option>
                <option>Región Metropolitana</option>
                <option>Valparaíso</option>
                <option>Antofagasta</option>
                <option>Atacama</option>
                <option>Maule</option>
              </select>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <span className="text-sm font-bold text-slate-500">Ordenar por:</span>
              <select className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-[#EE6C4D] cursor-pointer">
                <option>Más recientes</option>
                <option>Mayor cuantía</option>
                <option>Mayor urgencia</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* List of Search Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 mb-4 ml-2">Casos Disponibles ({searchCasesList.length})</h3>
        
        {loadingCases ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
            <span className="material-symbols-outlined text-[32px] animate-spin mb-2 text-[#EE6C4D]">sync</span>
            <p className="font-semibold text-sm">Cargando casos en tiempo real...</p>
          </div>
        ) : searchCasesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
            <span className="material-symbols-outlined text-[48px] mb-3 text-slate-300">gavel</span>
            <p className="font-bold">No hay casos publicados disponibles.</p>
            <p className="text-xs text-slate-400 mt-1">Cuando los administradores revisen y publiquen casos, aparecerán aquí.</p>
          </div>
        ) : (
          searchCasesList.map(caseItem => {
            const displayType = caseItem.category || 'General';
            const displayRegion = caseItem.region || caseItem.city || 'No especificada';
            const displayDate = caseItem.created_at
              ? new Date(caseItem.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Reciente';
            const displayTitle = caseItem.title || 'Caso sin título';
            const displayUrgency = caseItem.urgency
              ? caseItem.urgency.charAt(0).toUpperCase() + caseItem.urgency.slice(1)
              : 'Baja';
            const displayAmount = caseItem.estimated_amount
              ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(caseItem.estimated_amount)
              : 'Por definir';
            const displayDetails = caseItem.polished_description || caseItem.description || 'Sin descripción';

            return (
              <div key={caseItem.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                 
                 {/* Accordion Header */}
                 <button 
                   onClick={() => setExpandedSearchCaseId(expandedSearchCaseId === caseItem.id ? null : caseItem.id)}
                   className="w-full flex md:items-center flex-col md:flex-row justify-between p-6 hover:bg-slate-50 transition-colors text-left focus:outline-none gap-4 md:gap-0"
                 >
                   <div className="flex items-start md:items-center gap-5 w-full md:w-auto">
                     <div className="w-14 h-14 shrink-0 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-500">
                       <span className="material-symbols-outlined text-[24px]">
                         {displayType === 'Migratorio' ? 'public' : displayType === 'Inmobiliario' ? 'real_estate_agent' : displayType === 'Herencia' ? 'home_work' : displayType === 'Minería' ? 'landscape' : 'account_balance'}
                       </span>
                     </div>
                     <div>
                       <div className="flex flex-wrap items-center gap-2 mb-1.5">
                         <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{displayType}</span>
                         <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">location_on</span> {displayRegion}
                         </span>
                         <span className="text-sm font-bold text-slate-400 hidden sm:inline">•</span>
                         <span className="text-sm font-bold text-slate-500">{displayDate}</span>
                       </div>
                       <h3 className="text-[17px] font-bold text-slate-800 leading-snug pr-4">{displayTitle}</h3>
                       <p className="text-sm text-slate-500 font-medium mt-1">Usuario Anónimo</p>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pl-16 md:pl-0">
                     <div className="flex gap-4 text-right">
                        <div className="hidden sm:block">
                          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Urgencia</p>
                          <p className={`text-sm font-bold mt-0.5 ${displayUrgency === 'Alta' ? 'text-red-500' : displayUrgency === 'Media' ? 'text-amber-500' : 'text-emerald-500'}`}>{displayUrgency}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Cuantía Est.</p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">{displayAmount}</p>
                        </div>
                     </div>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${expandedSearchCaseId === caseItem.id ? 'bg-[#EE6C4D] text-white' : 'bg-slate-100 text-slate-500'}`}>
                       <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: expandedSearchCaseId === caseItem.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                     </div>
                   </div>
                 </button>
                 
                 {/* Accordion Content */}
                 <div 
                   className="transition-all duration-300 ease-in-out overflow-hidden" 
                   style={{ maxHeight: expandedSearchCaseId === caseItem.id ? '600px' : '0px', opacity: expandedSearchCaseId === caseItem.id ? 1 : 0 }}
                 >
                   <div className="p-6 border-t border-slate-100 bg-slate-50/70">
                     <div className="flex flex-col md:flex-row gap-6 justify-between">
                       <div className="flex-1 max-w-3xl">
                         <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                           <span className="material-symbols-outlined text-[20px] text-slate-400">description</span> Descripción del expediente
                         </h4>
                         <p className="text-slate-600 text-[15px] leading-relaxed">
                           {displayDetails}
                         </p>
                         
                         <div className="mt-6 flex flex-wrap gap-2">
                           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                             <span className="material-symbols-outlined text-[14px]">lock</span> Confidencial
                           </span>
                           <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
                             <span className="material-symbols-outlined text-[14px]">history</span> Expira en 7 días
                           </span>
                         </div>
                       </div>
                       
                       <div className="w-full md:w-64 shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6">
                         <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Inversión requerida</p>
                         <div className="flex items-center justify-center gap-2 mb-4 bg-orange-50 text-orange-600 rounded-xl py-3 border border-orange-100">
                           <span className="material-symbols-outlined">toll</span>
                           <span className="font-black text-xl">15 Tokens</span>
                         </div>
                         <button className="bg-[#EE6C4D] hover:bg-[#d65f42] text-white w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg focus:outline-none">
                           <span className="material-symbols-outlined text-[20px]">chat</span> Usar Token y Contactar
                         </button>
                         <p className="text-[11px] text-center text-slate-400 mt-3 font-medium leading-tight">
                           Se restarán 15 tokens de tu saldo actual si el usuario acepta tu contacto.
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>
                 
              </div>
            );
          })
        )}
      </div>
    </div>
  )

  const renderTokensView = () => {
    const getUnitPrice = (count) => {
      if (count >= 25) return 1100
      if (count >= 10) return 1300
      return 1500
    }
    const unitPrice = getUnitPrice(individualTokens)
    const totalCost = individualTokens * unitPrice

    const usedTokens = 18
    const limitTokens = 40
    const progressPercent = Math.min((usedTokens / limitTokens) * 100, 100)

    return (
      <div className="w-full">
        <header className="flex justify-between items-center mb-10 w-full">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mis Tokens.</h1>
            <p className="text-slate-500 mt-1 font-medium text-sm">Administra tu saldo de tokens, revisa el consumo mensual y adquiere más créditos.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#EE6C4D] shadow-sm transition-all relative">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EE6C4D] rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer">
              <img src="https://ui-avatars.com/api/?name=A+B&background=EE6C4D&color=fff" alt="Perfil" />
            </div>
          </div>
        </header>

        {/* Resumen & Consumo Mensual */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Tarjeta de Balance */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 group flex flex-col justify-between">
            <div className="relative z-10">
              <span className="bg-white/10 text-white text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full backdrop-blur-md mb-6 inline-block border border-white/5 shadow-sm">
                Saldo Actual
              </span>
              <div className="flex items-center gap-3 mt-4">
                <span className="material-symbols-outlined text-[#EE6C4D] text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>toll</span>
                <div>
                  <h3 className="text-5xl font-black tracking-tight">450</h3>
                  <p className="text-slate-400 font-semibold text-xs mt-1">Tokens Disponibles</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#EE6C4D]/20 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Tarjeta de Consumo Mensual (Contador solicitado por el usuario) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="bg-[#EE6C4D]/10 text-[#EE6C4D] text-[11px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-full inline-block">
                    Consumo Mensual
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-800">{usedTokens}</span>
                  <span className="text-slate-400 font-bold text-sm"> / {limitTokens} tokens</span>
                </div>
              </div>
              
              {/* Línea de contador/progreso */}
              <div className="w-full bg-slate-100 rounded-full h-3.5 mb-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#EE6C4D] to-orange-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>0% usado</span>
                <span>{progressPercent}% del límite de tu plan actual</span>
                <span>100% ({limitTokens} tokens)</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 font-medium mt-4 border-t border-slate-100 pt-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-slate-400">info</span>
              Tu plan (Plan Plus) se renueva automáticamente cada mes. Los tokens adicionales comprados de manera individual no expiran.
            </p>
          </div>
        </div>

        {/* Sección de Compra de Tokens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Calculador de Tokens Individuales */}
          <div className="lg:col-span-1 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Comprar de a uno</h3>
              <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">¿Necesitas pocos tokens? Adquiere la cantidad exacta que necesites al instante.</p>
              
              {/* Selector de cantidad */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between mb-6">
                <button 
                  onClick={() => setIndividualTokens(Math.max(1, individualTokens - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#EE6C4D] hover:border-[#EE6C4D]/30 transition-all font-black text-lg shadow-sm"
                >
                  -
                </button>
                <div className="text-center">
                  <input 
                    type="number" 
                    value={individualTokens}
                    onChange={(e) => setIndividualTokens(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-2xl font-black text-slate-800 text-center bg-transparent border-none outline-none focus:ring-0"
                  />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tokens</p>
                </div>
                <button 
                  onClick={() => setIndividualTokens(individualTokens + 1)}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#EE6C4D] hover:border-[#EE6C4D]/30 transition-all font-black text-lg shadow-sm"
                >
                  +
                </button>
              </div>

              {/* Tiers de precios individuales */}
              <div className="space-y-2.5 mb-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tabla de Precios por Unidad:</p>
                <div className={`flex justify-between items-center px-3 py-2 rounded-lg text-xs font-semibold ${unitPrice === 1500 ? 'bg-orange-50 text-[#EE6C4D] border border-orange-100' : 'text-slate-500'}`}>
                  <span>1 - 9 tokens</span>
                  <span className="font-bold">$1.500 CLP / u</span>
                </div>
                <div className={`flex justify-between items-center px-3 py-2 rounded-lg text-xs font-semibold ${unitPrice === 1300 ? 'bg-orange-50 text-[#EE6C4D] border border-orange-100' : 'text-slate-500'}`}>
                  <span>10 - 24 tokens</span>
                  <span className="font-bold">$1.300 CLP / u</span>
                </div>
                <div className={`flex justify-between items-center px-3 py-2 rounded-lg text-xs font-semibold ${unitPrice === 1100 ? 'bg-orange-50 text-[#EE6C4D] border border-orange-100' : 'text-slate-500'}`}>
                  <span>25 o más tokens</span>
                  <span className="font-bold">$1.100 CLP / u</span>
                </div>
              </div>
            </div>

            {/* Total y comprar */}
            <div className="border-t border-slate-100 pt-6 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-500">Precio unitario:</span>
                <span className="text-sm font-bold text-slate-700">${unitPrice.toLocaleString('es-CL')} CLP</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-extrabold text-slate-800">Total a pagar:</span>
                <span className="text-2xl font-black text-[#EE6C4D]">${totalCost.toLocaleString('es-CL')} CLP</span>
              </div>
              <button className="w-full bg-[#EE6C4D] hover:bg-[#d65f42] text-white py-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span> Comprar ahora
              </button>
            </div>
          </div>

          {/* Planes en Conjunto */}
          <div className="lg:col-span-2 bg-slate-50 border border-slate-200/50 rounded-[32px] p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Comprar en conjunto</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Mejora tu suscripción mensual para obtener más tokens al mejor precio por unidad.</p>
              </div>
            </div>

            {/* Lista de planes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plan Base */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Plan Base</h4>
                  <div className="flex items-baseline gap-1 mt-2 mb-4">
                    <span className="text-xs text-slate-400 font-medium">$</span>
                    <span className="text-2xl font-black text-slate-800">12.990</span>
                    <span className="text-xs text-slate-400 font-medium">/mes</span>
                  </div>
                  <ul className="space-y-2 text-xs font-semibold text-slate-500 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>12 tokens incluidos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>Token extra a $1.500</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>Dashboard básico</span>
                    </li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors border border-slate-200">
                  Contratar
                </button>
              </div>

              {/* Plan Core */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Plan Core</h4>
                  <div className="flex items-baseline gap-1 mt-2 mb-4">
                    <span className="text-xs text-slate-400 font-medium">$</span>
                    <span className="text-2xl font-black text-slate-800">23.990</span>
                    <span className="text-xs text-slate-400 font-medium">/mes</span>
                  </div>
                  <ul className="space-y-2 text-xs font-semibold text-slate-500 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>25 tokens incluidos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>Token extra a $1.300</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>Documentos legales simples</span>
                    </li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors border border-slate-200">
                  Contratar
                </button>
              </div>

              {/* Plan Plus */}
              <div className="bg-white rounded-2xl p-5 border-2 border-[#EE6C4D] shadow-md flex flex-col justify-between relative">
                <span className="absolute -top-3 right-4 bg-[#EE6C4D] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Tu Plan
                </span>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Plan Plus</h4>
                  <div className="flex items-baseline gap-1 mt-2 mb-4">
                    <span className="text-xs text-slate-400 font-medium">$</span>
                    <span className="text-2xl font-black text-slate-800">34.990</span>
                    <span className="text-xs text-slate-400 font-medium">/mes</span>
                  </div>
                  <ul className="space-y-2 text-xs font-semibold text-slate-500 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>40 tokens incluidos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>Token extra a $1.100</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>Jurisprudencia avanzada</span>
                    </li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-[#EE6C4D] text-white font-bold rounded-xl text-xs transition-colors border border-transparent shadow-sm cursor-default" disabled>
                  Plan Activo
                </button>
              </div>

              {/* Plan Apex */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Plan Apex</h4>
                  <div className="flex items-baseline gap-1 mt-2 mb-4">
                    <span className="text-xs text-slate-400 font-medium">$</span>
                    <span className="text-2xl font-black text-slate-800">79.990</span>
                    <span className="text-xs text-slate-400 font-medium">/mes</span>
                  </div>
                  <ul className="space-y-2 text-xs font-semibold text-slate-500 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>60 tokens incluidos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>Token extra a $990</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1ecca7] text-[16px]">check_circle</span>
                      <span>Coaching & Soporte 24/7</span>
                    </li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors border border-slate-200">
                  Mejorar Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between fixed h-screen z-20">
        <div>
          <div className="p-6 flex items-center gap-2">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-8 w-auto" />
            <span className="text-secondary font-bold text-xs mt-1 tracking-tight">Abogados</span>
          </div>
          <nav className="mt-4 px-4 space-y-1.5">
            <SidebarItem icon="grid_view" label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon="folder_open" label="Casos activos" active={activeTab === 'casos'} onClick={() => setActiveTab('casos')} />
            <SidebarItem icon="search" label="Buscar casos" active={activeTab === 'buscar'} onClick={() => setActiveTab('buscar')} />
            <SidebarItem icon="toll" label="Mis tokens" active={activeTab === 'tokens'} onClick={() => setActiveTab('tokens')} />
          </nav>
        </div>
        <div className="p-4 border-t border-slate-100">
          <Link to="/auth/perfil" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-xl transition-all font-semibold">
            <span className="material-symbols-outlined">settings</span>
            <span>Configuración</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 xl:p-12 min-h-screen overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && renderDashboardView()}
          {activeTab === 'casos' && renderCasosActivosView()}
          {activeTab === 'buscar' && renderBuscarCasosView()}
          {activeTab === 'tokens' && renderTokensView()}
        </div>
      </main>
    </div>
  )
}

// Helper Component for Sidebar Items
const SidebarItem = ({ icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
        active 
          ? 'bg-[#EE6C4D]/10 text-[#EE6C4D]' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-[#EE6C4D] rounded-full"></div>}
    </button>
  )
}

export default Dashboard
