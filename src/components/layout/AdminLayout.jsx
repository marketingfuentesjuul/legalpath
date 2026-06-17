import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Administrador');
  const [adminEmail, setAdminEmail] = useState('');
  const [pendingLawyers, setPendingLawyers] = useState(0);
  const [pendingCases, setPendingCases] = useState(0);

  const fetchBadgeCounts = async () => {
    try {
      // Pending lawyers (pending / in_review)
      const { count: lawyersCount, error: lawyersErr } = await supabase
        .from('lawyer_profiles')
        .select('id', { count: 'exact', head: true })
        .in('verification_status', ['pending', 'in_review']);
      
      if (!lawyersErr && lawyersCount !== null) {
        setPendingLawyers(lawyersCount);
      }

      // Pending cases (en_revision)
      const { count: casesCount, error: casesErr } = await supabase
        .from('cases')
        .select('id', { count: 'exact', head: true })
        .eq('admin_status', 'en_revision');

      if (!casesErr && casesCount !== null) {
        setPendingCases(casesCount);
      }
    } catch (err) {
      console.error('Error fetching badge counts:', err);
    }
  };

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setAdminEmail(user.email || '');
          const { data } = await supabase
            .from('admin_profiles')
            .select('full_name')
            .eq('id', user.id)
            .maybeSingle();
          if (data?.full_name) {
            setAdminName(data.full_name);
          }
        }
      } catch (err) {
        console.error('Error fetching admin info:', err);
      }
    };

    fetchAdminInfo();
    fetchBadgeCounts();

    // Set up polling or listen to realtime updates if necessary
    const interval = setInterval(fetchBadgeCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      await supabase.auth.signOut();
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0 border-r border-gray-700">
        <div className="relative h-20 px-6 border-b border-gray-700 flex justify-center items-center">
          <Link to="/admin" className="absolute flex items-center justify-center">
            <img
              src="/assets/images/logo-admin.png"
              alt="LegalPath Logo"
              className="h-[115px] w-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pt-4 pb-6 space-y-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white shadow-inner'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/abogados"
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white shadow-inner'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
              <span>Abogados</span>
            </div>
            {pendingLawyers > 0 && (
              <span className="bg-amber-500 text-gray-900 text-xs px-2 py-0.5 rounded-full font-extrabold shadow-sm">
                {pendingLawyers}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/admin/casos"
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-gray-700 text-white shadow-inner'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">folder_open</span>
              <span>Casos</span>
            </div>
            {pendingCases > 0 && (
              <span className="bg-amber-500 text-gray-900 text-xs px-2 py-0.5 rounded-full font-extrabold shadow-sm">
                {pendingCases}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-gray-700 bg-gray-900/50">
          <div className="flex flex-col mb-4 px-2">
            <span className="text-sm font-bold text-gray-200 truncate">{adminName}</span>
            <span className="text-xs text-gray-400 truncate">{adminEmail}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 border border-red-900/20 hover:border-red-900/40 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Panel de Administración</h1>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 bg-gray-50 px-4 py-2 border border-gray-100 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sistema en línea</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <Outlet context={{ fetchBadgeCounts }} />
        </main>
      </div>
    </div>
  );
}
