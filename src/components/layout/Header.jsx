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
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 flex justify-center ${scrolled ? 'pt-4' : 'pt-0'}`}>
      <div className={`w-full transition-all duration-500 mx-4 ${
        scrolled 
          ? 'max-w-5xl bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.07)] border border-white/40 rounded-[2rem] py-2 px-6' 
          : 'max-w-7xl bg-transparent border border-transparent py-4 px-2'
      }`}>
        <nav className="w-full flex justify-between items-center font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
          <div className="flex items-center">
          <Link to="/">
            <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className={`w-auto transition-all duration-500 ${scrolled ? 'h-[34px]' : 'h-[40.8px]'}`} />
          </Link>
        </div>

        {!isPublicarCaso && (
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
        )}

        <div className="flex items-center gap-4">
          {isPublicarCaso ? (
            <Link to="/auth/login" className="bg-[#EE6C4D] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-95 active:scale-90 transition-transform text-center inline-block">
              Ingresar a mi cuenta
            </Link>
          ) : isAbogado ? (
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
      </div>
    </header>
  )
}

export default Header
