import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const location = useLocation()

  // Listen to custom event so sidebars can trigger this modal
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-help-modal', handleOpen)
    return () => window.removeEventListener('open-help-modal', handleOpen)
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('soporte@legalpath.cl')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Hide the floating button on admin pages, but keep the modal available if triggered programmatically
  const isAdminPath = location.pathname.startsWith('/admin')

  // Determine button positioning based on layout (e.g. client mobile navigation)
  const isClientMobile = location.pathname.startsWith('/cliente')

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && !isAdminPath && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed right-6 z-[9999] flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none ${
            location.pathname.startsWith('/abogados') || location.pathname.startsWith('/dashboard')
              ? 'bg-[#EE6C4D] hover:bg-[#d65f42] shadow-orange-500/20'
              : 'bg-[#1ECCA7] hover:bg-[#19b392] shadow-teal-500/20'
          } ${
            isClientMobile ? 'bottom-20 md:bottom-6' : 'bottom-6'
          }`}
          title="Ayuda y Soporte"
          aria-label="Ayuda y Soporte"
        >
          <span className="material-symbols-outlined text-[28px] animate-pulse group-hover:rotate-12 transition-transform">
            help_center
          </span>
        </button>
      )}

      {/* Modal Backdrop & Container */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl max-w-md w-full p-8 relative space-y-6 animate-in zoom-in-95 duration-200 font-sans">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-650 transition-colors w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 focus:outline-none"
              aria-label="Cerrar modal"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {/* Header Content */}
            <div className="space-y-2 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border mb-2 ${
                location.pathname.startsWith('/abogados') || location.pathname.startsWith('/dashboard')
                  ? 'bg-orange-50 border-orange-100 text-[#EE6C4D]'
                  : 'bg-teal-50 border-teal-100 text-[#1ECCA7]'
              }`}>
                <span className="material-symbols-outlined text-[32px]">support_agent</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                ¿Necesitas Ayuda?
              </h3>
              <p className="text-slate-500 text-sm font-medium">
                Soporte técnico y consultas de LegalPath
              </p>
            </div>

            {/* Body Description */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-slate-650 text-sm leading-relaxed font-medium text-center">
              Si tienes algún inconveniente con la página o algún problema técnico, por favor escríbenos al siguiente correo de consultas:
            </div>

            {/* Contact Email Action Card */}
            <div className="border border-slate-150 rounded-2xl p-4 flex flex-col items-center justify-between gap-3 bg-white">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Correo Electrónico</span>
              <a 
                href="mailto:soporte@legalpath.cl" 
                className="text-lg font-bold text-slate-800 hover:text-[#EE6C4D] transition-colors break-all select-all font-mono"
              >
                soporte@legalpath.cl
              </a>
              
              <button
                onClick={handleCopyEmail}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                  copied
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'check_circle' : 'content_copy'}
                </span>
                <span>{copied ? '¡Copiado!' : 'Copiar correo'}</span>
              </button>
            </div>

            {/* Footer Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm transition-colors shadow-md focus:outline-none"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
