import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [expandedCaseId, setExpandedCaseId] = useState(null)
  const [expandedSearchCaseId, setExpandedSearchCaseId] = useState(null)
  const [individualTokens, setIndividualTokens] = useState(10)

  // Estados para tokens dinámicos
  const [tokenBalance, setTokenBalance] = useState(0)
  const [activePlan, setActivePlan] = useState({ name: 'Ninguno', tokens_amount: 0 })
  const [usedTokensThisMonth, setUsedTokensThisMonth] = useState(0)
  const [loadingTokens, setLoadingTokens] = useState(true)
  const [packages, setPackages] = useState([])
  const [loadingPackages, setLoadingPackages] = useState(true)
  
  // Nuevos estados para pagos reales y ledger
  const [recentTransactions, setRecentTransactions] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showProviderModal, setShowProviderModal] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)

  // Estados para casos de la base de datos
  const getInitials = () => {
    if (lawyerProfile) {
      const first = lawyerProfile.first_name?.charAt(0) || '';
      const last = lawyerProfile.last_name?.charAt(0) || '';
      return (first + last).toUpperCase() || 'AB';
    }
    if (user && user.user_metadata) {
      const first = user.user_metadata.first_name?.charAt(0) || '';
      const last = user.user_metadata.last_name?.charAt(0) || '';
      return (first + last).toUpperCase() || 'AB';
    }
    return 'AB';
  }

  const renderUserAvatar = () => {
    if (lawyerProfile?.avatar_url) {
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer">
          <img src={lawyerProfile.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
        </div>
      );
    }
    const initials = getInitials();
    return (
      <div className="w-10 h-10 rounded-full bg-[#EE6C4D] text-white font-bold flex items-center justify-center border-2 border-white shadow-sm cursor-pointer text-sm font-sans tracking-wider select-none">
        {initials}
      </div>
    );
  }
  const [searchCasesList, setSearchCasesList] = useState([])
  const [activeCasesList, setActiveCasesList] = useState([])
  const [loadingCases, setLoadingCases] = useState(true)

  // Estados para Finalización y Desistimiento de Casos
  const [showFinishModal, setShowFinishModal] = useState(false)
  const [selectedCaseForFinish, setSelectedCaseForFinish] = useState(null)
  const [finishing, setFinishing] = useState(false)

  const [showCancelCaseModal, setShowCancelCaseModal] = useState(false)
  const [selectedCaseForCancel, setSelectedCaseForCancel] = useState(null)
  const [canceling, setCanceling] = useState(false)

  // Estados para filtros
  const [filterSpecialty, setFilterSpecialty] = useState('')
  const [filterUrgency, setFilterUrgency] = useState('')
  const [filterRegion, setFilterRegion] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recientes')

  // Estados para Modal de Puja
  const [showBidModal, setShowBidModal] = useState(false)
  const [selectedCaseForBid, setSelectedCaseForBid] = useState(null)
  const [bidName, setBidName] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [submittingBid, setSubmittingBid] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showNoTokensModal, setShowNoTokensModal] = useState(false)
  const [lawyerProfile, setLawyerProfile] = useState(null)

  // Estados para Modal de Documentos Adjuntos del Caso
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)
  const [selectedCaseForDocs, setSelectedCaseForDocs] = useState(null)
  const [caseDocuments, setCaseDocuments] = useState([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)

  const selectedCaseForDocsRef = useRef(null)
  useEffect(() => {
    selectedCaseForDocsRef.current = selectedCaseForDocs
  }, [selectedCaseForDocs])

  const handleOpenDocumentsModal = (caseItem) => {
    setSelectedCaseForDocs(caseItem)
    setShowDocumentsModal(true)
    fetchCaseDocuments(caseItem.id)
  }

  const fetchCaseDocuments = async (caseId) => {
    if (!caseId) return
    setLoadingDocuments(true)
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)

      if (error) throw error
      setCaseDocuments(data || [])
    } catch (err) {
      console.error('Error al obtener documentos del caso:', err)
    } finally {
      setLoadingDocuments(false)
    }
  }

  const ALLOWED_SPECIALTIES = [
    'Derecho Civil', 'Derecho Penal', 'Derecho Laboral', 'Derecho de Familia',
    'Fraude bancario', 'Choques',
    'Derecho Comercial / Mercantil', 'Derecho Tributario', 'Derecho Administrativo',
    'Derecho Ambiental', 'Derecho de Aguas', 'Derecho de Minería',
    'Derecho de Propiedad Intelectual', 'Derecho del Consumidor', 'Derecho Constitucional',
    'Derecho de Seguros', 'Derecho Marítimo', 'Derecho de Salud', 'Derecho de Migración',
    'Libre Competencia', 'Arbitraje y Mediación', 'Derecho Inmobiliario'
  ]

  const ALLOWED_REGIONS = [
    'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama', 'Coquimbo', 'Valparaíso',
    'Metropolitana', "O'Higgins", 'Maule', 'Ñuble', 'Biobío', 'Araucanía',
    'Los Ríos', 'Los Lagos', 'Aysén', 'Magallanes'
  ]

  const normalizeText = (str) => {
    if (!str) return ''
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  }

  const isSpecialtyMatch = (caseCategory, selectedSpecialty) => {
    if (!selectedSpecialty) return true
    if (!caseCategory) return false

    const cat = normalizeText(caseCategory)
    const spec = normalizeText(selectedSpecialty)

    if (cat === spec) return true

    const mappings = {
      'penal': ['derecho penal'],
      'civil': ['derecho civil'],
      'laboral': ['derecho laboral'],
      'familia': ['derecho de familia'],
      'migratorio': ['derecho de migración', 'derecho de migracion'],
      'inmobiliario': ['derecho inmobiliario'],
      'comercial': ['derecho comercial / mercantil', 'derecho comercial', 'derecho mercantil'],
      'tributario': ['derecho tributario'],
      'administrativo': ['derecho administrativo'],
      'minería': ['derecho de minería', 'derecho de mineria'],
      'herencia': ['derecho de familia', 'derecho civil']
    }

    if (mappings[cat] && mappings[cat].includes(spec)) {
      return true
    }
    
    return spec.includes(cat) || cat.includes(spec)
  }

  const isRegionMatch = (caseRegion, selectedRegion) => {
    if (!selectedRegion) return true
    if (!caseRegion) return false
    
    const cReg = normalizeText(caseRegion)
    const sReg = normalizeText(selectedRegion)

    if (sReg === 'metropolitana' && (cReg.includes('metropolitana') || cReg.includes('rm') || cReg.includes('santiago'))) {
      return true
    }

    return cReg.includes(sReg) || sReg.includes(cReg)
  }

  const isUrgencyMatch = (caseUrgency, selectedUrgency) => {
    if (!selectedUrgency) return true
    if (!caseUrgency) return false
    return caseUrgency.toLowerCase().trim() === selectedUrgency.toLowerCase().trim()
  }

  const isSearchMatch = (caseItem, query) => {
    if (!query) return true
    const cleanQuery = normalizeText(query)
    if (!cleanQuery) return true

    const noiseWords = ['de', 'la', 'el', 'al', 'va', 'un', 'una', 'y', 'o', 'en', 'con', 'para', 'del', 'los', 'las']
    const keywords = cleanQuery.split(/\s+/).filter(word => word.length > 1 && !noiseWords.includes(word))
    
    const searchTerms = keywords.length > 0 ? keywords : [cleanQuery]
    
    const fieldsToSearch = [
      normalizeText(caseItem.title),
      normalizeText(caseItem.description),
      normalizeText(caseItem.polished_description),
      normalizeText(caseItem.category),
      normalizeText(caseItem.region),
      normalizeText(caseItem.city)
    ]

    return searchTerms.every(term => 
      fieldsToSearch.some(field => field.includes(term))
    )
  }

  const filteredCasesList = searchCasesList.filter(caseItem => {
    return isSpecialtyMatch(caseItem.category, filterSpecialty) &&
           isRegionMatch(caseItem.region, filterRegion) &&
           isUrgencyMatch(caseItem.urgency, filterUrgency) &&
           isSearchMatch(caseItem, searchQuery)
  })

  const sortedCasesList = [...filteredCasesList].sort((a, b) => {
    if (sortBy === 'recientes') {
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    }
    if (sortBy === 'cuantía') {
      return (b.estimated_amount || 0) - (a.estimated_amount || 0)
    }
    if (sortBy === 'urgencia') {
      const urgencyScore = { alta: 3, media: 2, baja: 1 }
      const aScore = urgencyScore[(a.urgency || '').toLowerCase()] || 0
      const bScore = urgencyScore[(b.urgency || '').toLowerCase()] || 0
      return bScore - aScore
    }
    return 0
  })

  // Función para obtener casos publicados desde Supabase
  const fetchPublishedCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          proposals:proposals!proposals_case_id_fkey (
            id,
            lawyer_id,
            status
          )
        `)
        .eq('admin_status', 'aprobado')
        .eq('status', 'activo')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const processedCases = (data || [])
        .filter(c => {
          // Excluir casos donde el abogado actual tiene una propuesta rechazada
          const myProposal = c.proposals?.find(p => p.lawyer_id === user?.id)
          return !myProposal || myProposal.status !== 'rechazada'
        })
        .map(c => ({
          ...c,
          bids_count: c.proposals ? c.proposals.length : 0,
          has_applied: c.proposals ? c.proposals.some(p => p.lawyer_id === user?.id) : false
        }))

      setSearchCasesList(processedCases)
    } catch (err) {
      console.error('Error al obtener los casos publicados:', err)
    } finally {
      setLoadingCases(false)
    }
  }

  // Función para obtener casos activos (en progreso donde el abogado fue aceptado)
  const fetchActiveCases = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          proposals!proposals_case_id_fkey!inner (
            id,
            lawyer_id,
            status
          )
        `)
        .eq('status', 'en_progreso')
        .eq('proposals.lawyer_id', user.id)
        .eq('proposals.status', 'aceptada')
        .order('created_at', { ascending: false })

      if (error) throw error
      setActiveCasesList(data || [])
    } catch (err) {
      console.error('Error al obtener casos activos:', err)
    }
  }

  const fetchPackages = async () => {
    try {
      setLoadingPackages(true)
      const { data, error } = await supabase
        .from('token_packages')
        .select('id, name, tokens, price_clp')
        .eq('is_active', true)
        .order('price_clp', { ascending: true })

      if (error) throw error
      setPackages(data || [])
    } catch (err) {
      console.error('Error al obtener paquetes de tokens:', err)
    } finally {
      setLoadingPackages(false)
    }
  }

  const fetchTokenData = async () => {
    if (!user) return
    try {
      setLoadingTokens(true)

      // 1. Obtener balance de tokens desde token_ledger
      const { data: ledgerData, error: ledgerError } = await supabase
        .from('token_ledger')
        .select('amount')
        .eq('lawyer_id', user.id)

      if (ledgerError) throw ledgerError
      const balance = (ledgerData || []).reduce((acc, curr) => acc + curr.amount, 0)
      setTokenBalance(balance)

      // 2. Obtener el plan activo desde payments y token_packages
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('package_id')
        .eq('lawyer_id', user.id)
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (paymentError) throw paymentError

      if (paymentData && paymentData.package_id) {
        const { data: packageData, error: packageError } = await supabase
          .from('token_packages')
          .select('name, tokens')
          .eq('id', paymentData.package_id)
          .maybeSingle()

        if (packageError) throw packageError
        if (packageData) {
           setActivePlan({
             name: packageData.name,
             tokens_amount: packageData.tokens || 0
           })
        } else {
          setActivePlan({ name: 'Ninguno', tokens_amount: 0 })
        }
      } else {
        setActivePlan({ name: 'Ninguno', tokens_amount: 0 })
      }

      // 3. Obtener tokens consumidos este mes (transacciones negativas del mes actual)
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: usedData, error: usedError } = await supabase
        .from('token_ledger')
        .select('amount')
        .eq('lawyer_id', user.id)
        .lt('amount', 0)
        .gte('created_at', startOfMonth.toISOString())

      if (usedError) throw usedError
      const usedSum = (usedData || []).reduce((acc, curr) => acc + Math.abs(curr.amount), 0)
      setUsedTokensThisMonth(usedSum)

      // 4. Obtener las últimas 5 transacciones para el historial reciente
      const { data: ledgerHistory, error: historyError } = await supabase
        .from('token_ledger')
        .select('*')
        .eq('lawyer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (historyError) throw historyError
      setRecentTransactions(ledgerHistory || [])

    } catch (err) {
      console.error('Error al obtener datos de tokens:', err)
    } finally {
      setLoadingTokens(false)
    }
  }

  const fetchLawyerProfile = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('lawyer_profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error
      if (data) {
        setLawyerProfile(data)
      }
    } catch (err) {
      console.error('Error al obtener perfil del abogado:', err)
    }
  }

  const countWords = (text) => {
    if (!text) return 0
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const handleOpenBidModal = (caseItem) => {
    if (tokenBalance < 1) {
      setShowNoTokensModal(true)
      return
    }
    setSelectedCaseForBid(caseItem)
    setBidMessage('')
    if (lawyerProfile) {
      setBidName(`${lawyerProfile.first_name || ''} ${lawyerProfile.last_name || ''}`.trim())
    } else if (user && user.user_metadata) {
      setBidName(`${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim())
    } else {
      setBidName('')
    }
    setShowBidModal(true)
  }

  const handleMessageChange = (e) => {
    const text = e.target.value
    const words = text.trim().split(/\s+/).filter(w => w.length > 0)
    if (words.length <= 500) {
      setBidMessage(text)
    } else {
      const limitedWords = text.split(/\s+/).slice(0, 500)
      setBidMessage(limitedWords.join(' '))
    }
  }

  const handleSubmitBid = async (e) => {
    e.preventDefault()
    if (!user) return
    if (!selectedCaseForBid) return

    if (!bidName.trim()) {
      alert('Por favor ingresa tu nombre.')
      return
    }
    if (!bidMessage.trim()) {
      alert('Por favor ingresa tu propuesta.')
      return
    }

    // Validar saldo de tokens
    if (tokenBalance < 1) {
      alert('No tienes suficientes tokens para enviar una propuesta. Por favor adquiere más tokens.')
      return
    }

    // Validar límite de propuestas
    if ((selectedCaseForBid.bids_count || 0) >= 5) {
      alert('Este caso ya ha alcanzado el límite máximo de 5 propuestas.')
      return
    }

    // Validar si ya postuló
    if (selectedCaseForBid.has_applied) {
      alert('Ya has enviado una propuesta para este caso.')
      return
    }

    setSubmittingBid(true)
    try {
      // 1. Insertar propuesta en Supabase
      const { error: proposalError } = await supabase
        .from('proposals')
        .insert({
          case_id: selectedCaseForBid.id,
          lawyer_id: user.id,
          message: `[Nombre/Estudio: ${bidName.trim()}]\n\n${bidMessage.trim()}`,
          status: 'enviada'
        })

      if (proposalError) throw proposalError

      // 2. Deduct 1 token in Supabase
      const { error: ledgerError } = await supabase
        .from('token_ledger')
        .insert({
          lawyer_id: user.id,
          amount: -1,
          transaction_type: 'send_proposal',
          reference_id: selectedCaseForBid.id,
          reference_type: 'cases',
          note: `Propuesta para caso: ${selectedCaseForBid.title}`
        })

      if (ledgerError) throw ledgerError

      // 3. Refresh token data y casos
      await fetchTokenData()
      await fetchPublishedCases()

      // 4. Show success popup
      setShowBidModal(false)
      setShowSuccessModal(true)
    } catch (err) {
      console.error('Error al enviar la puja:', err)
      alert('Ocurrió un error al enviar tu puja. Por favor verifica tu saldo de tokens.')
    } finally {
      setSubmittingBid(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTokenData()
      fetchPackages()
      fetchLawyerProfile()
      fetchPublishedCases()
      fetchActiveCases()
    }
  }, [user])

  // Cargar casos inicialmente y suscribirse a cambios en tiempo real
  useEffect(() => {
    fetchPublishedCases()
    fetchActiveCases()

    // Suscripción al segundo (Realtime) para la tabla 'cases', 'proposals' y 'documents'
    const channel = supabase
      .channel('realtime:cases_and_proposals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cases' },
        (payload) => {
          console.log('Cambio en tiempo real detectado en casos:', payload)
          fetchPublishedCases()
          fetchActiveCases()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'proposals' },
        (payload) => {
          console.log('Cambio en tiempo real detectado en propuestas:', payload)
          fetchPublishedCases()
          fetchActiveCases()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'documents' },
        (payload) => {
          console.log('Cambio en tiempo real detectado en documentos:', payload)
          const activeCaseId = selectedCaseForDocsRef.current?.id
          if (activeCaseId) {
            fetchCaseDocuments(activeCaseId)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Datos provisorios recientes (Dashboard widget)
  const recentCases = [
    { id: 1, title: 'Demanda por despido injustificado', client: 'Juan P.', date: 'Hoy', status: 'Nuevo' },
    { id: 2, title: 'Divorcio de mutuo acuerdo', client: 'María G.', date: 'Ayer', status: 'En revisión' },
    { id: 3, title: 'Asesoría creación de empresa', client: 'Empresa SpA', date: 'Hace 2 días', status: 'Cerrado' }
  ]

  const renderCaseCard = (caseItem) => {
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
              <div className="flex gap-4 text-right items-center">
                 <div className="relative group sm:block hidden">
                   <div className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap cursor-help text-white ${
                     (caseItem.bids_count || 0) >= 5 ? 'bg-red-500 shadow-sm shadow-red-500/20' : 'bg-sky-500'
                   }`}>
                     {(caseItem.bids_count || 0)} de 5 propuestas
                   </div>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-[11px] font-semibold rounded-xl shadow-xl pointer-events-none opacity-0 scale-95 origin-bottom transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-hover:delay-1000 z-30 leading-relaxed text-center normal-case">
                     Señala la cantidad de propuestas que este caso ha recibido por parte de otros abogados
                     <div className="absolute top-full left-1/2 -translate-y-1 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                   </div>
                   {(caseItem.bids_count || 0) >= 5 && (
                     <div className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-wider text-right">
                       No recibe más propuestas
                     </div>
                   )}
                 </div>
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
                 <p className="text-slate-650 text-[15px] leading-relaxed">
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

                 {caseItem.has_applied && (
                    <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-2xl max-w-lg shadow-sm">
                      <h5 className="font-bold text-blue-800 text-sm mb-1.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-[18px]">info</span>
                        Propuesta enviada
                      </h5>
                      <p className="text-blue-700 text-xs font-semibold leading-relaxed">
                        Los datos de contacto del cliente se revelarán en la pestaña de <strong>Casos Activos</strong> una vez que el cliente acepte tu propuesta.
                      </p>
                    </div>
                  )}
               </div>
               
                <div className="w-full md:w-80 shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-6 space-y-2">
                  {caseItem.has_applied ? (
                    <>
                      <button 
                        disabled
                        className="bg-slate-100 text-slate-400 w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 cursor-not-allowed text-sm whitespace-nowrap border border-slate-200"
                      >
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>Propuesta enviada</span>
                      </button>
                      <p className="text-[11px] text-center text-blue-600 font-bold leading-tight">
                        ¡Ya postulaste! Esperando respuesta del cliente.
                      </p>
                    </>
                  ) : (caseItem.bids_count || 0) >= 5 ? (
                    <>
                      <button 
                        disabled
                        className="bg-slate-100 text-slate-400 w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 cursor-not-allowed text-sm whitespace-nowrap border border-slate-200"
                      >
                        <span className="material-symbols-outlined text-[18px]">block</span>
                        <span>Límite alcanzado</span>
                      </button>
                      <p className="text-[11px] text-center text-red-500 font-bold leading-tight">
                        Este caso ya no recibe más propuestas.
                      </p>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleOpenBidModal(caseItem)}
                        className="bg-[#EE6C4D] hover:bg-[#d65f42] text-white w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg focus:outline-none text-sm whitespace-nowrap"
                      >
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] leading-none shrink-0 border border-white/30 shadow-sm">
                          1
                        </div>
                        <span>Pujar por contacto</span>
                      </button>
                      <p className="text-[11px] text-center text-slate-700 font-bold leading-tight">
                        al darle al boton estarás usando 1 token
                      </p>
                    </>
                  )}
                </div>
             </div>
           </div>
         </div>
      </div>
    );
  };

  const renderDashboardView = () => (
    <div className="w-full">
      <header className="flex justify-between items-center mb-10 w-full">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Resumen.</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Tu actividad y estadísticas en LegalPath.</p>
        </div>
        <div className="flex items-center gap-4">
          {renderUserAvatar()}
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
                <h3 className="text-5xl font-black mb-1 tracking-tight">{activeCasesList.length}</h3>
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
              <h3 className="text-5xl font-black text-slate-800 mb-1 tracking-tight">
                {loadingTokens ? '...' : tokenBalance}
              </h3>
              <p className="font-semibold text-slate-500 text-sm">Tokens Disponibles</p>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Cases Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Casos Activos Recientes</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Acceso rápido a tus casos en progreso.</p>
          </div>
          <button onClick={() => setActiveTab('casos')} className="flex items-center gap-1 text-[#EE6C4D] text-sm font-bold bg-[#EE6C4D]/5 hover:bg-[#EE6C4D]/10 px-4 py-2 rounded-xl transition-colors">
            Ver todos <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {activeCasesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">folder_open</span>
              <p className="text-slate-500 font-bold text-sm">Sin casos activos en este momento</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Postula a casos para comenzar a asesorar clientes.</p>
              <button 
                onClick={() => setActiveTab('buscar')}
                className="bg-[#EE6C4D] hover:bg-[#d65f42] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors focus:outline-none"
              >
                Buscar Casos
              </button>
            </div>
          ) : (
            activeCasesList.slice(0, 5).map((caseItem) => {
              const displayDate = caseItem.created_at
                ? new Date(caseItem.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
                : 'Reciente';
              return (
                <div 
                  key={caseItem.id} 
                  onClick={() => {
                    setExpandedCaseId(caseItem.id)
                    setActiveTab('casos')
                  }}
                  className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#EE6C4D]/30 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-[#EE6C4D] group-hover:bg-[#EE6C4D]/10 transition-colors">
                      <span className="material-symbols-outlined">gavel</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-0.5">{caseItem.title || 'Caso sin título'}</h4>
                      <p className="text-sm text-slate-500 font-medium">{caseItem.alias_client || 'Usuario Anónimo'} • {displayDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      En progreso
                    </span>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-[#EE6C4D] transition-colors">chevron_right</span>
                  </div>
                </div>
              )
            })
          )}
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
        {activeCasesList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
            <span className="material-symbols-outlined text-[48px] mb-3 text-slate-300">folder_open</span>
            <p className="font-bold">No tienes casos activos en este momento.</p>
            <p className="text-xs text-slate-400 mt-1">Cuando postules y seas seleccionado para un caso, aparecerá aquí.</p>
          </div>
        ) : (
          activeCasesList.map(caseItem => {
            const displayType = caseItem.category || 'General';
            const displayRegion = caseItem.region || caseItem.city || 'No especificada';
            const displayDate = caseItem.created_at
              ? new Date(caseItem.created_at).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Reciente';
            const displayTitle = caseItem.title || 'Caso sin título';
            const displayDetails = caseItem.polished_description || caseItem.description || 'Sin descripción';

            return (
              <div key={caseItem.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                 
                 {/* Accordion Header */}
                 <button 
                   onClick={() => setExpandedCaseId(expandedCaseId === caseItem.id ? null : caseItem.id)}
                   className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors text-left focus:outline-none"
                 >
                   <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-[#EE6C4D]/10 rounded-xl flex items-center justify-center text-[#EE6C4D]">
                       <span className="material-symbols-outlined text-[24px]">
                         {displayType === 'Migratorio' ? 'public' : displayType === 'Inmobiliario' ? 'real_estate_agent' : 'account_balance'}
                       </span>
                     </div>
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">{displayType}</span>
                         <span className="text-sm font-bold text-slate-400">•</span>
                         <span className="text-sm font-bold text-slate-500">{displayDate}</span>
                       </div>
                       <h3 className="text-lg font-bold text-slate-800">{displayTitle}</h3>
                       <p className="text-sm text-slate-500 font-medium">Cliente: {caseItem.alias_client || 'Usuario Anónimo'}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-6">
                     <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                       En progreso
                     </span>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${expandedCaseId === caseItem.id ? 'bg-[#EE6C4D] text-white' : 'bg-slate-100 text-slate-500'}`}>
                       <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: expandedCaseId === caseItem.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                     </div>
                   </div>
                 </button>
                 
                 {/* Accordion Content */}
                 <div 
                   className="transition-all duration-300 ease-in-out overflow-hidden" 
                   style={{ maxHeight: expandedCaseId === caseItem.id ? '600px' : '0px', opacity: expandedCaseId === caseItem.id ? 1 : 0 }}
                 >
                   <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                     <div>
                       <h4 className="font-bold text-slate-800 mb-2">Detalles del caso</h4>
                       <p className="text-slate-600 text-[15px] leading-relaxed max-w-4xl">
                         {displayDetails}
                       </p>
                     </div>

                     {/* Contact Information (Only revealed here because client accepted the lawyer's proposal) */}
                     <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-lg shadow-sm">
                       <h5 className="font-bold text-emerald-800 text-sm mb-1.5 flex items-center gap-2">
                         <span className="material-symbols-outlined text-emerald-600 text-[18px]">contact_mail</span>
                         Datos de contacto del cliente
                       </h5>
                       <p className="text-emerald-700 text-sm font-semibold">
                         Email: <span className="text-slate-800 select-all font-mono">{caseItem.client_email || 'No disponible'}</span>
                       </p>
                     </div>

                     <div className="flex flex-wrap gap-3 pt-2 items-center">
                         <button 
                           onClick={() => handleOpenDocumentsModal(caseItem)}
                           className="bg-[#EE6C4D] hover:bg-[#d65f42] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02] focus:outline-none"
                         >
                           <span className="material-symbols-outlined text-[18px]">folder_open</span> Ver documentos adjuntos del caso
                         </button>
                         <button 
                           onClick={() => {
                             setSelectedCaseForFinish(caseItem)
                             setShowFinishModal(true)
                           }}
                           className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 hover:scale-[1.02] focus:outline-none"
                         >
                           <span className="material-symbols-outlined text-[18px]">check_circle</span> Finalizar caso
                         </button>
                         <button 
                           onClick={() => {
                             setSelectedCaseForCancel(caseItem)
                             setShowCancelCaseModal(true)
                           }}
                           className="text-red-500 hover:text-red-750 text-xs font-bold transition-all cursor-pointer hover:underline bg-transparent border-none p-0 inline-flex items-center gap-1.5 ml-2"
                         >
                           <span className="material-symbols-outlined text-[16px]">cancel</span> Desistir del caso
                         </button>
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

  const renderBuscarCasosView = () => {
    // Excluir casos donde el abogado ya postuló
    const casesForBuscar = sortedCasesList.filter(c => !c.has_applied)

    return (
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
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-[15px] font-medium text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#EE6C4D]/30 focus:border-[#EE6C4D] outline-none transition-all" 
               />
            </div>
            
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500 mr-2">
                <span className="material-symbols-outlined text-[20px]">tune</span> Filtros:
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Specialty Filter */}
                <div className="relative">
                  <select 
                    value={filterSpecialty}
                    onChange={e => setFilterSpecialty(e.target.value)}
                    className={`bg-white border rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-slate-600 focus:outline-[#EE6C4D] focus:border-[#EE6C4D] appearance-none cursor-pointer transition-all ${filterSpecialty ? 'border-[#EE6C4D] ring-1 ring-[#EE6C4D]/25 font-semibold text-[#EE6C4D]' : 'border-slate-200'}`}
                  >
                    <option value="" className="text-slate-600 font-normal">Área del derecho (Todas)</option>
                    {ALLOWED_SPECIALTIES.map(spec => (
                      <option key={spec} value={spec} className="text-slate-800 font-normal">{spec}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
                  {filterSpecialty && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </div>

                {/* Urgency Filter */}
                <div className="relative">
                  <select 
                    value={filterUrgency}
                    onChange={e => setFilterUrgency(e.target.value)}
                    className={`bg-white border rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-slate-600 focus:outline-[#EE6C4D] focus:border-[#EE6C4D] appearance-none cursor-pointer transition-all ${filterUrgency ? 'border-[#EE6C4D] ring-1 ring-[#EE6C4D]/25 font-semibold text-[#EE6C4D]' : 'border-slate-200'}`}
                  >
                    <option value="" className="text-slate-600 font-normal">Nivel de urgencia (Cualquiera)</option>
                    <option value="baja" className="text-slate-800 font-normal">Baja</option>
                    <option value="media" className="text-slate-800 font-normal">Media</option>
                    <option value="alta" className="text-slate-800 font-normal">Alta</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
                  {filterUrgency && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </div>

                {/* Region Filter */}
                <div className="relative">
                  <select 
                    value={filterRegion}
                    onChange={e => setFilterRegion(e.target.value)}
                    className={`bg-white border rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-slate-600 focus:outline-[#EE6C4D] focus:border-[#EE6C4D] appearance-none cursor-pointer transition-all ${filterRegion ? 'border-[#EE6C4D] ring-1 ring-[#EE6C4D]/25 font-semibold text-[#EE6C4D]' : 'border-slate-200'}`}
                  >
                    <option value="" className="text-slate-600 font-normal">Región (Todas)</option>
                    {ALLOWED_REGIONS.map(reg => (
                      <option key={reg} value={reg} className="text-slate-800 font-normal">{reg}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">expand_more</span>
                  {filterRegion && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <span className="text-sm font-bold text-slate-500">Ordenar por:</span>
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-slate-50 border-none rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-[#EE6C4D] cursor-pointer"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="cuantía">Mayor cuantía</option>
                  <option value="urgencia">Mayor urgencia</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* List of Search Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4 ml-2">Casos Disponibles ({casesForBuscar.length})</h3>
          
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
          ) : casesForBuscar.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-3 text-slate-300">gavel</span>
              <p className="font-bold">No hay casos que coincidan con los filtros seleccionados o a los que no hayas postulado.</p>
              <p className="text-xs text-slate-400 mt-1">Prueba cambiando los criterios de búsqueda o filtros.</p>
            </div>
          ) : (
            casesForBuscar.map(caseItem => renderCaseCard(caseItem))
          )}
        </div>
      </div>
    )
  }

  const renderPujasPendientesView = () => {
    // Casos donde el abogado ya postuló
    const casesForPujas = sortedCasesList.filter(c => c.has_applied)

    return (
      <div className="w-full">
        <header className="mb-10 w-full">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Pujas Pendientes.</h1>
            <p className="text-slate-500 mt-1 font-medium text-sm">Revisa el estado de las propuestas que has enviado a los clientes.</p>
          </div>
        </header>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4 ml-2">Tus Propuestas Enviadas ({casesForPujas.length})</h3>
          
          {loadingCases ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
              <span className="material-symbols-outlined text-[32px] animate-spin mb-2 text-[#EE6C4D]">sync</span>
              <p className="font-semibold text-sm">Cargando propuestas...</p>
            </div>
          ) : casesForPujas.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400">
              <span className="material-symbols-outlined text-[48px] mb-3 text-slate-300">hourglass_empty</span>
              <p className="font-bold">Aún no has enviado propuestas a ningún caso.</p>
              <p className="text-xs text-slate-400 mt-1">Explora la sección "Buscar casos" para postular a solicitudes activas.</p>
            </div>
          ) : (
            casesForPujas.map(caseItem => renderCaseCard(caseItem))
          )}
        </div>
      </div>
    )
  }
  // Iniciar proceso de compra
  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowProviderModal(true)
  }

  // Llamar a la Edge Function y redirigir
  const handlePayment = async (provider) => {
    if (!selectedPackage) return
    setLoadingPayment(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            packageId: selectedPackage.id,
            provider,
          }),
        }
      )

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`HTTP ${response.status}: ${text}`)
      }

      const { checkoutUrl, error } = await response.json()

      if (error || !checkoutUrl) {
        throw new Error(error || 'No checkout URL received')
      }

      // Redirigir al checkout de la pasarela
      window.location.href = checkoutUrl
    } catch (err) {
      console.error('Payment error:', err)
      alert('Ocurrió un error al iniciar el pago. Por favor intenta nuevamente.')
      setLoadingPayment(false)
    }
  }


  const renderTokensView = () => {
    const getPackageInfo = (name) => {
      switch (name) {
        case 'Starter':
          return { unitPrice: 998, popular: false }
        case 'Pro':
          return { unitPrice: 799, popular: true }
        case 'Enterprise':
          return { unitPrice: 700, popular: false }
        default:
          return { unitPrice: 1000, popular: false }
      }
    }

    return (
      <div className="w-full space-y-10">
        <header className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mis Tokens.</h1>
            <p className="text-slate-500 mt-1 font-medium text-sm">Administra tu saldo y adquiere tokens para enviar propuestas a los casos publicados.</p>
          </div>
          <div className="flex items-center gap-4">
            {renderUserAvatar()}
          </div>
        </header>

        {/* Balance and History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Saldo Actual Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 flex flex-col justify-between min-h-[220px]">
            <div className="relative z-10">
              <span className="bg-white/10 text-white text-[10px] uppercase tracking-wider font-extrabold px-4 py-1.5 rounded-full backdrop-blur-md mb-6 inline-block border border-white/5 shadow-sm">
                Saldo Actual
              </span>
              <div className="flex items-center gap-4 mt-2">
                <span className="material-symbols-outlined text-[#EE6C4D] text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>toll</span>
                <div>
                  <h3 className="text-5xl font-black tracking-tight leading-none animate-pulse">
                    {loadingTokens ? '...' : tokenBalance}
                  </h3>
                  <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-wider">Tokens Disponibles</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#EE6C4D]/25 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Historial Reciente */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div className="w-full">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">history</span> Historial Reciente
              </h3>
              
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <p className="text-slate-400 text-xs font-semibold py-4">No se han registrado movimientos de tokens aún.</p>
                ) : (
                  recentTransactions.map((tx) => {
                    const isCredit = tx.amount > 0;
                    const dateStr = new Date(tx.created_at).toLocaleDateString('es-CL', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    return (
                      <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 text-xs font-semibold text-slate-650">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isCredit ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          <span className="text-slate-700">{tx.note || 'Movimiento de tokens'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400">{dateStr}</span>
                          <span className={`font-black font-mono text-sm ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isCredit ? `+${tx.amount}` : tx.amount}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Comprar Tokens</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">Elige uno de nuestros paquetes para sumar tokens al instante y pujar por más casos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingPackages ? (
              <div className="col-span-3 text-center text-slate-500 font-semibold py-12 flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[24px] animate-spin text-[#EE6C4D]">sync</span>
                <span>Cargando paquetes de tokens...</span>
              </div>
            ) : packages.length === 0 ? (
              <div className="col-span-3 text-center text-slate-500 font-semibold py-12">
                No hay paquetes de tokens activos disponibles en este momento.
              </div>
            ) : (
              packages.map((pkg) => {
                const pkgInfo = getPackageInfo(pkg.name);
                const formattedPrice = parseInt(pkg.price_clp).toLocaleString('es-CL');
                return (
                  <div 
                    key={pkg.id} 
                    className={`bg-white rounded-3xl p-6 flex flex-col justify-between relative border shadow-sm transition-all duration-300 hover:shadow-md ${
                      pkgInfo.popular ? 'border-2 border-[#EE6C4D] ring-2 ring-[#EE6C4D]/10' : 'border-slate-200'
                    }`}
                  >
                    {pkgInfo.popular && (
                      <span className="absolute -top-3 right-6 bg-[#EE6C4D] text-white text-[9px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        ⭐ RECOMENDADO
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-extrabold text-slate-800">{pkg.name}</h4>
                        <p className="text-[#EE6C4D] text-2xl font-black mt-1">{pkg.tokens} tokens</p>
                      </div>

                      <div className="flex items-baseline gap-1 py-2">
                        <span className="text-2xl font-black text-slate-800">${formattedPrice}</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">CLP</span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Precio por Token</p>
                        <p className="text-sm font-bold text-slate-700 mt-0.5">${pkgInfo.unitPrice} CLP</p>
                      </div>

                      <ul className="space-y-2 text-xs font-semibold text-slate-500 pt-2">
                        <li className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-500 text-[16px]">check_circle</span>
                          <span>Acreditación instantánea</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-500 text-[16px]">check_circle</span>
                          <span>Sin vencimiento mensual</span>
                        </li>
                      </ul>
                    </div>

                    <button 
                      onClick={() => handleSelectPackage(pkg)}
                      className="w-full mt-6 py-3.5 bg-[#EE6C4D] hover:bg-[#d65f42] text-white font-extrabold rounded-2xl text-sm transition-all shadow-md hover:shadow-lg focus:outline-none"
                    >
                      Comprar
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleFinishCase = async () => {
    if (!selectedCaseForFinish) return
    setFinishing(true)
    try {
      const { error } = await supabase
        .from('cases')
        .update({ status: 'finalizado' })
        .eq('id', selectedCaseForFinish.id)

      if (error) throw error

      setShowFinishModal(false)
      setSelectedCaseForFinish(null)
      await fetchActiveCases()
    } catch (err) {
      console.error('Error al finalizar el caso:', err)
      alert('Error al finalizar el caso: ' + (err.message || err))
    } finally {
      setFinishing(false)
    }
  }

  const handleCancelCaseAssignment = async () => {
    if (!selectedCaseForCancel) return
    setCanceling(true)
    try {
      const proposal = selectedCaseForCancel.proposals?.[0]
      if (!proposal) {
        throw new Error('No se encontró la propuesta aceptada para este caso.')
      }

      // 1. Update proposal status to 'rechazada'
      const { error: propErr } = await supabase
        .from('proposals')
        .update({ status: 'rechazada' })
        .eq('id', proposal.id)

      if (propErr) throw propErr

      // 2. Free the case (set accepted_proposal_id to null and status to 'activo')
      const { error: caseErr } = await supabase
        .from('cases')
        .update({
          accepted_proposal_id: null,
          status: 'activo'
        })
        .eq('id', selectedCaseForCancel.id)

      if (caseErr) throw caseErr

      setShowCancelCaseModal(false)
      setSelectedCaseForCancel(null)
      await fetchActiveCases()
      await fetchPublishedCases()
    } catch (err) {
      console.error('Error al desistir del caso:', err)
      alert('Error al desistir del caso: ' + (err.message || err))
    } finally {
      setCanceling(false)
    }
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
            <SidebarItem 
              icon="history" 
              label="Pujas pendientes" 
              active={activeTab === 'pujas'} 
              onClick={() => setActiveTab('pujas')}
              badge={searchCasesList.filter(c => c.has_applied).length > 0 ? searchCasesList.filter(c => c.has_applied).length : null}
            />
            <SidebarItem icon="search" label="Buscar casos" active={activeTab === 'buscar'} onClick={() => setActiveTab('buscar')} />
            <SidebarItem icon="toll" label="Mis tokens" active={activeTab === 'tokens'} onClick={() => setActiveTab('tokens')} />
          </nav>
        </div>
        <div className="p-4 border-t border-slate-100 space-y-1">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-help-modal'))}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-xl transition-all font-semibold text-left"
          >
            <span className="material-symbols-outlined">help</span>
            <span>Ayuda</span>
          </button>
          <Link to="/auth/perfil" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#EE6C4D] rounded-xl transition-all font-semibold">
            <span className="material-symbols-outlined">settings</span>
            <span>Configuración</span>
          </Link>
          <button 
            onClick={async () => {
              await signOut()
              navigate('/auth/login')
            }} 
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-semibold text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 xl:p-12 min-h-screen overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && renderDashboardView()}
          {activeTab === 'casos' && renderCasosActivosView()}
          {activeTab === 'pujas' && renderPujasPendientesView()}
          {activeTab === 'buscar' && renderBuscarCasosView()}
          {activeTab === 'tokens' && renderTokensView()}
        </div>
      </main>

      {/* Modal de Puja por Caso */}
      {showBidModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-xl w-full p-8 relative space-y-6">
            <button 
              onClick={() => setShowBidModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center aspect-square shrink-0 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200"
            >
              <span className="material-symbols-outlined text-[18px] block">close</span>
            </button>

            <div className="space-y-2">
              <span className="bg-[#EE6C4D]/10 text-[#EE6C4D] text-[11px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full inline-block">
                Confirmación de Puja
              </span>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                Pujar por Caso: {selectedCaseForBid?.title}
              </h3>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-orange-850 text-sm leading-relaxed font-medium">
              Estás a punto de entrar en la puja por tomar este caso. A continuación puedes escribir, puedes presentarte, puedes señalar tus honorarios, tiempos estimados y todo lo que estimes conveniente.
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tu Nombre / Estudio</label>
                <input 
                  type="text"
                  required
                  value={bidName}
                  onChange={e => setBidName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#EE6C4D]/30 focus:border-[#EE6C4D] outline-none transition-all font-semibold text-slate-800"
                  placeholder="Ej: Elena Ramírez o Estudio Jurídico Asociado"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Presentación y Propuesta</label>
                  <span className={`text-[11px] font-mono font-bold ${countWords(bidMessage) > 450 ? 'text-red-500' : 'text-slate-400'}`}>
                    {countWords(bidMessage)} / 500 palabras
                  </span>
                </div>
                <textarea 
                  required
                  rows={6}
                  value={bidMessage}
                  onChange={handleMessageChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-[#EE6C4D]/30 focus:border-[#EE6C4D] outline-none transition-all min-h-[140px] resize-none text-slate-800 leading-relaxed"
                  placeholder="Escribe tus honorarios estimados, plazos de respuesta, tu experiencia relevante en esta área, y por qué eres la mejor opción..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="px-5 py-3 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-all text-slate-500 text-sm focus:outline-none"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submittingBid}
                  className="bg-[#EE6C4D] hover:bg-[#d65f42] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm flex items-center gap-2 focus:outline-none disabled:opacity-50"
                >
                  {submittingBid ? 'Procesando...' : (
                    <>
                      <div className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white font-black text-[9px] leading-none shrink-0 border border-white/20">1</div>
                      Confirmar y Usar Token
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Éxito de Puja */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-8 text-center space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Soft decorative blur */}
            <div className="absolute -right-10 -top-10 w-24 h-24 bg-[#EE6C4D]/10 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight font-headline">¡Puja Enviada!</h3>
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">
                1 token utilizado con éxito
              </p>
            </div>

            {/* Structured Next Steps */}
            <div className="text-left bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3.5">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">¿Qué pasa ahora?</p>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-500 shrink-0 border border-slate-100">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Límite de competencia</h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-medium">
                    El cliente recibe un máximo de 5 propuestas. ¡Ya estás compitiendo!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-500 shrink-0 border border-slate-100">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Notificación directa</h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5 font-medium">
                    Te enviaremos un email tan pronto como el cliente te seleccione o elija otra opción.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3.5 bg-[#EE6C4D] hover:bg-[#d65f42] text-white font-extrabold rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Modal de Sin Tokens */}
      {showNoTokensModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-100 animate-bounce">
              <span className="material-symbols-outlined text-[32px]">toll</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Ups, te quedaste sin tokens</h3>
              <p className="text-slate-650 text-sm leading-relaxed">
                Necesitas tener al menos 1 token para poder realizar una propuesta y obtener los datos de contacto de este cliente. Puedes adquirir más créditos en la sección de tokens.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setShowNoTokensModal(false)
                  setActiveTab('tokens')
                }}
                className="w-full py-3.5 bg-[#EE6C4D] hover:bg-[#d65f42] text-white font-bold rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                Adquirir tokens
              </button>
              <button
                onClick={() => setShowNoTokensModal(false)}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Documentos Adjuntos del Caso */}
      {showDocumentsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-xl w-full p-8 relative space-y-6 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => {
                setShowDocumentsModal(false)
                setSelectedCaseForDocs(null)
                setCaseDocuments([])
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center aspect-square shrink-0 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200"
            >
              <span className="material-symbols-outlined text-[18px] block">close</span>
            </button>

            <div className="space-y-2">
              <span className="bg-[#EE6C4D]/10 text-[#EE6C4D] text-[11px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full inline-block">
                Expediente Digital
              </span>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                Documentos Adjuntos
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Caso: {selectedCaseForDocs?.title}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4">
              {loadingDocuments ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                  <span className="material-symbols-outlined text-[32px] animate-spin mb-2 text-[#EE6C4D]">sync</span>
                  <p className="font-semibold text-sm">Cargando documentos en tiempo real...</p>
                </div>
              ) : caseDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-slate-300 text-4xl mb-2">folder_open</span>
                  <p className="text-slate-500 font-bold text-sm">Sin documentos adjuntos</p>
                  <p className="text-xs text-slate-400 mt-1">El cliente no ha subido archivos para este caso.</p>
                </div>
              ) : (
                <div className="max-h-[350px] overflow-y-auto pr-1 space-y-3">
                  <ul className="space-y-2.5">
                    {caseDocuments.map(doc => {
                      const fileExt = doc.file_name?.split('.').pop()?.toUpperCase() || 'DOC';
                      return (
                        <li key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl transition-all duration-200 group">
                          <div className="flex items-center gap-3 truncate mr-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 group-hover:bg-[#EE6C4D]/10 group-hover:text-[#EE6C4D] group-hover:border-transparent transition-all">
                              <span className="material-symbols-outlined text-[22px]">description</span>
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-bold text-slate-700 truncate" title={doc.file_name}>
                                {doc.file_name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono font-bold">
                                {fileExt}
                              </p>
                            </div>
                          </div>
                          <a
                            href={doc.storage_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#EE6C4D] bg-[#EE6C4D]/5 border border-[#EE6C4D]/10 hover:bg-[#EE6C4D] hover:text-white transition-all duration-200 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            Ver PDF
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDocumentsModal(false)
                  setSelectedCaseForDocs(null)
                  setCaseDocuments([])
                }}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors shadow-md w-full"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Finalizar Caso */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-8 text-center space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden flex flex-col items-center">
            {/* Close Button */}
            <button 
              onClick={() => setShowFinishModal(false)}
              disabled={finishing}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center aspect-square shrink-0 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px] block">close</span>
            </button>

            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-100 shadow-sm">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight font-headline">¿Estás seguro que quieres dar el caso por finalizado?</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Esto implica que ya finalizaste todas las gestiones con el cliente, se da por concluido el servicio y el caso se archivará.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                disabled={finishing}
                className="flex-1 py-3 px-5 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-all text-slate-500 text-sm focus:outline-none disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleFinishCase}
                disabled={finishing}
                className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50"
              >
                {finishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <span>Sí, Finalizar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Desistir de Caso */}
      {showCancelCaseModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-8 text-center space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden flex flex-col items-center">
            {/* Close Button */}
            <button 
              onClick={() => setShowCancelCaseModal(false)}
              disabled={canceling}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center aspect-square shrink-0 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px] block">close</span>
            </button>

            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-100 shadow-sm">
              <span className="material-symbols-outlined text-[36px]">warning</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight font-headline">¿Desistir de este caso?</h3>
              <p className="text-slate-550 text-xs font-semibold leading-relaxed">
                ¿Está seguro de que no desea continuar con este caso? Se liberará la publicación para que otros abogados puedan postular y ya no tendrás acceso a la información de contacto del cliente.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              <button
                type="button"
                onClick={() => setShowCancelCaseModal(false)}
                disabled={canceling}
                className="flex-1 py-3 px-5 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-all text-slate-500 text-sm focus:outline-none disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCancelCaseAssignment}
                disabled={canceling}
                className="flex-1 py-3 px-5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50"
              >
                {canceling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <span>Sí, Desistir</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Selección de Pasarela de Pago */}
      {showProviderModal && selectedPackage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-8 text-center space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <button 
              onClick={() => setShowProviderModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors w-8 h-8 flex items-center justify-center aspect-square shrink-0 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200"
            >
              <span className="material-symbols-outlined text-[18px] block">close</span>
            </button>

            <div className="space-y-2">
              <span className="bg-[#EE6C4D]/10 text-[#EE6C4D] text-[11px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-full inline-block">
                Método de Pago
              </span>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                Paquete {selectedPackage.name} — ${parseInt(selectedPackage.price_clp).toLocaleString('es-CL')} CLP
              </h3>
              <p className="text-slate-500 text-sm font-medium">¿Con qué método deseas pagar?</p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => handlePayment('flow')}
                disabled={loadingPayment}
                className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-extrabold rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">payments</span>
                <span>Pagar con Flow (Webpay)</span>
              </button>
              
              <button
                onClick={() => handlePayment('mercadopago')}
                disabled={loadingPayment}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-2xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">credit_card</span>
                <span>Pagar con MercadoPago</span>
              </button>
            </div>

            <button
              onClick={() => setShowProviderModal(false)}
              disabled={loadingPayment}
              className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper Component for Sidebar Items
const SidebarItem = ({ icon, label, active, onClick, badge }) => {
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
      {badge && (
        <span className="ml-auto bg-[#EE6C4D] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {active && !badge && <div className="ml-auto w-1.5 h-1.5 bg-[#EE6C4D] rounded-full"></div>}
    </button>
  )
}

export default Dashboard
