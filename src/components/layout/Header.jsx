import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Header = () => {
  const { pathname } = useLocation()
  const isAbogado = pathname.includes('/abogados')
  const isPublicarCaso = pathname.includes('/publicar-caso')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 flex justify-center ${scrolled ? 'pt-2' : 'pt-[15px]'}`}>
      <div className={`w-full transition-all duration-500 mx-4 ${
        scrolled 
          ? 'max-w-6xl bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] border border-white/40 rounded-[2rem] py-2 px-6' 
          : 'max-w-7xl bg-transparent border border-transparent py-2 px-2'
      }`}>
        <nav className="w-full flex justify-between items-center font-['Plus_Jakarta_Sans'] text-xs lg:text-sm font-medium tracking-tight">
          <div className="flex items-center shrink-0">
          <Link to="/">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className={`w-auto transition-all duration-500 ${scrolled ? 'h-[26px] lg:h-[32px]' : 'h-[36px] lg:h-[40.8px]'}`} />
          </Link>
        </div>

        {!isPublicarCaso && (
          <div className="hidden md:flex items-center gap-2 lg:gap-5 xl:gap-8">
            {isAbogado ? (
              <>
                <a href="#como-funciona" className="text-secondary hover:text-on-background transition-colors whitespace-nowrap">¿Cómo funciona?</a>
                <a href="#por-que-legalpath" className="text-secondary hover:text-on-background transition-colors whitespace-nowrap">Beneficios</a>
                <a href="#como-empezar" className="text-secondary hover:text-on-background transition-colors whitespace-nowrap">¿Cómo empezar?</a>
                <a href="#pricing" className="text-secondary hover:text-on-background transition-colors whitespace-nowrap">Planes</a>
              </>
            ) : (
              <>
                <a href="#como-funciona" className="text-secondary hover:text-on-background transition-colors whitespace-nowrap">¿Cómo Funciona?</a>
                <a href="#por-que-legalpath" className="text-secondary hover:text-on-background transition-colors whitespace-nowrap">Beneficios</a>
                <a href="#faq" className="text-secondary hover:text-on-background transition-colors whitespace-nowrap">Preguntas frecuentes</a>
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 lg:gap-3 xl:gap-4 shrink-0">
          {isPublicarCaso ? (
            <Link to="/auth/login" className="bg-[#EE6C4D] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block whitespace-nowrap">
              Ingresar a mi cuenta
            </Link>
          ) : isAbogado ? (
            <>
              <Link to="/" className="bg-primary-container text-white px-2.5 py-1.5 lg:px-5 lg:py-2 xl:px-6 xl:py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block whitespace-nowrap">
                Soy usuario
              </Link>
              <Link to="/auth/login" className="bg-white text-secondary border border-slate-200 px-2.5 py-1.5 lg:px-5 lg:py-2 xl:px-6 xl:py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block whitespace-nowrap">
                Iniciar sesión
              </Link>
              <Link to="/auth/registro" className="abogado-gradient text-white px-2.5 py-1.5 lg:px-5 lg:py-2 xl:px-6 xl:py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block whitespace-nowrap">
                Registrarme
              </Link>
            </>
          ) : (
            <>
              <Link to="/abogados" className="bg-[#EE6C4D] text-white px-3 py-1.5 lg:px-5 lg:py-2 xl:px-6 xl:py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block whitespace-nowrap">
                Soy abogado
              </Link>
              <Link to="/auth/login" className="mint-gradient text-white px-3 py-1.5 lg:px-5 lg:py-2 xl:px-6 xl:py-2.5 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block whitespace-nowrap">
                Ingresar a mi cuenta
              </Link>
            </>
          )}
        </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
