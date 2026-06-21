import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Abogados = () => {
  return (
    <>
      <style>{`
        .glass-card { background: rgba(255,255,255,0.8); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .mint-gradient { background: linear-gradient(135deg, #006b56 0%, #1ecca7 100%); }
        .abogado-gradient { background: linear-gradient(135deg, #EE6C4D 0%, #ff8a6d 100%); }
        .soft-mint-glow { box-shadow: 0 20px 40px rgba(30,204,167,0.15); }
        .floating { animation: floating 6s ease-in-out infinite; }
        .floating-delayed { animation: floating 7s ease-in-out 1s infinite; }
        @keyframes floating { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        .pricing-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .pricing-card:hover { transform: translateY(-8px); box-shadow: 0 25px 60px -15px rgba(0,0,0,0.12); }
        .pricing-card.popular { border: 2px solid #1ecca7; }
        .pricing-card.popular:hover { box-shadow: 0 25px 60px -15px rgba(30,204,167,0.25); }
        html { scroll-behavior: smooth; }
        @keyframes count-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .token-badge { animation: count-pulse 3s ease-in-out infinite; }
        
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

        {/* ======================== HERO SECTION ======================== */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-8 pt-10 pb-24">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#EE6C4D]/8 blur-[120px] rounded-full -z-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-container/10 blur-[120px] rounded-full -z-10"></div>

          <div className="max-w-4xl w-full text-center space-y-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EE6C4D]/10 text-[#EE6C4D] rounded-full text-xs font-bold tracking-widest uppercase mx-auto">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>workspace_premium</span>
              Para profesionales del derecho
            </div>

            <h1 className="text-3xl sm:text-[41px] md:text-[66px] font-extrabold tracking-tighter leading-[1.1] text-on-background">
              <span className="text-[#EE6C4D]">Encuentra clientes</span> sin saber de marketing, sin grandes presupuestos y sin reuniones.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-secondary leading-relaxed max-w-3xl mx-auto text-justify md:text-center">
              Ya no tienes que <b>aprender de publicidad</b>, <b>crear contenido en redes sociales</b>, ni <b>agendar cientos de reuniones</b>. En LegalPath <b>eliminamos estas barreras</b> para los abogados, concentrando a todos los clientes en <b>un solo lugar</b>.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth/registro" className="abogado-gradient text-white px-10 py-5 rounded-full text-xl font-bold shadow-2xl hover:scale-105 transition-transform text-center inline-block">
                Comenzar
              </Link>
              <a href="#como-funciona" className="bg-white text-on-secondary-container border border-slate-200 px-10 py-5 rounded-full text-xl font-bold hover:bg-slate-50 transition-colors shadow-sm text-center inline-block">
                ¿Cómo funciona?
              </a>
            </div>

            <div className="flex items-center justify-center gap-4 pt-6">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-white" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfxDobgTeGdYta_YlWydNirrHVpQxYOGjQif6GO_tRCuJaZu1SlXD45o4ytntn86L19nvRe_tfaEwqMjLxbh9H4S2UzKxwbXY2SmMr2ppXaKb5YLET4pGP95LeHZb_GNIUW5bTFWa82WPbmjdAzAK7lMB_XnLK_-JfBikKzSXU-JdwhE9Gxghpa7wZ4QlQ6e3VoSCRp8O76xzQWjQXK-mXJlD2jSMrUrq7hX0aYSCnrUMknNG6AWtQDNkv3720r_TNx8uojwLY8y0" alt="Avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-white" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7gHVFA_44sVTI3dIJdNfmIHjR5MsEaaN756hFDsDofbdSw9lUu_90kkE5VEMCQd6uLzwCwVXHUYqX2tfTpdRwE7WAfuy45EXY2RaSUogIeRke2YnajdcGTnnRC2DsS_UD-7JtMHi5EYmNCTSOZ20tV9_zavYxdUNl5AbE9lq8tGIpb4X8hKZw2IA74Uq6Nv4ZdoeJCJDwtLUjT08aYuB07SnjLraCuGOKIoZGWMVdB6Y0EIkq6525T1bat4nwC3AdBmKh3EzHtuI" alt="Avatar" />
                <img className="w-10 h-10 rounded-full border-2 border-white" referrerPolicy="no-referrer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmUTLayHNnlAwhhAnw3VZJVeJkggFeIbhVB5NpJ_bS8mZE9kgRyI46kBR3fk14LBh9gWUgWDU5kbLg9Qc_S8TDU5iFjC0fFdxY_W7iWH0mb5ypLzmVn_LERXosIWrFMxb28Jr8EWWiuabmQgqaYJfoCdpEtK4tTXX5_HSLpefXq1Ou8thbKXBC3ckFWO69iqMHOUzNFndigIa8JFqets3S7idfKFdrThXVSDuuIIlP0bVOa4Grd-MGdT5-RqFeYVaQid2vccPHpxY" alt="Avatar" />
              </div>
              <p className="text-sm font-medium text-secondary">
                <font color="#141b2c"><b>+500 abogados</b></font> ya conectaron con nuevos clientes.
              </p>
            </div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute left-2 md:left-[6%] top-[58%] floating hidden lg:block">
            <div className="glass-card p-4 rounded-2xl border border-white/50 shadow-xl space-y-2 w-52">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Caso nuevo</span>
              </div>
              <p className="text-xs font-bold text-on-background leading-tight">Demanda laboral por despido injustificado</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-primary-container/10 text-primary-container font-bold px-2 py-0.5 rounded-full">Laboral</span>
                <span className="text-[9px] text-slate-400">Hace 2 min</span>
              </div>
            </div>
          </div>

          <div className="absolute right-2 md:right-[2%] top-[40%] floating-delayed hidden lg:block">
            <div className="glass-card p-4 rounded-2xl border border-white/80 shadow-2xl space-y-3 w-56 text-center">
              <div className="flex items-center justify-center gap-2 text-[#EE6C4D]">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>toll</span>
                <span className="text-3xl font-extrabold">25</span>
              </div>
              <p className="text-[11px] font-bold text-on-background">Tokens disponibles</p>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[65%] bg-[#EE6C4D] rounded-full"></div>
              </div>
              <p className="text-[9px] text-slate-400">Plan Core · 16 usados este mes</p>
            </div>
          </div>
        </section>

        {/* ======================== ¿CÓMO FUNCIONA? ======================== */}
        <section id="como-funciona" className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Title and Paragraph */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h2 className="text-2xl sm:text-[36px] md:text-[46px] font-extrabold tracking-tight text-on-background leading-tight">
                ¿Cómo funciona LegalPath?
              </h2>
              <p className="text-base md:text-lg text-secondary leading-relaxed text-justify mx-auto lg:mx-0 max-w-2xl">
                <b>LegalPath</b> surge como una plataforma diseñada tanto para que las personas puedan <b>publicar sus casos de manera gratuita</b> como para <b>democratizar el derecho</b> para los abogados independientes y aquellos que acaban de comenzar en el mundo laboral.
              </p>
              <p className="text-base md:text-lg text-secondary leading-relaxed text-justify mx-auto lg:mx-0 max-w-2xl">
                Concretamente, los ciudadanos pueden publicar su caso de forma 100% gratuita y los abogados, a través de nuestro <b>sistema de tokens</b>, pueden utilizar uno de ellos para obtener la información de contacto de los casos que ya están <b>precalificados</b>.
              </p>
              <p className="text-base md:text-lg text-secondary leading-relaxed text-justify mx-auto lg:mx-0 max-w-2xl">
                De esta manera, te aseguras de acceder a <b>leads de calidad</b> y evitas tener que pasar por miles de reuniones sin sentido.
              </p>
            </div>

            {/* Right Column: Image with Blobs and Floating Badges */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-6">
              {/* Back Blobs */}
              <div className="absolute -top-10 -left-10 w-[110%] h-[110%] -z-10 opacity-80 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path fill="#EE6C4D" fillOpacity="0.12" d="M44.7,-76.4C57.4,-69.5,67.1,-56.9,74.5,-42.8C81.8,-28.7,86.8,-13.1,86.4,2.3C86,17.7,80.1,32.8,71.9,46.1C63.7,59.3,53.2,70.6,40.1,76.6C27,82.6,13.5,83.3,-0.6,84.3C-14.7,85.3,-29.4,86.7,-43.3,81.4C-57.2,76.1,-70.3,64.2,-78.3,49.8C-86.3,35.4,-89.2,18.5,-88.7,2.1C-88.2,-14.3,-84.3,-30.2,-75.7,-43.5C-67.1,-56.9,-53.8,-67.7,-39.6,-73.8C-25.5,-79.8,-10.5,-81.1,3.4,-86.3C17.3,-91.5,32,-90.6,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
              </div>
              <div className="absolute -bottom-10 -right-10 w-[80%] h-[80%] -z-10 opacity-70 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path fill="#1ecca7" fillOpacity="0.1" d="M38.1,-63.5C49.9,-57.2,60.5,-47.5,68.9,-35.4C77.3,-23.3,83.5,-8.8,83,-5.3C82.5,1.9,75.4,14.6,68.2,27.3C61,40.1,53.6,52.9,42.8,61.9C32,70.9,16,76,0.3,75.5C-15.4,75,-30.8,69,-43.3,59.5C-55.8,50,-65.4,37,-71,22.2C-76.6,7.5,-78.2,-9.1,-74,-24.1C-69.8,-39.1,-59.8,-52.5,-46.8,-58.3C-33.8,-64.1,-16.9,-62.3,-1.2,-60.3C14.5,-58.3,26.3,-69.8,38.1,-63.5Z" transform="translate(100 100)" />
                </svg>
              </div>

              {/* Photo Frame (Organic fluid shapes and smooth curves) */}
              <div className="relative w-full max-w-[420px] aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl border-4 border-white">
                <img 
                  src="/assets/images/tablet-abogado-v2.jpg" 
                  alt="Tablet con plataforma de abogado"
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Floating Award-style Badges */}
              {/* Bottom Left Badge (Orange/Gold theme) */}
              <div className="absolute -bottom-6 -left-4 w-32 h-32 md:w-36 md:h-36 bg-[#EE6C4D] rounded-full p-1 flex items-center justify-center shadow-lg border-4 border-white floating hover:scale-105 transition-transform duration-300 select-none">
                <div className="w-full h-full rounded-full border border-white/20 flex flex-col items-center justify-center text-center p-2 text-white">
                  <span className="material-symbols-outlined text-2xl mb-1 text-white">verified</span>
                  <span className="text-[10px] font-black uppercase tracking-wider leading-none">Abogado</span>
                  <span className="text-[9px] font-medium opacity-90 leading-tight">Verificado</span>
                  <span className="text-[8px] font-bold bg-white/25 px-1.5 py-0.5 rounded mt-1.5 leading-none">Corte Suprema</span>
                </div>
              </div>

              {/* Bottom Right Badge (Mint/Teal theme) */}
              <div className="absolute bottom-8 -right-6 w-32 h-32 md:w-36 md:h-36 bg-[#1ecca7] rounded-full p-1 flex items-center justify-center shadow-lg border-4 border-white floating-delayed hover:scale-105 transition-transform duration-300 select-none">
                <div className="w-full h-full rounded-full border border-white/20 flex flex-col items-center justify-center text-center p-2 text-white">
                  <span className="material-symbols-outlined text-2xl mb-1 text-white">assignment_turned_in</span>
                  <span className="text-[10px] font-black uppercase tracking-wider leading-none">Casos</span>
                  <span className="text-[9px] font-medium opacity-90 leading-tight">Pre-calificados</span>
                  <span className="text-[8px] font-bold bg-white/25 px-1.5 py-0.5 rounded mt-1.5 leading-none">100% Reales</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ======================== POR QUÉ LEGALPATH ======================== */}
        <section id="por-que-legalpath" className="max-w-7xl mx-auto px-8 py-20 space-y-12">
          <div className="text-center max-w-4xl mx-auto space-y-5 mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-extrabold tracking-tight text-on-background leading-tight">
              Una única <span className="text-[#EE6C4D] font-black">plataforma</span> para gestionar, cotizar y captar clientes con total seguridad.
            </h2>
            <p className="text-secondary text-base md:text-lg max-w-3xl mx-auto font-medium leading-relaxed text-justify md:text-center">
              LegalPath es una plataforma moderna que unifica la búsqueda de asesoría jurídica. Conectamos tus especialidades con clientes pre-calificados a través de tecnología transparente y segura.
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
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">Casos Pre-calificados</h3>
                  <p className="text-sm text-[#7D493B] font-medium leading-relaxed">
                    Nuestro software califica cada caso antes de ser publicado, entregándote un resumen estructurado.
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 pt-2 select-none">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FF7F50] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFEFEB]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#4A2015] leading-snug">Preguntas y respuestas clave estructuradas.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FF7F50] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFEFEB]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#4A2015] leading-snug">Urgencia y área de especialidad identificadas.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FF7F50] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFEFEB]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#4A2015] leading-snug">Estimación de montos o pretensiones del cliente.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#FF7F50] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFEFEB]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#4A2015] leading-snug">Sin perder tiempo en llamadas de descarte.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Blue */}
            <div className="bg-[#EEF4FF] text-[#1E293B] rounded-[2.2rem] p-8 flex flex-col justify-between shadow-[0_15px_35px_rgba(238,244,255,0.8)] border border-[#CFDDFB]/40 hover:scale-[1.03] transition-all duration-300 min-h-[380px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">Costo Controlado</h3>
                  <p className="text-sm text-[#475569] font-medium leading-relaxed">
                    Olvídate de pagar agencias de publicidad o costosas campañas que no aseguran resultados.
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 pt-2 select-none">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#EEF4FF]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#1E293B] leading-snug">Sistema basado en tokens transparente.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#EEF4FF]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#1E293B] leading-snug">Pagas solo cuando decides contactar a un cliente.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#EEF4FF]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#1E293B] leading-snug">Retorno de inversión (ROI) altamente medible.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#EEF4FF]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#1E293B] leading-snug">Planes flexibles adaptados a tu ritmo de trabajo.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Green */}
            <div className="bg-[#E8FFF8] text-[#064E3B] rounded-[2.2rem] p-8 flex flex-col justify-between shadow-[0_20px_40px_rgba(232,255,248,0.9)] border border-[#A6E8D5]/50 hover:scale-[1.04] transition-all duration-300 min-h-[380px] relative">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">Gestión Todo en Uno</h3>
                  <p className="text-sm text-[#0F766E] font-medium leading-relaxed">
                    Todo lo que necesitas para interactuar con tus clientes y hacer seguimiento de tus causas.
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 pt-2 select-none">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8FFF8]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#064E3B] leading-snug">Chat seguro integrado en la plataforma.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8FFF8]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#064E3B] leading-snug">Compartición y almacenamiento seguro de archivos.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8FFF8]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#064E3B] leading-snug">Línea de tiempo interactiva con hitos del caso.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#E8FFF8]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#064E3B] leading-snug">Historial centralizado de tus conversaciones.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Yellow */}
            <div className="bg-[#FFFBE5] text-[#78350F] rounded-[2.2rem] p-8 flex flex-col justify-between shadow-[0_15px_35px_rgba(255,251,229,0.8)] border border-[#FDE047]/40 hover:scale-[1.03] transition-all duration-300 min-h-[380px]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">Competencia Justa</h3>
                  <p className="text-sm text-[#A16207] font-medium leading-relaxed">
                    Limitamos el número de postulaciones por caso para evitar la saturación.
                  </p>
                </div>

                <div className="flex flex-col gap-3.5 pt-2 select-none">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EAB308] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFFBE5]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#78350F] leading-snug">Máximo 5 abogados por cada caso publicado.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EAB308] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFFBE5]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#78350F] leading-snug">Los clientes eligen basándose en propuesta y perfil.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EAB308] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFFBE5]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#78350F] leading-snug">Sin guerras de precios destructivas en el marketplace.</span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#EAB308] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFFBE5]"></span>
                    </span>
                    <span className="text-sm font-bold text-[#78350F] leading-snug">Visibilidad e igualdad de condiciones garantizada.</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ======================== ¿CÓMO EMPEZAR? ======================== */}
        <section id="como-empezar" className="max-w-7xl mx-auto px-8 py-20 space-y-32">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-[41.4px] font-extrabold tracking-tight text-on-background leading-tight">¿Cómo empezar?</h2>
            <div className="w-16 h-1 bg-[#EE6C4D] mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Step 01 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="text-[100px] sm:text-[120px] font-extrabold leading-none font-headline" style={{ color: '#EE6C4D', opacity: 0.15 }}>01</div>
              <h3 className="text-xl sm:text-2xl md:text-[30.7px] font-extrabold tracking-tight text-on-background">Regístrate y verifica tu perfil</h3>
              <p className="text-base md:text-xl text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0 text-justify lg:text-left">
                Crea tu cuenta profesional y adjunta tus documentos para validar tu calidad de abogado. Verificamos tu <b>título profesional</b> y antecedentes ante la Corte Suprema.
              </p>

            </div>
            {/* Mockup: Registration Form */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(238,108,77,0.18)] border border-slate-200/60 bg-[#f8fafc]">
              <div className="bg-[#e8ecf1] px-4 py-2.5 flex items-center gap-3 border-b border-slate-200/60">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-slate-400 font-medium text-center truncate border border-slate-100">
                  app.legalpath.cl/abogados/registro
                </div>
              </div>
              <div className="relative">
                <div className="p-5 space-y-3 overflow-hidden max-h-[400px]">
                  <div className="mb-1">
                    <h3 className="text-base font-extrabold text-on-background tracking-tight">Únete a la Red Legal</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">Completa tu perfil profesional para comenzar a recibir casos y gestionar tu práctica.</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-100 p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-primary-container text-white text-[9px] font-black flex items-center justify-center">1</span>
                      <span className="text-xs font-extrabold text-on-background">Información Personal</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[9px] text-slate-400 mb-1">Nombres</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-400">e.g. Elena</div>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 mb-1">Apellidos</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-400">e.g. Ramírez</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 mb-1">Correo Electrónico</p>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-500">elena.ramirez@legal.com</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-100 p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-primary-container text-white text-[9px] font-black flex items-center justify-center">2</span>
                      <span className="text-xs font-extrabold text-on-background">Antecedentes Académicos</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[9px] text-slate-400 mb-1">Universidad / Institución</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-400">e.g. Universidad de Chile</div>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 mb-1">Año de titulación</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-500">2018</div>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 mb-1">Certificado de Título <span className="text-red-400">*</span></p>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-emerald-500 text-[13px]">description</span>
                          <span className="text-[9px] text-slate-500">Subir PDF o documento JPG</span>
                        </div>
                        <span className="text-[8px] font-bold text-primary-container">SELECCIONAR</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-100 p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-primary-container text-white text-[9px] font-black flex items-center justify-center">3</span>
                      <span className="text-xs font-extrabold text-on-background">Datos Legales y Profesionales</span>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 mb-1.5">Áreas de Especialidad</p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="flex items-center gap-1 bg-primary-container text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Derecho Penal <span className="opacity-70">×</span></span>
                        <span className="flex items-center gap-1 bg-primary-container text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Derecho Civil <span className="opacity-70">×</span></span>
                        <span className="text-[9px] text-primary-container font-bold px-2 py-0.5 rounded-full border border-primary-container/30">+ Agregar Área</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[9px] text-slate-400 mb-1">RUT (Personal)</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-500">12.345.678-9</div>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 mb-1">RUT (Asociado PJUD)</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-500">76.543.210-K</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Step 02 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2 space-y-8 lg:pl-16 text-center lg:text-left">
              <div className="text-[100px] sm:text-[120px] font-extrabold leading-none font-headline" style={{ color: '#EE6C4D', opacity: 0.15 }}>02</div>
              <h3 className="text-xl sm:text-2xl md:text-[30.7px] font-extrabold tracking-tight text-on-background">Contrata un plan con tokens</h3>
              <p className="text-base md:text-xl text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0 text-justify lg:text-left">
                Con nuestro <b>sistema de tokens</b>, cada token te permite contactar a un cliente pre-calificado en nuestro marketplace. Verás la información relevante del caso para decidir si vale la pena antes de usar tu token.
              </p>

            </div>
            {/* Mockup: Token Dashboard */}
            <div className="lg:order-1 relative bg-surface-container-low rounded-3xl p-8 shadow-inner overflow-hidden min-h-[450px]">
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tu balance</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-extrabold text-on-background">25</span>
                        <span className="text-sm text-slate-400 font-medium">tokens</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-[#EE6C4D]/10 flex items-center justify-center token-badge">
                      <span className="material-symbols-outlined text-[#EE6C4D] text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>toll</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-gradient-to-r from-[#EE6C4D] to-[#f4a261] rounded-full transition-all"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Plan Core · 15 tokens usados de 25</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2 w-full">
                    <span className="text-[9px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">Laboral</span>
                    <span className="text-[9px] text-slate-400">Hace 1h</span>
                  </div>
                  <p className="text-xs font-bold text-on-background leading-tight mb-1">Despido injustificado tras licencia médica</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-3">Trabajador despedido después de 3 años sin aviso previo ni pago de indem...</p>
                  <button className="bg-[#EE6C4D] text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:scale-105 transition-transform self-end">Más información</button>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-primary-container/30 relative flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2 w-full">
                    <span className="text-[9px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded-full">Civil</span>
                    <span className="text-[9px] text-slate-400">Hace 30 min</span>
                    <span className="text-[8px] bg-primary-container/10 text-primary-container font-bold px-2 py-0.5 rounded-full ml-auto">✨ Recomendado</span>
                  </div>
                  <p className="text-xs font-bold text-on-background leading-tight mb-1">Incumplimiento de contrato de arriendo</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-3">Arrendatario con 4 meses de deuda, necesita apoyo para proceso de desah...</p>
                  <button className="bg-[#EE6C4D] text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:scale-105 transition-transform self-end">Más información</button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 03 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="text-[100px] sm:text-[120px] font-extrabold leading-none font-headline" style={{ color: '#EE6C4D', opacity: 0.15 }}>03</div>
              <h3 className="text-xl sm:text-2xl md:text-[30.7px] font-extrabold tracking-tight text-on-background">Elige tu caso y conecta</h3>
              <p className="text-base md:text-xl text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0 text-justify lg:text-left">
                Según tu área de especialidad, <b>usa un token</b> para iniciar una conversación directa con el cliente. Preséntale tu propuesta y demuestra por qué eres la mejor opción para su caso.
              </p>

            </div>
            {/* Mockup: Chat / Connection */}
            <div className="relative bg-on-background rounded-3xl p-12 text-white overflow-hidden min-h-[400px] flex items-center justify-center">
              <div className="space-y-5 w-full max-w-sm">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="w-12 h-12 rounded-full bg-[#EE6C4D] flex items-center justify-center">
                    <span className="material-symbols-outlined">forum</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold">Conversación iniciada</div>
                    <div className="text-xs text-slate-400">Caso: Incumplimiento de contrato</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-2xl rounded-bl-md p-3 max-w-[85%]">
                    <p className="text-[11px] leading-relaxed">Hola, soy el Dr. Mendoza. He revisado su caso y tengo experiencia en contratos de arriendo...</p>
                    <p className="text-[8px] text-slate-500 mt-1 text-right">10:32</p>
                  </div>
                  <div className="bg-[#EE6C4D]/20 rounded-2xl rounded-br-md p-3 max-w-[85%] ml-auto">
                    <p className="text-[11px] leading-relaxed">Muchas gracias, ¿en cuánto tiempo podríamos resolver esto?</p>
                    <p className="text-[8px] text-slate-400 mt-1 text-right">10:34</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[11px] text-slate-300 font-medium">Cliente en línea · Respondió hace 2 min</span>
                </div>
                <button className="w-full py-3.5 bg-[#EE6C4D] text-white font-black rounded-full shadow-lg text-sm">Enviar propuesta formal</button>
              </div>
            </div>
          </div>
        </section>

        {/* ======================== PRICING SECTION ======================== */}
        <section id="pricing" className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block bg-[#EE6C4D]/10 text-[#EE6C4D] font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-full">Planes</span>
            <h2 className="text-2xl sm:text-3xl md:text-[41.4px] font-extrabold tracking-tight text-on-background">Elige el plan ideal para tu práctica</h2>
            <p className="text-base text-secondary max-w-2xl mx-auto text-justify md:text-center">Cada token te conecta con un cliente pre-calificado. Más tokens, más oportunidades de negocio.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Plan Base */}
            <div className="pricing-card bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col">
              <div className="mb-8">
                <h3 className="text-lg font-extrabold text-on-background tracking-tight">Plan Base</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-sm text-slate-400 font-medium">$</span>
                  <span className="text-[48px] font-extrabold text-on-background leading-none tracking-tight">12.990</span>
                  <span className="text-sm text-slate-400 font-medium">/mes</span>
                </div>
              </div>
              <Link to="/auth/registro" className="w-full text-center py-3.5 bg-slate-100 text-on-background font-bold rounded-full text-sm hover:bg-slate-200 transition-colors mb-8 inline-block">Comenzar</Link>
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">12 tokens incluidos</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">Token extra $1.500</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">Dashboard completo</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">Gestión de pagos y tracking</span>
                </div>
              </div>
            </div>

            {/* Plan Core */}
            <div className="pricing-card bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col">
              <div className="mb-8">
                <h3 className="text-lg font-extrabold text-on-background tracking-tight">Plan Core</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-sm text-slate-400 font-medium">$</span>
                  <span className="text-[48px] font-extrabold text-on-background leading-none tracking-tight">23.990</span>
                  <span className="text-sm text-slate-400 font-medium">/mes</span>
                </div>
              </div>
              <Link to="/auth/registro" className="w-full text-center py-3.5 bg-slate-100 text-on-background font-bold rounded-full text-sm hover:bg-slate-200 transition-colors mb-8 inline-block">Comenzar</Link>
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">25 tokens incluidos</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">Token extra $1.300</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium"><strong>Documentos legales simples</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">Poderes notariales</span>
                </div>
              </div>
            </div>

            {/* Plan Plus (POPULAR) */}
            <div className="pricing-card popular bg-white rounded-2xl p-8 shadow-lg flex flex-col relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary-container text-white text-[11px] font-extrabold px-5 py-1.5 rounded-full uppercase tracking-wider shadow-md">Popular</span>
              </div>
              <div className="mb-8 mt-2">
                <h3 className="text-lg font-extrabold text-primary tracking-tight">Plan Plus</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-sm text-slate-400 font-medium">$</span>
                  <span className="text-[48px] font-extrabold text-on-background leading-none tracking-tight">34.990</span>
                  <span className="text-sm text-slate-400 font-medium">/mes</span>
                </div>
              </div>
              <Link to="/auth/registro" className="w-full text-center py-3.5 bg-primary-container text-white font-bold rounded-full text-sm hover:bg-primary-container/90 transition-colors mb-8 inline-block shadow-[0_4px_15px_rgba(30,204,167,0.3)]">Comenzar</Link>
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">40 tokens incluidos</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium"><strong>Jurisprudencia avanzada</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">Demandas y apelaciones</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">Documentos complejos</span>
                </div>
              </div>
            </div>

            {/* Plan Apex */}
            <div className="pricing-card bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col">
              <div className="mb-8">
                <h3 className="text-lg font-extrabold text-on-background tracking-tight">Plan Apex</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-sm text-slate-400 font-medium">$</span>
                  <span className="text-[48px] font-extrabold text-on-background leading-none tracking-tight">79.990</span>
                  <span className="text-sm text-slate-400 font-medium">/mes</span>
                </div>
              </div>
              <Link to="/auth/registro" className="w-full text-center py-3.5 bg-slate-100 text-on-background font-bold rounded-full text-sm hover:bg-slate-200 transition-colors mb-8 inline-block">Comenzar</Link>
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">60 tokens incluidos</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium"><strong>Coaching grabado</strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">Soporte prioritario 24/7</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                  <span className="text-[14px] text-on-background font-medium">Todo el Plan Plus</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ======================== FINAL CTA ======================== */}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EE6C4D]/10 border border-[#EE6C4D]/20 text-[#EE6C4D] font-bold text-xs rounded-full shadow-sm">
              <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: '"FILL" 1' }}>rocket_launch</span>
              Empieza hoy mismo
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-background max-w-3xl mx-auto leading-tight">
              ¿Listo para encontrar nuevos clientes?
            </h2>

            {/* Subheading */}
            <p className="text-base md:text-xl text-secondary max-w-xl mx-auto leading-relaxed font-medium text-justify md:text-center">
              Únete a cientos de abogados que ya captaron clientes calificados sin perder tiempo en prospección.
            </p>

            {/* CTA Button */}
            <div className="pt-4 w-full sm:w-auto">
              <Link 
                to="/auth/registro" 
                className="abogado-gradient text-white px-10 py-5 rounded-2xl text-lg md:text-xl font-extrabold shadow-xl hover:scale-105 transition-all duration-300 inline-block text-center w-full sm:w-auto hover:shadow-[#EE6C4D]/20"
              >
                Comenzar ahora
              </Link>
            </div>
          </div>
        </motion.section>

      </main>

    </>
  )
}

export default Abogados
