import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function ClienteLayout() {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState('Cliente');
  const [clientEmail, setClientEmail] = useState('');

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setClientEmail(user.email || '');
          const { data } = await supabase
            .from('client_profiles')
            .select('first_name, last_name_paternal')
            .eq('id', user.id)
            .maybeSingle();
          if (data) {
            const name = `${data.first_name || ''} ${data.last_name_paternal || ''}`.trim();
            if (name) setClientName(name);
          }
        }
      } catch (err) {
        console.error('Error fetching client info:', err);
      }
    };
    fetchClientInfo();
  }, []);

  const handleSignOut = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await supabase.auth.signOut();
      navigate('/', { replace: true });
    }
  };

  const getInitials = () => {
    return clientName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'C';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 md:pb-0">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col flex-shrink-0">
        {/* Brand Logo */}
        <div className="h-20 px-6 border-b border-slate-100 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/assets/images/logo-light.png"
              alt="LegalPath Logo"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=Legal+Path&background=1ecca7&color=fff";
              }}
            />
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-teal-700 to-[#1ECCA7] bg-clip-text text-transparent">
              LegalPath
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 px-4 pt-6 space-y-1">
          <NavLink
            to="/cliente/mis-casos"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-[#1ECCA7]/10 text-[#006b56]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">folder</span>
            <span>Mis Casos</span>
          </NavLink>

          <NavLink
            to="/cliente/propuestas"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-[#1ECCA7]/10 text-[#006b56]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            <span>Propuestas</span>
          </NavLink>

          <NavLink
            to="/cliente/configuracion"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-[#1ECCA7]/10 text-[#006b56]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Configuración</span>
          </NavLink>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-help-modal'))}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-left"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Ayuda</span>
          </button>
        </nav>

        {/* Sidebar Footer (User Info & Sign Out) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-[#1ECCA7]/10 flex items-center justify-center text-[#006b56] font-bold text-sm border border-[#1ECCA7]/20 flex-shrink-0">
              {getInitials()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate leading-tight">
                {clientName}
              </p>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {clientEmail}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-100 hover:border-red-200 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header (hidden on desktop) */}
      <header className="md:hidden h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/images/logo-light.png"
            alt="LegalPath Logo"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              e.target.src = "https://ui-avatars.com/api/?name=Legal+Path&background=1ecca7&color=fff";
            }}
          />
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-teal-700 to-[#1ECCA7] bg-clip-text text-transparent">
            LegalPath
          </span>
        </Link>

        {/* User initials bubble on header */}
        <div className="w-8 h-8 rounded-full bg-[#1ECCA7]/10 flex items-center justify-center text-[#006b56] font-bold text-xs border border-[#1ECCA7]/20">
          {getInitials()}
        </div>
      </header>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-4 z-50 shadow-lg">
        <NavLink
          to="/cliente/mis-casos"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 w-16 h-full text-xs font-bold transition-all ${
              isActive ? 'text-[#006b56]' : 'text-slate-400'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">folder</span>
          <span>Casos</span>
        </NavLink>

        <NavLink
          to="/cliente/propuestas"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 w-16 h-full text-xs font-bold transition-all ${
              isActive ? 'text-[#006b56]' : 'text-slate-400'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">description</span>
          <span>Propuestas</span>
        </NavLink>

        <NavLink
          to="/cliente/configuracion"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 w-16 h-full text-xs font-bold transition-all ${
              isActive ? 'text-[#006b56]' : 'text-slate-400'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span>Config</span>
        </NavLink>

        <button
          onClick={handleSignOut}
          className="flex flex-col items-center justify-center gap-0.5 w-16 h-full text-xs font-bold text-red-500 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span>Salir</span>
        </button>
      </nav>

      {/* Page Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Top Header for Desktop */}
        <header className="hidden md:flex h-20 bg-white border-b border-slate-100 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1ECCA7] animate-pulse"></span>
            <h1 className="text-lg font-bold text-slate-800">Panel de Cliente</h1>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 border border-slate-100 rounded-xl">
            marketplace activo
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
