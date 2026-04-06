import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="w-full bg-[#0F141E] text-slate-300 font-['Inter'] pt-16 pb-8">
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
          <a href="#por-que-legalpath" className="text-sm hover:text-primary-container transition-colors">Beneficios</a>
          <a href="#faq" className="text-sm hover:text-primary-container transition-colors">FAQ</a>
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
  )
}

export default Footer
