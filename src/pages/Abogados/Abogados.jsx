import { Link } from 'react-router-dom'

const Abogados = () => {
  return (
    <>
      <style>{`
        .abogado-gradient { background: linear-gradient(135deg, #EE6C4D 0%, #ff8a6d 100%); }
        .pricing-card { border: 1px solid #f1f5f9; transition: all 0.3s ease; }
        .pricing-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(238,108,77,0.1); border-color: #EE6C4D; }
        .hero-abogado-text { color: #EE6C4D; }
      `}</style>

      <div className="min-h-screen bg-background">
        {/* ======================== HERO SECTION ======================== */}
        <section className="relative pt-32 pb-20 px-8 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#EE6C4D]/5 blur-[120px] rounded-full -z-10"></div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EE6C4D]/10 text-[#EE6C4D] rounded-full text-xs font-bold tracking-widest uppercase">
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: '"FILL" 1'}}>trending_up</span>
                    Haz crecer tu estudio jurídico
                </div>
                <h1 className="text-[51px] md:text-[68px] font-extrabold tracking-tighter leading-[1] text-on-background">
                    Consigue clientes <span className="hero-abogado-text">calificados</span> sin gastar en marketing.
                </h1>
                <p className="text-xl text-secondary leading-relaxed max-w-xl">
                    Deja de buscar clientes y permite que ellos te encuentren. Accede a un flujo constante de <b>casos pre-filtrados</b> y aumenta tu facturación de forma predecible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/auth/registro" className="abogado-gradient text-white px-10 py-5 rounded-full text-xl font-black shadow-xl hover:scale-105 transition-transform text-center inline-block">
                        Empezar gratis
                    </Link>
                    <a href="#como-funciona" className="bg-white text-on-background border-2 border-slate-100 px-10 py-5 rounded-full text-xl font-bold hover:bg-slate-50 transition-colors shadow-sm text-center">
                        Ver cómo funciona
                    </a>
                </div>
                
                <div className="flex items-center gap-6 pt-6 grayscale opacity-60">
                    <img src="https://www.vectorlogo.zone/logos/ucl_ac_uk/ucl_ac_uk-icon.svg" alt="Partner" className="h-8" />
                    <img src="https://www.vectorlogo.zone/logos/oxford/oxford-icon.svg" alt="Partner" className="h-8" />
                    <img src="https://www.vectorlogo.zone/logos/stanford/stanford-icon.svg" alt="Partner" className="h-8" />
                </div>
            </div>

            {/* Hero Mockup */}
            <div className="relative">
                <div className="relative z-10 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Panel de Abogado</div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold">Casos Disponibles</h3>
                                <p className="text-xs text-secondary">Tienes 12 casos nuevos en tu zona.</p>
                            </div>
                            <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold">Activo</div>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { title: 'Incumplimiento de Contrato', area: 'Civil', price: 'Alto', user: 'Maria J.' },
                                { title: 'Divorcio Mutuo Acuerdo', area: 'Familia', price: 'Medio', user: 'Pedro S.' },
                                { title: 'Demanda Laboral', area: 'Laboral', price: 'Alto', user: 'Roberto M.' },
                            ].map((caseItem, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-100 transition-colors cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-primary font-bold">{caseItem.user[0]}</div>
                                        <div>
                                            <p className="text-sm font-bold">{caseItem.title}</p>
                                            <p className="text-[10px] text-secondary">{caseItem.area} • Por {caseItem.user}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-[#EE6C4D]">Presupuesto {caseItem.price}</p>
                                        <button className="text-[10px] font-bold text-on-background mt-1 hover:underline">Ver detalles</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* ======================== PROCESS SECTION ======================== */}
        <section id="como-funciona" className="max-w-7xl mx-auto px-8 py-32 space-y-40">
            <div className="text-center mb-16">
                <h2 className="text-[41.4px] font-extrabold tracking-tight text-on-background leading-tight">¿Cómo funciona?</h2>
                <div className="w-16 h-1 bg-[#EE6C4D] mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Step 01 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                    <div className="text-[120px] font-extrabold leading-none opacity-10 font-headline" style={{color: '#EE6C4D'}}>01</div>
                    <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Regístrate y certifica tu cuenta</h3>
                    <p className="text-xl text-secondary leading-relaxed">
                        Crea tu perfil profesional, sube tus credenciales (Título, RUT PJUD) y selecciona tus áreas de especialidad. Validamos cada perfil para asegurar la <b>calidad y confianza</b> de la plataforma.
                    </p>
                    <div className="flex items-center gap-4 text-[#EE6C4D] font-bold">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: '"FILL" 1'}}>verified_user</span>
                        <span>Verificación en menos de 24 horas</span>
                    </div>
                </div>
                <div className="bg-slate-50 rounded-[2.5rem] p-10 shadow-inner border border-slate-100">
                    <div className="bg-white rounded-2xl p-8 shadow-xl space-y-6">
                        <h4 className="text-lg font-bold">Registro de Profesional</h4>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="h-2 w-20 bg-slate-100 rounded"></div>
                                <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-xl"></div>
                            </div>
                            <div className="space-y-1">
                                <div className="h-2 w-24 bg-slate-100 rounded"></div>
                                <div className="h-10 w-full bg-slate-50 border border-slate-100 rounded-xl"></div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-[#EE6C4D]/5 rounded-xl border border-dashed border-[#EE6C4D]/30">
                                <span className="material-symbols-outlined text-[#EE6C4D]">upload_file</span>
                                <span className="text-xs font-bold text-[#EE6C4D]">Subir certificado de título</span>
                            </div>
                            <button className="w-full py-4 bg-[#EE6C4D] text-white font-bold rounded-xl shadow-lg shadow-[#EE6C4D]/20">Continuar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 02 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="lg:order-2 space-y-8">
                    <div className="text-[120px] font-extrabold leading-none opacity-10 font-headline" style={{color: '#EE6C4D'}}>02</div>
                    <h3 className="text-[30.7px] font-extrabold tracking-tight text-on-background">Postula a casos calificados</h3>
                    <p className="text-xl text-secondary leading-relaxed">
                        Recibe notificaciones en tiempo real sobre casos que coincidan con tu especialidad y ubicación. Revisa los detalles, adjuntos y <b>envía tu propuesta</b> personalizada directamente al cliente.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#EE6C4D]">check_circle</span>
                            <span className="font-bold">Lead calificado: con descripción y documentos.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#EE6C4D]">check_circle</span>
                            <span className="font-bold">Sin intermediarios: comunicación directa.</span>
                        </li>
                    </ul>
                </div>
                <div className="lg:order-1 relative">
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between group cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">gavel</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold">Demanda de Alimentos</p>
                                    <p className="text-[10px] text-slate-400">Hace 5 minutos • Santiago RM</p>
                                </div>
                            </div>
                            <button className="bg-[#EE6C4D] text-white px-4 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform">Más información</button>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-xl border-l-[6px] border-[#EE6C4D] flex items-center justify-between scale-105 z-10 relative">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#EE6C4D]/10 flex items-center justify-center text-[#EE6C4D]">
                                    <span className="material-symbols-outlined">family_restroom</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-[#EE6C4D]">Herencia y Sucesorios</p>
                                    <p className="text-[10px] text-slate-400">Hace 2 minutos • Valparaíso</p>
                                </div>
                            </div>
                            <button className="bg-[#EE6C4D] text-white px-4 py-2 rounded-full text-xs font-bold shadow-md">Más información</button>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between opacity-50 grayscale">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">business_center</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold">Constitución de Sociedad</p>
                                    <p className="text-[10px] text-slate-400">Hace 15 minutos • Concepción</p>
                                </div>
                            </div>
                            <button className="bg-slate-200 text-slate-400 px-4 py-2 rounded-full text-xs font-bold">Cerrado</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ======================== PRICING SECTION ======================== */}
        <section id="pricing" className="max-w-7xl mx-auto px-8 py-32 bg-[#EE6C4D]/[0.02] rounded-[3rem]">
            <div className="text-center mb-20 space-y-4">
                <span className="text-[#EE6C4D] font-extrabold text-xs tracking-widest uppercase bg-[#EE6C4D]/10 px-4 py-2 rounded-full">Planes Flexibles</span>
                <h2 className="text-[41.4px] font-extrabold tracking-tight">Escala según tus necesidades</h2>
                <p className="text-secondary max-w-xl mx-auto">Sin contratos a largo plazo. Cancela en cualquier momento.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* Plan Básico */}
                <div className="pricing-card bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
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
                            <span className="material-symbols-outlined text-[#EE6C4D] text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">15 tokens incluidos</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-[#EE6C4D] text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium"><strong>Tokens acumulables</strong></span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-[#EE6C4D] text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">Documentos legales simples</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-[#EE6C4D] text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">Poderes notariales</span>
                        </div>
                    </div>
                </div>

                {/* Plan Pro */}
                <div className="pricing-card bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
                    <div className="mb-8">
                        <h3 className="text-lg font-extrabold text-on-background tracking-tight">Plan Pro</h3>
                        <div className="flex items-baseline gap-1 mt-4">
                            <span className="text-sm text-slate-400 font-medium">$</span>
                            <span className="text-[48px] font-extrabold text-on-background leading-none tracking-tight">22.990</span>
                            <span className="text-sm text-slate-400 font-medium">/mes</span>
                        </div>
                    </div>
                    <Link to="/auth/registro" className="w-full text-center py-3.5 bg-slate-100 text-on-background font-bold rounded-full text-sm hover:bg-slate-200 transition-colors mb-8 inline-block">Comenzar</Link>
                    <div className="space-y-4 flex-1">
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">25 tokens incluidos</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium"><strong>Búsqueda avanzada</strong></span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium"><strong>Documentos legales simples</strong></span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">Poderes notariales</span>
                        </div>
                    </div>
                </div>

                {/* Plan Plus (POPULAR) */}
                <div className="pricing-card popular bg-white rounded-2xl p-8 shadow-lg flex flex-col relative border-2 border-primary-container hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
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
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">40 tokens incluidos</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium"><strong>Jurisprudencia avanzada</strong></span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">Demandas y apelaciones</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">Documentos complejos</span>
                        </div>
                    </div>
                </div>

                {/* Plan Apex */}
                <div className="pricing-card bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col hover:-translate-y-2 transition-transform duration-300">
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
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">60 tokens incluidos</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium"><strong>Coaching grabado</strong></span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
                            <span className="text-[14px] text-on-background font-medium">Soporte prioritario 24/7</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <span className="material-symbols-outlined text-primary-container text-[18px] mt-0.5" style={{fontVariationSettings: '"FILL" 1'}}>check_circle</span>
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
                        <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: '"FILL" 1'}}>rocket_launch</span>
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
      </div>
    </>
  )
}

export default Abogados
