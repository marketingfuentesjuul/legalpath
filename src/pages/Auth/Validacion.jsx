import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

const Validacion = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      
      if (error) throw error
      setProfile(data)
      
      // If approved, redirect to dashboard automatically
      if (data?.verification_status === 'approved') {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      console.error('Error fetching profile in verification page:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [user])

  const handleLogout = async () => {
    await signOut()
    navigate('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-orange-400/20 border-t-orange-400 rounded-full animate-spin"></div>
            <img
              src="/assets/images/logo-light.png"
              alt="LegalPath Logo"
              className="w-24 h-24 object-contain relative z-10"
            />
          </div>
          <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase mt-6 animate-pulse">
            Cargando estado...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <span className="material-symbols-outlined text-[48px] text-red-500">lock</span>
          <h2 className="text-xl font-bold text-slate-800">Sesión no iniciada</h2>
          <p className="text-slate-500 text-sm">Debes iniciar sesión para ver el estado de tu verificación.</p>
          <Link to="/auth/login" className="inline-block bg-[#EE6C4D] hover:bg-[#d65f42] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  const isRejected = profile?.verification_status === 'rejected'

  return (
    <>
      <style>{`
        .spinner-ring {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 4px solid rgba(238, 108, 77, 0.1);
          border-top-color: #EE6C4D;
          animation: val-spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }
        .pulse-core { animation: val-pulse 2s infinite; }
        @keyframes val-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes val-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.9; } }
        .progress-bar-fill {
          background-image: linear-gradient(135deg, #EE6C4D 0%, #ff8a6d 100%);
          background-size: 200% 200%;
          animation: val-gradient 3s ease infinite, val-load 2.5s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
        }
        @keyframes val-load { 0% { width: 0%; } 100% { width: 65%; } }
        @keyframes val-gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>

      <div className="antialiased min-h-screen bg-background flex flex-col justify-between">
        {/* Header */}
        <header className="w-full bg-white border-b border-slate-200 py-4 px-8 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/assets/images/logo-light.png" alt="LegalPath Logo" className="h-8 w-auto" />
              <span className="text-secondary font-medium text-[15px] mb-0.5 tracking-tight hidden sm:inline-block">Abogados</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Estado</p>
                <p className={`text-[13px] font-bold ${isRejected ? 'text-red-500' : 'text-[#EE6C4D]'}`}>
                  {isRejected ? 'Rechazado' : 'Verificando'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                title="Cerrar sesión"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl flex flex-col items-center">

            {isRejected ? (
              // REJECTED STATE
              <div className="w-full flex flex-col items-center">
                <div className="relative w-[160px] h-[160px] flex items-center justify-center mb-10">
                  <div className="absolute inset-0 bg-red-500/5 rounded-full pulse-core animate-pulse"></div>
                  <div className="absolute inset-4 bg-white shadow-xl rounded-full flex flex-col items-center justify-center z-10 border border-red-100">
                    <span className="material-symbols-outlined text-[42px] text-red-500 font-light mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                  </div>
                </div>

                <div className="text-center max-w-lg mb-8">
                  <h1 className="text-[28px] sm:text-[34px] font-extrabold text-on-background tracking-tight leading-[1.2] mb-4">
                    Tu solicitud ha sido rechazada
                  </h1>
                  <p className="text-[15px] text-secondary leading-relaxed px-4">
                    Lamentablemente, tu perfil profesional no cumple con todos los requisitos o la documentación adjunta no fue válida.
                  </p>
                </div>

                {/* Reason Card */}
                <div className="w-full bg-red-50/50 border border-red-200 rounded-2xl p-6 shadow-sm mb-8">
                  <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Motivo de rechazo indicado:</h3>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-red-100">
                    {profile?.rejection_reason || 'No se especificó un motivo de rechazo. Por favor, revisa tus documentos.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                  <Link 
                    to="/auth/perfil" 
                    className="bg-[#EE6C4D] hover:bg-[#d65f42] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Corregir y volver a enviar
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              // PENDING / IN REVIEW STATE
              <div className="w-full flex flex-col items-center">
                <div className="relative w-[160px] h-[160px] flex items-center justify-center mb-10">
                  <div className="absolute inset-0 bg-[#EE6C4D]/5 rounded-full pulse-core"></div>
                  <div className="absolute inset-4 bg-white shadow-xl rounded-full flex flex-col items-center justify-center z-10 border border-slate-100">
                    <span className="material-symbols-outlined text-[42px] text-[#EE6C4D] font-light mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>local_police</span>
                    <div className="flex gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EE6C4D]/30"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EE6C4D]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EE6C4D]/30"></span>
                    </div>
                  </div>
                  <div className="spinner-ring"></div>
                </div>

                <div className="text-center max-w-lg mb-10">
                  <h1 className="text-[28px] sm:text-[34px] font-extrabold text-on-background tracking-tight leading-[1.2] mb-4">
                    Estamos revisando tu perfil profesional
                  </h1>
                  <p className="text-[15px] text-secondary leading-relaxed px-4">
                    En LegalPath nos tomamos en serio la calidad de nuestra red. Estamos validando tus credenciales y documentos. Nos pondremos en contacto contigo en un plazo de <strong className="text-on-background">menos de 24 horas</strong> y recibirás un correo para confirmar y activar tu cuenta.
                  </p>
                </div>

                {/* Progress Card */}
                <div className="w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-[#EE6C4D] tracking-wider uppercase mb-1">Paso Actual</p>
                      <h3 className="text-[15px] font-bold text-on-background">Validación de Cédula y Antecedentes</h3>
                    </div>
                    <span className="text-[18px] font-extrabold text-[#EE6C4D]">65%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-8">
                    <div className="h-full progress-bar-fill rounded-full"></div>
                  </div>
                  <div className="flex justify-between px-2 sm:px-8">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#EE6C4D] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Documentos</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] text-[#EE6C4D] animate-spin" style={{ animationDuration: '3s' }}>sync</span>
                      </div>
                      <span className="text-[9px] font-bold text-[#EE6C4D] tracking-wider uppercase">Identidad</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 opacity-50">
                      <div className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-full">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">more_horiz</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Activación</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mt-10 border-t border-slate-200/60 pt-8 w-full max-w-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-[16px]">shield</span>
                <span className="text-[10px] font-bold tracking-wider uppercase">Seguridad Encriptada</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                <span className="text-[10px] font-bold tracking-wider uppercase">Cumplimiento Legal</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-slate-400 border-t border-slate-100 bg-white/50">
          <p>© 2026 LegalPath Inc. Todos los derechos reservados.</p>
          <div className="flex gap-4 font-medium">
            <a href="#" className="hover:text-slate-600 transition-colors">Soporte</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Términos</a>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Validacion
