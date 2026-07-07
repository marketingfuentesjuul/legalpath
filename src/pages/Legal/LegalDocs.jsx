import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { legalDocuments } from './legalData'

const docTabs = [
  { id: 'terminos', label: 'Términos y Condiciones' },
  { id: 'privacidad', label: 'Política de Privacidad' },
  { id: 'tokens', label: 'Política de Tokens y Pagos' },
  { id: 'devoluciones', label: 'Devoluciones y Reembolsos' },
  { id: 'uso-aceptable', label: 'Uso Aceptable' },
  { id: 'aviso-legal', label: 'Aviso Legal y Descargo' },
]

const definitionTerms = new Set([
  'Usuario', 'Cliente', 'Abogado', 'Administrador', 'Caso', 'Propuesta', 'Match', 'Token', 'RUT', 'PJUD', 'Cuenta', 'Servicio', 'Plataforma', 'Términos',
  'Datos Personales', 'Datos Sensibles', 'Responsable del Tratamiento', 'Encargado del Tratamiento', 'Titular', 'Tratamiento',
  'Flow', 'MercadoPago', 'IVA', 'Ledger', 'Reembolso', 'Pasarela de Pago', 'Contracargo', 'Aviso Legal', 'Descargo'
])


const LegalDocs = () => {
  const { docType } = useParams()
  const navigate = useNavigate()
  
  // Default to terminos if not specified or invalid
  const activeTabId = docTabs.some(t => t.id === docType) ? docType : 'terminos'
  const activeDoc = legalDocuments[activeTabId]

  const [activeSection, setActiveSection] = useState('')

  // Redirect if URL is just /legal or has an invalid docType
  useEffect(() => {
    if (!docType || !legalDocuments[docType]) {
      navigate(`/legal/${activeTabId}`, { replace: true })
    }
  }, [docType, activeTabId, navigate])

  // Get all sections for the active document (to generate the TOC)
  const sections = activeDoc?.paragraphs
    .filter(p => p.type === 'section')
    .map((p, idx) => {
      // Create a URL-friendly anchor ID
      const text = p.text
      const anchorId = text
        .toLowerCase()
        .replace(/^\d+\.\s*/, '') // Remove prefix numbers
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace spaces/special chars with hyphens
        .replace(/(^-|-$)/g, '') // Trim trailing/leading hyphens
      
      return {
        id: anchorId,
        text: text,
        originalText: text
      }
    }) || []

  // Track scroll position to update active section in TOC
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120 // Offset for sticky header
      
      // Find the current section
      let currentSection = ''
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const offsetTop = element.offsetTop
          if (scrollPosition >= offsetTop) {
            currentSection = section.id
          }
        }
      }
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    // Run once initially
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections, activeTabId])

  // Helper to map paragraphs to JSX
  const renderParagraph = (p, idx) => {
    if (p.type === 'section') {
      // Find corresponding anchor id
      const secObj = sections.find(s => s.originalText === p.text)
      const anchorId = secObj ? secObj.id : `section-${idx}`
      
      return (
        <h2 
          key={idx} 
          id={anchorId} 
          className="text-xl md:text-2xl font-black text-on-background mt-16 mb-6 pb-3 border-b border-slate-100 scroll-mt-28 tracking-tight font-headline"
        >
          {p.text}
        </h2>
      )
    }
    
    if (p.type === 'subsection') {
      return (
        <h3 key={idx} className="text-base md:text-lg font-bold text-on-background mt-10 mb-4 tracking-tight font-headline">
          {p.text}
        </h3>
      )
    }
    
    if (p.type === 'list-item') {
      return (
        <li key={idx} className="ml-6 list-disc text-slate-600 text-sm md:text-[15px] lg:text-base leading-relaxed mb-3 pl-1 font-body">
          {p.text}
        </li>
      )
    }
    
    // Regular paragraph
    // Make declarations like "Declaración esencial:" bold/italic
    if (p.text.startsWith('Declaración esencial:') || p.text.startsWith('Declaración Esencial:')) {
      const restOfText = p.text.replace(/^[Dd]eclaración\s+esencial:\s*/, '')
      return (
        <p key={idx} className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl text-primary font-body text-sm md:text-base leading-relaxed mb-6 shadow-sm">
          <strong className="font-extrabold uppercase tracking-wide text-xs block mb-2">Declaración Esencial:</strong>
          <span className="italic">{restOfText}</span>
        </p>
      )
    }

    if (p.type === 'paragraph' && definitionTerms.has(p.text)) {
      return (
        <h4 key={idx} className="text-[#141b2c] font-black text-[15px] md:text-base mt-6 mb-1 tracking-tight font-headline">
          {p.text}
        </h4>
      )
    }

    return (
      <p key={idx} className="text-slate-600 text-sm md:text-[15px] lg:text-base leading-relaxed mb-6 font-body">
        {p.text}
      </p>
    )
  }

  if (!activeDoc) return null

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      {/* Banner / Header */}
      <div className="w-full bg-[#0F141E] text-white py-20 px-6 md:px-12 relative overflow-hidden mb-12">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16"></div>

        <div className="max-w-[1440px] mx-auto text-center relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight font-headline">
            Centro de Documentación Legal
          </h1>
          <p className="text-slate-400 mt-5 text-sm md:text-xl max-w-3xl mx-auto font-body font-light leading-relaxed">
            Consulta los términos y condiciones, políticas de privacidad, reglas de uso de la plataforma y devoluciones de LegalPath.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Mobile Navigation Dropdown */}
        <div className="block md:hidden mb-8">
          <label htmlFor="doc-selector" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Documento Activo
          </label>
          <select
            id="doc-selector"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm text-on-background font-medium"
            value={activeTabId}
            onChange={(e) => navigate(`/legal/${e.target.value}`)}
          >
            {docTabs.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* 3-Column Layout with optimized spacing */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
          {/* Left Sidebar: Document List (Desktop only) */}
          <aside className="hidden md:block w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white rounded-3xl border border-slate-100/70 p-5 shadow-[0_8px_30px_rgba(20,27,44,0.02)]">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">
                Documentos
              </h3>
              <nav className="flex flex-col gap-1.5">
                {docTabs.map((tab) => {
                  const isActive = tab.id === activeTabId
                  return (
                    <Link
                      key={tab.id}
                      to={`/legal/${tab.id}`}
                      className={`text-[14px] py-3 px-4 rounded-xl font-bold tracking-tight transition-all duration-200 flex items-center justify-between ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-on-background'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isActive && (
                        <span className="material-symbols-outlined text-[16px] font-bold">
                          chevron_right
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Middle Column: Document Content (Wider, optimized padding) */}
          <main className="flex-1 bg-white rounded-3xl border border-slate-100/70 p-6 md:p-10 lg:p-12 shadow-[0_8px_30px_rgba(20,27,44,0.02)] min-w-0">
            <div className="mb-10 border-b border-slate-100 pb-8">
              <h1 className="text-3xl md:text-4xl font-black text-on-background tracking-tight font-headline mb-4 leading-tight">
                {activeDoc.title}
              </h1>
              {activeDoc.version && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  {activeDoc.version}
                </div>
              )}
            </div>

            <div className="prose max-w-none text-slate-600 font-body">
              {activeDoc.paragraphs.map((p, idx) => renderParagraph(p, idx))}
            </div>
          </main>

          {/* Right Sidebar: Table of Contents (Desktop only, slightly narrower) */}
          {sections.length > 0 && (
            <aside className="hidden xl:block w-52 xl:w-56 flex-shrink-0">
              <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 pb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
                  En esta sección
                </h4>
                <ul className="flex flex-col gap-2 border-l border-slate-200/60 pl-4 text-[13px]">
                  {sections.map((sec) => {
                    const isSectionActive = activeSection === sec.id
                    return (
                      <li key={sec.id}>
                        <a
                          href={`#${sec.id}`}
                          onClick={(e) => {
                            e.preventDefault()
                            const element = document.getElementById(sec.id)
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' })
                              // Update hash in URL
                              window.history.pushState(null, '', `#${sec.id}`)
                            }
                          }}
                          className={`block py-1 font-medium leading-relaxed transition-colors hover:text-primary ${
                            isSectionActive
                              ? 'text-primary font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          {sec.text.replace(/^\d+\.\s*/, '')}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

export default LegalDocs
