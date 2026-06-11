import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FaqItem = ({ question, answer, isOpen, onClick }) => {
  const renderSafeHtml = (text) => {
    return text.split(/(<strong>.*?<\/strong>)/g).map((part, i) => {
      if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
        return <strong key={i}>{part.substring(8, part.length - 9)}</strong>
      }
      return part
    })
  }

  return (
    <div className="faq-item bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <button
        className={`w-full flex items-center justify-between px-7 py-5 text-left gap-4 ${isOpen ? 'text-primary' : ''}`}
        onClick={onClick}
      >
        <span className="font-semibold text-on-background text-base">{question}</span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 ${isOpen ? 'bg-primary-container text-white' : 'bg-slate-100 text-slate-500'}`}>
          {isOpen ? '×' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="px-7 pb-6">
          <p className="text-secondary text-sm leading-relaxed">
            {renderSafeHtml(answer)}
          </p>
        </div>
      )}
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
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container/10 text-primary-container rounded-full text-xs font-bold tracking-widest uppercase">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                Justicia accesible para todos
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-on-background">
                Publica tu caso y que los abogados te <span className="text-[#1ECCA7]">encuentren</span>.
              </h1>
              
              <p className="text-lg md:text-xl text-secondary leading-relaxed max-w-xl">
                Publica tu caso de <b>forma anónima y gratuita, </b>espera a que los abogados te contacten y tú eres el que <b>elige</b> a cuál de los especialistas tomar<b>.</b>
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/publicar-caso" className="mint-gradient text-on-primary px-8 py-4 rounded-full text-lg font-bold shadow-2xl hover:scale-105 transition-transform text-center inline-block">
                  Publicar mi caso
                </Link>
                <a href="#como-funciona" className="bg-white text-on-secondary-container border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-colors shadow-sm text-center inline-block">
                  ¿Cómo funciona?
                </a>
              </div>
              
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100 max-w-md">
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
            <div className="space-y-8">
              <div className="text-[120px] font-extrabold leading-none font-headline" style={{ color: '#1ECCA7', opacity: 0.15 }}>01</div>
              <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Publica tu caso</h3>
              <p className="text-xl text-secondary leading-relaxed max-w-lg">
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
            <div className="lg:order-2 space-y-8 lg:pl-16">
              <div className="text-[120px] font-extrabold leading-none font-headline" style={{ color: '#1ECCA7', opacity: 0.15 }}>02</div>
              <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Recibe Propuestas</h3>
              <p className="text-xl text-secondary leading-relaxed max-w-lg">
                Una vez que envías tu caso, se publica. Los abogados que estén registrados en la página, especialistas en el área específica de tu caso, podrán postularse para que tú elijas con cuál de ellos trabajar.
              </p>

            </div>
            <div className="lg:order-1 relative bg-surface-container-low rounded-3xl p-8 shadow-inner overflow-hidden min-h-[450px]">
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transform -translate-x-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                    <div>
                      <div className="text-sm font-bold">Carlos P.</div>
                      <div className="text-[10px] text-slate-400">Propuesta enviada</div>
                    </div>
                  </div>
                  <div className="text-primary-container font-bold"><br /></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md border border-primary-container/30 flex items-center justify-between scale-105 z-10 relative">
                  <div className="flex items-center gap-3">
                    <img className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfxDobgTeGdYta_YlWydNirrHVpQxYOGjQif6GO_tRCuJaZu1SlXD45o4ytntn86L19nvRe_tfaEwqMjLxbh9H4S2UzKxwbXY2SmMr2ppXaKb5YLET4pGP95LeHZb_GNIUW5bTFWa82WPbmjdAzAK7lMB_XnLK_-JfBikKzSXU-JdwhE9Gxghpa7wZ4QlQ6e3VoSCRp8O76xzQWjQXK-mXJlD2jSMrUrq7hX0aYSCnrUMknNG6AWtQDNkv3720r_TNx8uojwLY8y0" alt="Elena R." />
                    <div>
                      <div className="text-sm font-bold">Elena R.</div>
                      <div className="text-[10px] text-primary-container font-bold">Recomendada ✨</div>
                    </div>
                  </div>
                  <div className="text-primary-container font-bold"><br /></div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transform translate-x-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                    <div>
                      <div className="text-sm font-bold">Sonia M.</div>
                      <div className="text-[10px] text-slate-400">Propuesta enviada</div>
                    </div>
                  </div>
                  <div className="text-primary-container font-bold"><br /></div>
                </div>
              </div>
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full border border-primary-container/20 shadow-xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></div>
                <span className="text-xs font-bold text-on-background whitespace-nowrap">Tienes tres propuestas nuevas...</span>
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
            <div className="space-y-8">
              <div className="text-[120px] font-extrabold leading-none font-headline" style={{ color: '#1ECCA7', opacity: 0.15 }}>03</div>
              <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Elige y Actúa</h3>
              <p className="text-xl text-secondary leading-relaxed max-w-lg">
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

        {/* Bento Value Propositions */}
        <section id="por-que-legalpath" className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-[41.4px] font-extrabold tracking-tight">¿Por qué elegir LegalPath?</h2>
            <p className="text-secondary max-w-2xl mx-auto">Diseñamos una experiencia que pone el poder de nuevo en tus manos, eliminando la incertidumbre y los costos ocultos.</p>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]"
          >
            <div className="md:col-span-2 bg-white rounded-xl p-10 flex flex-col justify-between shadow-sm border border-slate-50 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 bg-primary-container/10 rounded-2xl flex items-center justify-center text-primary-container">
                  <span className="material-symbols-outlined text-3xl">security</span>
                </div>
                <h3 className="text-3xl font-bold">Privacidad Absoluta</h3>
                <p className="text-secondary max-w-sm text-lg">Tu identidad permanece oculta hasta que tú decidas contactar a un abogado. Sin llamadas molestas, sin spam.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-[20rem]" style={{ fontVariationSettings: '"FILL" 1' }}>shield</span>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-xl p-8 flex flex-col items-center text-center justify-center shadow-sm border border-slate-100 space-y-6 hover:scale-[1.02] transition-all duration-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary-container shadow-inner">
                <span className="material-symbols-outlined text-4xl">verified_user</span>
              </div>
              <h3 className="text-2xl font-bold">Abogados Certificados</h3>
              <p className="text-secondary">Validamos cada título y antecedente profesional ante la Corte Suprema antes de permitirles el ingreso.</p>
              <button className="text-primary-container font-bold flex items-center gap-1 hover:gap-2 transition-all">Saber más <span className="material-symbols-outlined">chevron_right</span></button>
            </div>
            <div className="bg-primary-container text-on-primary-container rounded-xl p-8 flex flex-col justify-end shadow-lg relative overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="absolute top-4 right-4 opacity-20">
                <span className="material-symbols-outlined text-6xl">how_to_reg</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Elección Libre</h3>
              <p className="text-sm opacity-90">Tú puedes elegir al abogado con el que te sientas más cómodo para llevar tu proceso legal.</p>
            </div>
            <div className="bg-on-background text-white rounded-xl p-8 flex flex-col justify-end shadow-lg relative overflow-hidden md:col-span-2 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Gestión de Propuestas</h3>
                  <p className="text-sm text-slate-400">Recibe hasta 5 propuestas simultáneas; si no te gusta ninguna, descártala y nuevas opciones se añadirán automáticamente. Nuestro sistema garantiza que tu caso siempre tenga atención activa.</p>
                </div>
                <div className="hidden lg:flex gap-2">
                  <div className="h-16 w-1 bg-primary-container rounded-full opacity-20"></div>
                  <div className="h-20 w-1 bg-primary-container rounded-full opacity-40"></div>
                  <div className="h-24 w-1 bg-primary-container rounded-full"></div>
                  <div className="h-20 w-1 bg-primary-container rounded-full opacity-40"></div>
                  <div className="h-16 w-1 bg-primary-container rounded-full opacity-20"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="max-w-4xl mx-auto px-8 py-20">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary-container/10 text-primary-container font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-5">Preguntas Frecuentes</span>
            <h2 className="text-[41.4px] font-extrabold text-on-background tracking-tight">Todo lo que necesitas saber</h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
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
        </section>

        {/* Final CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto px-8 py-20"
        >
          <div className="mint-gradient rounded-xl p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-[41.4px] font-extrabold tracking-tight max-w-3xl mx-auto">¿Listo para resolver tu situación legal?</h2>
              <p className="text-xl opacity-90 max-w-xl mx-auto">Únete a miles de personas que ya encontraron la tranquilidad legal que necesitaban.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link to="/publicar-caso" className="bg-white text-primary px-10 py-5 rounded-full text-xl font-black shadow-xl hover:scale-105 transition-transform text-center inline-block">Publicar mi caso gratis</Link>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

    </>
  )
}

export default Home
