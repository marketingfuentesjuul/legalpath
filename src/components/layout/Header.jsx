import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const { pathname } = useLocation()
  const isAbogado = pathname.includes('/abogados')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-lg shadow-[0_20px_40px_rgba(20,27,44,0.06)] py-2' 
        : 'bg-white/0 py-4'
    }`}>
      <nav className="max-w-7xl mx-auto px-8 flex justify-between items-center font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
        <div className="flex items-center">
          <Link to="/">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-[40.8px] w-auto" />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {isAbogado ? (
            <>
              <a href="#como-funciona" className="text-secondary hover:text-on-background transition-colors">¿Cómo funciona?</a>
              <a href="#pricing" className="text-secondary hover:text-on-background transition-colors">Planes</a>
            </>
          ) : (
            <>
              <a href="#como-funciona" className="text-secondary hover:text-on-background transition-colors">¿Cómo Funciona?</a>
              <a href="#por-que-legalpath" className="text-secondary hover:text-on-background transition-colors">¿Por qué LegalPath?</a>
              <a href="#faq" className="text-secondary hover:text-on-background transition-colors">Preguntas frecuentes</a>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isAbogado ? (
            <>
              <Link to="/" className="bg-primary-container text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block">
                Soy usuario
              </Link>
              <Link to="/auth/registro" className="abogado-gradient text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block">
                Registrarme
              </Link>
            </>
          ) : (
            <>
              <Link to="/abogados" className="bg-[#EE6C4D] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block">
                Soy abogado
              </Link>
              <Link to="/publicar-caso" className="mint-gradient text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block">
                Publicar mi caso
              </Link>
            </>
          )}
        </div>
      </nav>
      <div className={`transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'} bg-slate-100/50 h-px w-full absolute bottom-0`}></div>
    </header>
  )
}

export default Header
