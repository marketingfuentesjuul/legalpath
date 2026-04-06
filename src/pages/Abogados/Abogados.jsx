import { Link } from 'react-router-dom'

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

            <h1 className="text-[41px] md:text-[66px] font-extrabold tracking-tighter leading-[1.1] text-on-background">
              <span className="text-[#EE6C4D]">Encuentra clientes</span> sin saber de marketing, sin grandes presupuestos y sin reuniones.
            </h1>

            <p className="text-xl text-secondary leading-relaxed max-w-3xl mx-auto">
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
        <section id="como-funciona" className="max-w-7xl mx-auto px-8 py-20 space-y-32">
          <div className="text-center mb-16">
            <h2 className="text-[41.4px] font-extrabold tracking-tight text-on-background leading-tight">¿Cómo funciona?</h2>
            <div className="w-16 h-1 bg-[#EE6C4D] mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Step 01 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="text-[120px] font-extrabold leading-none font-headline" style={{ color: '#EE6C4D', opacity: 0.15 }}>01</div>
              <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Regístrate y verifica tu perfil</h3>
              <p className="text-xl text-secondary leading-relaxed max-w-lg">
                Crea tu cuenta profesional y adjunta tus documentos para validar tu calidad de abogado. Verificamos tu <b>título profesional</b> y antecedentes ante la Corte Suprema.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#EE6C4D] mt-1">check_circle</span>
                  <p className="text-secondary"><span className="font-bold text-on-background">Perfil Verificado:</span> Sello de confianza visible para los clientes.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#EE6C4D] mt-1">check_circle</span>
                  <p className="text-secondary"><span className="font-bold text-on-background">Proceso Simple:</span> Solo necesitas tu título y cédula profesional.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#EE6C4D] mt-1">check_circle</span>
                  <p className="text-secondary"><span className="font-bold text-on-background">Áreas de Especialidad:</span> Define tus áreas para recibir casos relevantes.</p>
                </li>
              </ul>
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
            <div className="lg:order-2 space-y-8">
              <div className="text-[120px] font-extrabold leading-none font-headline" style={{ color: '#EE6C4D', opacity: 0.15 }}>02</div>
              <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Contrata un plan con tokens</h3>
              <p className="text-xl text-secondary leading-relaxed max-w-lg">
                Con nuestro <b>sistema de tokens</b>, cada token te permite contactar a un cliente pre-calificado en nuestro marketplace. Verás la información relevante del caso para decidir si vale la pena antes de usar tu token.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#EE6C4D] mt-1">check_circle</span>
                  <p className="text-secondary"><span className="font-bold text-on-background">Casos Filtrados:</span> Solo ves casos de tu área de especialidad.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#EE6C4D] mt-1">check_circle</span>
                  <p className="text-secondary"><span className="font-bold text-on-background">Información Clara:</span> Resumen del caso, categoría y urgencia antes de decidir.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#EE6C4D] mt-1">check_circle</span>
                  <p className="text-secondary"><span className="font-bold text-on-background">Sin Sorpresas:</span> Tú decides en qué casos invertir tus tokens.</p>
                </li>
              </ul>
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
            <div className="space-y-8">
              <div className="text-[120px] font-extrabold leading-none font-headline" style={{ color: '#EE6C4D', opacity: 0.15 }}>03</div>
              <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Elige tu caso y conecta</h3>
              <p className="text-xl text-secondary leading-relaxed max-w-lg">
                Según tu área de especialidad, <b>usa un token</b> para iniciar una conversación directa con el cliente. Preséntale tu propuesta y demuestra por qué eres la mejor opción para su caso.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#EE6C4D] mt-1">check_circle</span>
                  <p className="text-secondary"><span className="font-bold text-on-background">Conversación Directa:</span> Chat seguro dentro de la plataforma.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#EE6C4D] mt-1">check_circle</span>
                  <p className="text-secondary"><span className="font-bold text-on-background">Tú Propones:</span> Presenta tus servicios, experiencia y honorarios.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#EE6C4D] mt-1">check_circle</span>
                  <p className="text-secondary"><span className="font-bold text-on-background">Cliente Decide:</span> Tu reputación y propuesta son tu mejor carta.</p>
                </li>
              </ul>
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
            <h2 className="text-[41.4px] font-extrabold tracking-tight text-on-background">Elige el plan ideal para tu práctica</h2>
            <p className="text-secondary max-w-2xl mx-auto">Cada token te conecta con un cliente pre-calificado. Más tokens, más oportunidades de negocio.</p>
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
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="abogado-gradient rounded-xl p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full text-xs font-bold tracking-widest uppercase">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>rocket_launch</span>
                Empieza hoy
              </div>
              <h2 className="text-[41.4px] font-extrabold tracking-tight max-w-3xl mx-auto">¿Listo para encontrar nuevos clientes?</h2>
              <p className="text-xl opacity-90 max-w-xl mx-auto">Únete a cientos de abogados que ya captaron clientes calificados sin perder tiempo en prospección.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link to="/auth/registro" className="bg-white text-[#EE6C4D] px-10 py-5 rounded-full text-xl font-black shadow-xl hover:scale-105 transition-transform text-center inline-block">Comenzar ahora</Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0F141E] text-slate-300 mt-20 font-['Inter'] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 flex flex-col md:flex-row justify-between gap-12 mb-12">
          <div className="flex flex-col gap-6 md:w-1/3">
            <Link to="/">
              <img src="/assets/images/logo-dark.png" alt="LegalPath Logo" className="h-[76.8px] w-auto object-contain self-start hover:opacity-90 transition-opacity" />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Conectamos a personas que necesitan ayuda legal con abogados especialistas validados. Defendemos tus derechos de forma transparente y segura.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white tracking-widest mb-2 uppercase">Enlaces</h4>
            <Link to="/" className="text-sm hover:text-primary-container transition-colors">Inicio</Link>
            <a href="#como-funciona" className="text-sm hover:text-primary-container transition-colors">¿Cómo Funciona?</a>
            <a href="#pricing" className="text-sm hover:text-primary-container transition-colors">Planes</a>
            <a href="#" className="text-sm hover:text-primary-container transition-colors">FAQ</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold text-white tracking-widest mb-2 uppercase">Contacto</h4>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl" style={{ fontVariationSettings: '"FILL" 0' }}>call</span>
              <span className="text-sm">+56 9 4052 2563</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl" style={{ fontVariationSettings: '"FILL" 0' }}>mail</span>
              <span className="text-sm">contacto@legalpath.cl</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl" style={{ fontVariationSettings: '"FILL" 0' }}>location_on</span>
              <span className="text-sm leading-tight">Providencia 1234, Of. 501,<br />Santiago</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 lg:px-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2024 LegalPath. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Abogados
