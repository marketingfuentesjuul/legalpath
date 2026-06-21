import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  const renderSafeHtml = (text) => {
    return text.split(/(<strong>.*?<\/strong>)/g).map((part, i) => {
      if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
        return <strong key={i} className="font-extrabold text-on-background">{part.substring(8, part.length - 9)}</strong>
      }
      return part
    })
  }

  return (
    <div className={`faq-item border transition-all duration-300 rounded-[1.5rem] overflow-hidden ${
      isOpen 
        ? 'bg-white border-primary-container/30 shadow-[0_12px_25px_rgba(0,107,86,0.04)]' 
        : 'bg-[#f8fafc]/70 hover:bg-[#f8fafc] border-slate-100/80'
    }`}>
      <button
        className="w-full flex items-center justify-between p-6 md:p-7 text-left gap-4 cursor-pointer"
        onClick={onClick}
      >
        <span className="font-bold text-on-background text-base md:text-lg tracking-tight leading-snug">{question}</span>
        <span className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-primary-container text-white shadow-md shadow-primary-container/20 rotate-180' 
            : 'bg-slate-200/60 text-slate-500'
        }`}>
          <span className="material-symbols-outlined text-lg font-bold">keyboard_arrow_down</span>
        </span>
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100 pb-6 px-6 md:pb-7 md:px-7' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <p className="text-secondary text-sm md:text-base leading-relaxed">
          {renderSafeHtml(answer)}
        </p>
      </div>
    </div>
  )
}

const Home = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null)
  const typingRef = useRef(null)

  useEffect(() => {
    let i = 0
    let timeoutId
    const fullText = "Necesito ayuda con un contrato de arriendo que no se ha cumplido. El arrendatario no ha pagado en 3 meses y necesito asesoría para..."

    if (typingRef.current) {
      typingRef.current.textContent = ''
    }

    const typeChar = () => {
      if (i < fullText.length) {
        if (typingRef.current) {
          typingRef.current.textContent += fullText.charAt(i)
        }
        i++
        timeoutId = setTimeout(typeChar, 45 + Math.random() * 35)
      } else {
        timeoutId = setTimeout(() => {
          if (typingRef.current) {
            typingRef.current.textContent = ''
          }
          i = 0
          timeoutId = setTimeout(typeChar, 800)
        }, 4000)
      }
    }

    timeoutId = setTimeout(typeChar, 1200)
    return () => clearTimeout(timeoutId)
  }, [])

  const faqs = [
    { q: "¿Cuánto cuesta publicar mi caso?", a: "Publicar tu caso en LegalPath es completamente <strong>gratis y sin compromiso</strong>. No pagas nada hasta que elijas al abogado con quien quieras trabajar. El costo de los honorarios profesionales lo acuerdan directamente tú y el abogado." },
    { q: "¿En cuánto tiempo recibiré propuestas de abogados?", a: "En promedio, nuestros usuarios reciben sus primeras propuestas en <strong>menos de 24 horas</strong>. El tiempo exacto depende del área legal de tu caso y la disponibilidad de los especialistas." },
    { q: "¿Mi información es confidencial?", a: "Sí, 100%. Tu caso es publicado de forma anónima y solo los abogados registrados en nuestra plataforma pueden ver los detalles. Tu identidad <strong>jamás es revelada sin tu autorización</strong>." },
    { q: "¿Los abogados de la plataforma están verificados?", a: "Sí. Todos los abogados en LegalPath pasan por un proceso de verificación donde confirmamos su <strong>título profesional, registro en el Colegio de Abogados y especialidad</strong>. Puedes ver su perfil, reseñas y experiencia antes de elegir." },
    { q: "¿Qué tipo de casos puedo publicar?", a: "Puedes publicar cualquier tipo de caso legal: derecho de familia, civil, laboral, inmobiliario, penal, comercial, entre otros. No necesitas saber a qué área corresponde tu problema; <strong>nuestro sistema te ayuda a identificarlo</strong>." },
    { q: "¿Qué pasa si no me convence ninguna propuesta?", a: "No hay problema. <strong>No tienes ninguna obligación de contratar</strong>. Si las propuestas recibidas no te convencen, puedes cerrar tu publicación, modificarla para atraer más abogados o simplemente no hacer nada." },
    { q: "¿Puedo adjuntar documentos a mi caso?", a: "Sí. Al publicar tu caso puedes adjuntar imágenes, pantallazos, correos, contratos o cualquier documento relevante. <strong>Más contexto = mejores propuestas</strong> de los abogados especializados." },
  ]

  return (
    <>
      <style>{`
        .glass-card { background: rgba(255,255,255,0.8); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .mint-gradient { background: linear-gradient(135deg, #006b56 0%, #1ecca7 100%); }
        .soft-mint-glow { box-shadow: 0 20px 40px rgba(30,204,167,0.15); }
        .floating { animation: floating 6s ease-in-out infinite; }
        .floating-delayed { animation: floating 7s ease-in-out 1s infinite; }
        @keyframes floating { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        
        @keyframes flowPath {
          from { stroke-dashoffset: 240; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes flowPathReverse {
          from { stroke-dashoffset: -240; }
          to { stroke-dashoffset: 0; }
        }
        .flowing-path {
          stroke-dasharray: 40 80;
          animation: flowPath 15s linear infinite;
        }
        .flowing-path-reverse {
          stroke-dasharray: 30 70;
          animation: flowPathReverse 12s linear infinite;
        }
        @keyframes ctaSway {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .cta-sway-1 {
          animation: ctaSway 14s ease-in-out infinite;
        }
        .cta-sway-2 {
          animation: ctaSway 18s ease-in-out infinite alternate;
        }
      `}</style>

      <main className="pt-14">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6 md:px-12 pt-16 pb-20 md:pb-28"
        >
          {/* Background Gradient Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-container/10 blur-[120px] rounded-full -z-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary-container/20 blur-[120px] rounded-full -z-10"></div>
          
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
            {/* Left Column: Text & Actions */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container/10 text-primary-container rounded-full text-xs font-bold tracking-widest uppercase mx-auto lg:mx-0">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                Justicia accesible para todos
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-on-background">
                Publica tu caso y que los abogados te <span className="text-[#1ECCA7]">encuentren</span>.
              </h1>
              
              <p className="text-lg md:text-xl text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
                Publica tu caso de <b>forma anónima y gratuita, </b>espera a que los abogados te contacten y tú eres el que <b>elige</b> a cuál de los especialistas tomar<b>.</b>
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                <Link to="/publicar-caso" className="mint-gradient text-on-primary px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:scale-105 transition-transform text-center inline-block">
                  Publicar mi caso
                </Link>
                <a href="#como-funciona" className="bg-white text-on-secondary-container border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-colors shadow-sm text-center inline-block">
                  ¿Cómo funciona?
                </a>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-6 border-t border-slate-100 max-w-md mx-auto lg:mx-0">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7gHVFA_44sVTI3dIJdNfmIHjR5MsEaaN756hFDsDofbdSw9lUu_90kkE5VEMCQd6uLzwCwVXHUYqX2tfTpdRwE7WAfuy45EXY2RaSUogIeRke2YnajdcGTnnRC2DsS_UD-7JtMHi5EYmNCTSOZ20tV9_zavYxdUNl5AbE9lq8tGIpb4X8hKZw2IA74Uq6Nv4ZdoeJCJDwtLUjT08aYuB07SnjLraCuGOKIoZGWMVdB6Y0EIkq6525T1bat4nwC3AdBmKh3EzHtuI" alt="Avatar" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvREyG3tmjBSqXfmUxfvfT905OfRk5znbhwRt9xTq3jP7JWvpwQIgCPgZbxaKnUix6eL5tcpso8KdM-aMYgjRf8PQ0xhyyQOqb1FbEYTRKBQhNauh_0BGz9xmPNgE_QgHSbIJ2d0X60oarFQ02AZ-LlTtZVp9iCF8QU6MN98xlshkH_zO3il8blRajGQ00SOAPXNMVYfRGuFBmclkE320JLQBgLVIJ8fSBtwoGzF_jYblOOGWUF6qdCD73OZxyj7GVijILaeUdKUk" alt="Avatar" />
                  <img className="w-10 h-10 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmUTLayHNnlAwhhAnw3VZJVeJkggFeIbhVB5NpJ_bS8mZE9kgRyI46kBR3fk14LBh9gWUgWDU5kbLg9Qc_S8TDU5iFjC0fFdxY_W7iWH0mb5ypLzmVn_LERXosIWrFMxb28Jr8EWWiuabmQgqaYJfoCdpEtK4tTXX5_HSLpefXq1Ou8thbKXBC3ckFWO69iqMHOUzNFndigIa8JFqets3S7idfKFdrThXVSDuuIIlP0bVOa4Grd-MGdT5-RqFeYVaQid2vccPHpxY" alt="Avatar" />
                </div>
                <p className="text-sm font-medium text-secondary">
                  <span className="text-on-background font-bold">+2000 abogados registrados</span> listos para ayudarte.
                </p>
              </div>
            </div>

            {/* Right Column: Hero Image with Gradient Backdrop */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-end gap-6 relative">
              {/* Outer decorative gradient glow */}
              <div className="absolute inset-0 -m-4 bg-gradient-to-tr from-[#1ECCA7]/20 to-[#006b56]/10 blur-2xl rounded-[2.5rem] -z-10"></div>
              
              {/* Image Frame matching the Rankmi mockup style */}
              <div className="relative w-full max-w-[440px] aspect-square rounded-[2.2rem] overflow-hidden shadow-2xl border border-white/60 bg-white/50 backdrop-blur-sm p-3">
                <img 
                  src="/assets/images/hero-user.jpg" 
                  alt="Usuario describiendo su caso en LegalPath" 
                  className="w-full h-full object-cover rounded-[1.8rem] shadow-inner"
                />
              </div>

              {/* Chat Popups Stacked below the image with negative margin to overlap */}
              <div className="w-full max-w-[440px] flex flex-col gap-4 -mt-20 z-20 relative px-4">
                {/* Left Popup: Lawyer (Maximiliano) */}
                <div className="w-72 floating flex items-start gap-3 bg-white p-3.5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-100 self-start">
                  <img 
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary-container"
                    src="/assets/images/maximiliano-abogado.jpg"
                    alt="Maximiliano"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#006b56]">Maximiliano</p>
                      <span className="text-[10px] text-slate-400 font-medium">Ahora</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-normal">
                      Francisco, te escribo para comentarte que hoy presentamos el escrito.
                    </p>
                  </div>
                </div>

                {/* Right Popup: Client (Francisco) */}
                <div className="w-72 floating-delayed flex items-start gap-3 bg-[#e6fcf7] p-3.5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-[#1ecca7]/10 self-end">
                  <img 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    src="/assets/images/francisco-cliente.jpg"
                    alt="Francisco"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800">Francisco</p>
                      <span className="text-[10px] text-slate-400 font-medium">Ahora</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-normal">
                      Perfecto Maximiliano. Quedo atento a mayor información 😊
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Vertical Process Section */}
        <section id="como-funciona" className="max-w-7xl mx-auto px-8 py-20 space-y-32">
          <div className="text-center mb-16">
            <h2 className="text-[41.4px] font-extrabold tracking-tight text-on-background leading-tight">¿Cómo funciona?</h2>
            <div className="w-16 h-1 bg-primary-container mx-auto mt-4 rounded-full"></div>
            <p className="text-secondary text-lg max-w-3xl mx-auto mt-6 leading-relaxed">
              En <strong className="font-extrabold text-on-background">LegalPath</strong> puedes publicar tu consulta legal <strong className="font-extrabold text-on-background">gratis</strong> y <strong className="font-extrabold text-on-background">sin riesgos</strong>. En lugar de buscar abogados a ciegas en internet, aquí recibes sus propuestas sin que vean tus datos. <strong className="font-extrabold text-on-background">Tú tienes el control</strong>: solo cuando elijas la propuesta que más te convenza, el abogado podrá acceder a tus datos de contacto.
            </p>
          </div>

          {/* Step 01 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-8 text-center lg:text-left">
              <div className="text-[120px] font-extrabold leading-none font-headline" style={{ color: '#1ECCA7', opacity: 0.15 }}>01</div>
              <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Publica tu caso</h3>
              <p className="text-xl text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0">
                Describe tu situación legal de<b> forma anónima</b>. No necesitas ser un experto, solo cuéntanos qué pasó y nosotros te ayudaremos a definir cuál es el área de legal del experto que necesitas.
              </p>

            </div>
            {/* Software Mockup: Case Submission UI */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,107,86,0.18)] border border-slate-200/60 bg-[#f8fafc] min-h-[440px]">
              <div className="bg-[#e8ecf1] px-4 py-2.5 flex items-center gap-3 border-b border-slate-200/60">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-slate-400 font-medium text-center truncate border border-slate-100">
                  app.legalpath.cl/publicar-caso
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-container text-white text-[10px] font-bold flex items-center justify-center">1</div>
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 text-[10px] font-bold flex items-center justify-center">2</div>
                  <div className="h-px flex-1 bg-slate-200"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 text-[10px] font-bold flex items-center justify-center">3</div>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-on-background tracking-tight">Describe con detalle tu caso</h3>
                  <p className="text-xs text-slate-400 mt-1">Mientras más detalles nos des, mejores propuestas recibirás. Si quieres, puedes agregarle imágenes, pantallazos, correos, contratos, todo lo que estimes conveniente para ayudarnos a entender tu caso.</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[110px] relative shadow-sm">
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <span ref={typingRef} className="mockup-typing"></span>
                    <span className="inline-block w-[2px] h-4 bg-primary-container animate-pulse ml-0.5 align-text-bottom"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium bg-slate-50 px-3 py-2 rounded-lg border border-dashed border-slate-200 cursor-default">
                      <span className="material-symbols-outlined text-sm">attach_file</span>
                      Adjuntar documentos
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-emerald-200/60">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      contrato.pdf
                    </div>
                  </div>
                  <Link to="/publicar-caso" className="mint-gradient text-white px-5 py-2.5 rounded-full text-xs font-extrabold shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform">
                    Enviar caso
                    <span className="material-symbols-outlined text-sm">send</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 02 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="lg:order-2 space-y-8 lg:pl-16 text-center lg:text-left">
              <div className="text-[120px] font-extrabold leading-none font-headline" style={{ color: '#1ECCA7', opacity: 0.15 }}>02</div>
              <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Recibe Propuestas</h3>
              <p className="text-xl text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0">
                Una vez que envías tu caso, se publica. Los abogados que estén registrados en la página, especialistas en el área específica de tu caso, podrán postularse para que tú elijas con cuál de ellos trabajar.
              </p>

            </div>
            <div className="lg:order-1 relative bg-surface-container-low rounded-3xl p-6 md:p-8 shadow-inner overflow-hidden min-h-[480px] flex flex-col justify-between">
              <div className="space-y-2.5">
                {/* Proposal 1: Lucas Salas */}
                <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-100 grid grid-cols-12 items-center gap-3 transition-all hover:shadow-md">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#006b56]/20 to-[#1ecca7]/30 flex items-center justify-center text-[#006b56] font-bold text-xs shrink-0">
                      LS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-background">Lucas Salas</div>
                      <div className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold w-max mt-0.5">
                        Solicitud de contacto
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-end">
                    <button className="text-[9px] bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold hover:scale-105 transition-transform shadow-sm cursor-pointer whitespace-nowrap">
                      Aceptar propuesta
                    </button>
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">20 min.</span>
                  </div>
                </div>

                {/* Proposal 2: Jeanne Bollut */}
                <div className="bg-white p-3.5 rounded-xl shadow-md border border-primary-container/30 grid grid-cols-12 items-center gap-3 scale-102 z-10 relative transition-all hover:shadow-lg">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                      JB
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-background">Jeanne Bollut</div>
                      <div className="text-[9px] bg-primary-container/10 text-primary-container px-1.5 py-0.5 rounded font-bold w-max mt-0.5">
                        Solicitud de contacto
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-end">
                    <button className="text-[9px] bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold hover:scale-105 transition-transform shadow-sm cursor-pointer whitespace-nowrap">
                      Aceptar propuesta
                    </button>
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">2 horas</span>
                  </div>
                </div>

                {/* Proposal 3: Matias Deischler */}
                <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-100 grid grid-cols-12 items-center gap-3 transition-all hover:shadow-md">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">
                      MD
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-background">Matias Deischler</div>
                      <div className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold w-max mt-0.5">
                        Solicitud de contacto
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-end">
                    <button className="text-[9px] bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold hover:scale-105 transition-transform shadow-sm cursor-pointer whitespace-nowrap">
                      Aceptar propuesta
                    </button>
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">8 horas</span>
                  </div>
                </div>

                {/* Proposal 4: Magdalena Romero */}
                <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-100 grid grid-cols-12 items-center gap-3 transition-all hover:shadow-md">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-100 to-pink-200 flex items-center justify-center text-pink-700 font-bold text-xs shrink-0">
                      MR
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-background">Magdalena Romero</div>
                      <div className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold w-max mt-0.5">
                        Solicitud de contacto
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-end">
                    <button className="text-[9px] bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold hover:scale-105 transition-transform shadow-sm cursor-pointer whitespace-nowrap">
                      Aceptar propuesta
                    </button>
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">1 día</span>
                  </div>
                </div>

                {/* Proposal 5: Daniel Camargo */}
                <div className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-100 grid grid-cols-12 items-center gap-3 transition-all hover:shadow-md">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-100 to-sky-200 flex items-center justify-center text-sky-700 font-bold text-xs shrink-0">
                      DC
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-background">Daniel Camargo</div>
                      <div className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold w-max mt-0.5">
                        Solicitud de contacto
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-end">
                    <button className="text-[9px] bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-bold hover:scale-105 transition-transform shadow-sm cursor-pointer whitespace-nowrap">
                      Aceptar propuesta
                    </button>
                  </div>
                  <div className="col-span-2 flex justify-start">
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">3 días</span>
                  </div>
                </div>
              </div>
              <div className="relative mt-6 mb-2 mx-auto bg-white/90 backdrop-blur px-6 py-3 rounded-full border border-primary-container/20 shadow-xl flex items-center gap-2 w-max">
                <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></div>
                <span className="text-xs font-bold text-on-background whitespace-nowrap">Tienes cinco propuestas nuevas...</span>
              </div>
            </div>
          </motion.div>

          {/* Step 03 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-8 text-center lg:text-left">
              <div className="text-[120px] font-extrabold leading-none font-headline" style={{ color: '#1ECCA7', opacity: 0.15 }}>03</div>
              <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Elige y Actúa</h3>
              <p className="text-xl text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0">
                Compara perfiles, lee opiniones verificadas de otros usuarios y contrata al profesional que te dé más confianza para llevar tu caso.
              </p>

            </div>
            <div className="relative bg-on-background rounded-3xl p-12 text-white overflow-hidden min-h-[400px] flex items-center justify-center">
              <div className="space-y-6 w-full max-w-sm">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined">handshake</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold">Abogado Seleccionado</div>
                    <div className="text-xs text-slate-400">Abogado: Elena R.</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progreso del caso</span>
                    <span className="text-primary-container">65%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full">
                    <div className="h-full w-[65%] bg-primary-container rounded-full"></div>
                  </div>
                </div>
                <button className="w-full py-4 bg-primary-container text-on-primary-container font-black rounded-full shadow-lg">Chat con mi Abogado</button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Value Propositions - 4 Columns ref: Rankmi style */}
        <section id="por-que-legalpath" className="max-w-7xl mx-auto px-8 py-20 space-y-12">
          <div className="text-center max-w-4xl mx-auto space-y-5 mb-12">
            <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-on-background leading-tight">
              Una única <span className="text-[#1ECCA7] font-black">plataforma</span> para gestionar, comparar y contratar abogados con total seguridad.
            </h2>
            <p className="text-secondary text-base md:text-lg max-w-3xl mx-auto font-medium leading-relaxed">
              LegalPath es una plataforma moderna que unifica la búsqueda de asesoría jurídica. Conectamos tus necesidades con abogados verificados a través de tecnología transparente y segura.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
          >
            {/* Card 1: Peach */}
            <div className="bg-[#FFEFEB] text-[#4A2015] rounded-[2.2rem] p-8 flex flex-col justify-between shadow-[0_15px_35px_rgba(255,239,235,0.8)] border border-[#FFD3C4]/40 hover:scale-[1.03] transition-all duration-300 min-h-[380px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight leading-tight">Publicación y Privacidad</h3>
                  <p className="text-sm text-[#7D493B] font-medium leading-relaxed">
                    Publica tu consulta de forma anónima y obtén orientación sin revelar tus datos.
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 pt-2 select-none">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FF7F50] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFEFEB]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#4A2015] leading-snug">Anonimato 100% hasta que decidas aceptar una propuesta.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FF7F50] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFEFEB]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#4A2015] leading-snug">Poder adjuntar imágenes y documentos.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FF7F50] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFEFEB]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#4A2015] leading-snug">Orientación de la plataforma sobre qué tipo de abogado necesitas.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FF7F50] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFEFEB]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#4A2015] leading-snug">Publicación de caso gratuita.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Blue */}
            <div className="bg-[#EEF4FF] text-[#1E293B] rounded-[2.2rem] p-8 flex flex-col justify-between shadow-[0_15px_35px_rgba(238,244,255,0.8)] border border-[#CFDDFB]/40 hover:scale-[1.03] transition-all duration-300 min-h-[380px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight leading-tight">Abogados Certificados</h3>
                  <p className="text-sm text-[#475569] font-medium leading-relaxed">
                    Conéctate con profesionales con títulos verificados y reputación intachable.
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 pt-2 select-none">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#EEF4FF]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#1E293B] leading-snug">Filtros de selección rigurosos.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#EEF4FF]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#1E293B] leading-snug">Verificación de títulos profesionales.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#EEF4FF]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#1E293B] leading-snug">Validación de RUT ante el Colegio de Abogados.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#EEF4FF]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#1E293B] leading-snug">Revisión de antecedentes de los profesionales.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Green */}
            <div className="bg-[#E8FFF8] text-[#064E3B] rounded-[2.2rem] p-8 flex flex-col justify-between shadow-[0_20px_40px_rgba(232,255,248,0.9)] border border-[#A6E8D5]/50 hover:scale-[1.04] transition-all duration-300 min-h-[380px] relative">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight leading-tight">Propuestas a Medida</h3>
                  <p className="text-sm text-[#0F766E] font-medium leading-relaxed">
                    Compara hasta 5 propuestas personalizadas y elige la opción que prefieras.
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 pt-2 select-none">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8FFF8]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#064E3B] leading-snug">Recibe hasta cinco propuestas de abogados.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8FFF8]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#064E3B] leading-snug">En caso de que no te convenza ninguna oferta, puedes descartarlas y recibir otras cinco nuevas.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8FFF8]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#064E3B] leading-snug">Vas a poder comparar precios y hacer todas las consultas necesarias antes de decidir uno por uno de los abogados.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Yellow */}
            <div className="bg-[#FFFBE5] text-[#78350F] rounded-[2.2rem] p-8 flex flex-col justify-between shadow-[0_15px_35px_rgba(255,251,229,0.8)] border border-[#FDE047]/40 hover:scale-[1.03] transition-all duration-300 min-h-[380px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight leading-tight">Seguridad y Soporte</h3>
                  <p className="text-sm text-[#A16207] font-medium leading-relaxed">
                    Monitorea el avance de tu caso y comunícate con total respaldo.
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 pt-2 select-none">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EAB308] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFFBE5]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#78350F] leading-snug">A través de la plataforma podrás comunicarte y tener el historial de mensajes con el abogado.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EAB308] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFFBE5]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#78350F] leading-snug">Podrás compartir archivos y documentos de manera segura.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EAB308] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFFBE5]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#78350F] leading-snug">Podrás seguir los hitos de tu causa en una línea temporal.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EAB308] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFFBE5]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#78350F] leading-snug">Estarás protegido bajo el respaldo y seguridad de LegalPath.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="max-w-7xl mx-auto px-6 md:px-8 py-24 border-t border-slate-100/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Title & Description */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6fcf7] text-primary font-bold text-xs rounded-full border border-[#1ecca7]/20 mx-auto lg:mx-0">
                <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: '"FILL" 1' }}>quiz</span>
                Preguntas frecuentes
              </div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] text-on-background">
                Preguntas <br />
                <span className="text-[#1ECCA7]">frecuentes</span>
              </h2>
              
              <p className="text-base md:text-lg text-secondary leading-relaxed max-w-sm mx-auto lg:mx-0">
                Aquí vas a poder encontrar todas las dudas que tengas respecto a cómo funciona LegalPath
              </p>
            </div>

            {/* Right Column: FAQ List */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                {faqs.map((faq, index) => (
                  <FaqItem
                    key={index}
                    question={faq.q}
                    answer={faq.a}
                    isOpen={openFaqIndex === index}
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  />
                ))}
              </motion.div>
            </div>
            
          </div>
        </section>

        {/* Final CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden w-full bg-white border-t border-b border-slate-100 py-24 md:py-32"
        >
          {/* Decorative Background Glowing Pathway */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 opacity-50" viewBox="0 0 1440 400" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ctaPathGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1ecca7" stopOpacity="0" />
                <stop offset="15%" stopColor="#1ecca7" stopOpacity="0.14" />
                <stop offset="50%" stopColor="#006b56" stopOpacity="0.08" />
                <stop offset="85%" stopColor="#1ecca7" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#1ecca7" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ctaPathGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EE6C4D" stopOpacity="0" />
                <stop offset="20%" stopColor="#EE6C4D" stopOpacity="0.14" />
                <stop offset="50%" stopColor="#EE6C4D" stopOpacity="0.08" />
                <stop offset="80%" stopColor="#EE6C4D" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#EE6C4D" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Glowing base curves (thick & blurred) */}
            <g className="cta-sway-1">
              <motion.path 
                d="M -50,280 C 300,100 600,340 900,120 C 1100,-20 1300,120 1500,220"
                stroke="url(#ctaPathGradient1)"
                strokeWidth="48"
                strokeLinecap="round"
                fill="none"
                className="blur-[8px]"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: "easeOut" }}
              />
            </g>
            <g className="cta-sway-2">
              <motion.path 
                d="M -50,120 C 300,320 600,80 900,280 C 1100,380 1300,180 1500,120"
                stroke="url(#ctaPathGradient2)"
                strokeWidth="48"
                strokeLinecap="round"
                fill="none"
                className="blur-[8px]"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.6, ease: "easeOut", delay: 0.2 }}
              />
            </g>
            {/* Inner paths (the lines that generate themselves when in view) */}
            <g className="cta-sway-1">
              <motion.path 
                d="M -50,280 C 300,100 600,340 900,120 C 1100,-20 1300,120 1500,220"
                stroke="url(#ctaPathGradient1)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: "easeOut" }}
              />
            </g>
            <g className="cta-sway-2">
              <motion.path 
                d="M -50,120 C 300,320 600,80 900,280 C 1100,380 1300,180 1500,120"
                stroke="url(#ctaPathGradient2)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.6, ease: "easeOut", delay: 0.2 }}
              />
            </g>
          </svg>

          <div className="max-w-7xl mx-auto px-8 relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container/10 border border-primary-container/20 text-primary font-bold text-xs rounded-full shadow-sm">
              <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
              100% gratuito y sin compromisos
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-background max-w-3xl mx-auto leading-tight">
              ¿Listo para resolver tu situación legal?
            </h2>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-secondary max-w-xl mx-auto leading-relaxed font-medium">
              Únete a miles de personas que ya encontraron la tranquilidad legal que necesitaban.
            </p>

            {/* CTA Button */}
            <div className="pt-4 w-full sm:w-auto">
              <Link 
                to="/publicar-caso" 
                className="mint-gradient text-white px-10 py-5 rounded-2xl text-lg md:text-xl font-extrabold shadow-xl hover:scale-105 transition-all duration-300 inline-block text-center w-full sm:w-auto hover:shadow-primary-container/20"
              >
                Publicar mi caso gratis
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

    </>
  )
}

export default Home
