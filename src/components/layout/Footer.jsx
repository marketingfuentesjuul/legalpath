import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#141b2c] text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link to="/">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-9 w-auto brightness-0 invert" />
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Conectamos personas con los mejores abogados especialistas de Chile. Justicia accesible, transparente y eficiente.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">share</span>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-6">
          <h4 className="font-bold text-base">Plataforma</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
            <li><Link to="/publicar-caso" className="hover:text-white transition-colors">Publicar Caso</Link></li>
            <li><Link to="/abogados" className="hover:text-white transition-colors">Para Abogados</Link></li>
            <li><Link to="/auth/registro" className="hover:text-white transition-colors">Registrarse</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-6">
          <h4 className="font-bold text-base">Recursos</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">¿Cómo funciona?</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Blog Legal</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-6">
          <h4 className="font-bold text-base">Contacto</h4>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-xl" style={{fontVariationSettings: '"FILL" 1'}}>phone_iphone</span>
            <span className="text-sm">+56 9 4052 2563</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-xl" style={{fontVariationSettings: '"FILL" 0'}}>mail</span>
            <span className="text-sm">contacto@legalpath.cl</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary-container text-xl" style={{fontVariationSettings: '"FILL" 0'}}>location_on</span>
            <span className="text-sm leading-tight">Providencia 1234, Of. 501,<br/>Santiago</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2024 LegalPath. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-white transition-colors">Términos y Condiciones</Link>
          <Link to="/" className="hover:text-white transition-colors">Política de Privacidad</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
