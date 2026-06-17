import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import AdminLoading from '../../components/ui/AdminLoading';

export default function Dashboard() {
  const { fetchBadgeCounts } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingCases: 0,
    pendingLawyers: 0,
    activeCases: 0,
    approvedLawyers: 0,
  });
  const [recentCases, setRecentCases] = useState([]);
  const [recentLawyers, setRecentLawyers] = useState([]);
  const [approvedCases, setApprovedCases] = useState([]);
  const [lawyerRequests, setLawyerRequests] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const [casosP, abogadosP, casosA, abogadosV] = await Promise.all([
        supabase.from('cases').select('id', { count: 'exact', head: true })
          .eq('admin_status', 'en_revision'),

        supabase.from('lawyer_profiles').select('id', { count: 'exact', head: true })
          .in('verification_status', ['pending', 'in_review']),

        supabase.from('cases').select('id', { count: 'exact', head: true })
          .eq('status', 'activo').eq('admin_status', 'aprobado'),

        supabase.from('lawyer_profiles').select('id', { count: 'exact', head: true })
          .eq('verification_status', 'approved'),
      ]);

      setStats({
        pendingCases: casosP.count || 0,
        pendingLawyers: abogadosP.count || 0,
        activeCases: casosA.count || 0,
        approvedLawyers: abogadosV.count || 0,
      });

      // Recent cases (pending review)
      const { data: casesData } = await supabase
        .from('cases')
        .select('id, alias_client, category, urgency, created_at, admin_status')
        .eq('admin_status', 'en_revision')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentCases(casesData || []);

      // Recent lawyers
      const { data: lawyersData } = await supabase
        .from('lawyer_profiles')
        .select('id, first_name, last_name_paternal, email, verification_status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentLawyers(lawyersData || []);

      // Approved cases sorted by approved_at DESC
      const { data: approvedCasesData } = await supabase
        .from('cases')
        .select('id, alias_client, category, urgency, approved_at, admin_status')
        .eq('admin_status', 'aprobado')
        .order('approved_at', { ascending: false, nullsFirst: false })
        .limit(5);

      setApprovedCases(approvedCasesData || []);

      // Lawyer requests (pending/in_review) sorted by created_at DESC
      const { data: lawyerRequestsData } = await supabase
        .from('lawyer_profiles')
        .select('id, first_name, last_name_paternal, email, verification_status, created_at, submitted_for_review_at')
        .in('verification_status', ['pending', 'in_review'])
        .order('created_at', { ascending: false })
        .limit(5);

      setLawyerRequests(lawyerRequestsData || []);
      
      // Update sidebar counts too
      if (fetchBadgeCounts) {
        fetchBadgeCounts();
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <AdminLoading text="Cargando dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Dashboard General</h2>
          <p className="text-gray-500 text-sm mt-1">Resumen operativo y actividad reciente en LegalPath.</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
        >
          <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
            refresh
          </span>
          Actualizar datos
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">pending_actions</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Casos Pendientes</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">{stats.pendingCases}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Esperando curación</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">gavel</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Abogados Pendientes</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">{stats.pendingLawyers}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Cola de verificación</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">storefront</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Casos Activos</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">{stats.activeCases}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">En el marketplace</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Abogados Verificados</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">{stats.approvedLawyers}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Habilitados en total</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Cases */}
        <div className="space-y-8 flex flex-col">
          {/* Recent Cases */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-500">folder_open</span>
                <h3 className="font-bold text-gray-800">Últimos Casos Recibidos</h3>
              </div>
              <Link to="/admin/casos" className="text-xs font-bold text-gray-600 hover:text-gray-900 hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="flex-1 overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-gray-500">Cargando actividad...</div>
              ) : recentCases.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No hay casos registrados recientemente.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                      <th className="px-6 py-3">Cliente</th>
                      <th className="px-6 py-3">Categoría</th>
                      <th className="px-6 py-3">Urgencia</th>
                      <th className="px-6 py-3">Fecha</th>
                      <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentCases.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-semibold text-gray-700">
                          {c.alias_client || 'Invitado'}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{c.category || 'Sin categoría'}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={c.urgency} />
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {formatDate(c.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/casos/${c.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                          >
                            Curar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Approved Cases */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                <h3 className="font-bold text-gray-800">Casos Aprobados</h3>
              </div>
              <Link to="/admin/casos" className="text-xs font-bold text-gray-600 hover:text-gray-900 hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="flex-1 overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-gray-500">Cargando actividad...</div>
              ) : approvedCases.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No hay casos aprobados recientemente.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                      <th className="px-6 py-3">Cliente</th>
                      <th className="px-6 py-3">Categoría</th>
                      <th className="px-6 py-3">Urgencia</th>
                      <th className="px-6 py-3">Aprobado el</th>
                      <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {approvedCases.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-semibold text-gray-700">
                          {c.alias_client || 'Invitado'}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{c.category || 'Sin categoría'}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={c.urgency} />
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {formatDate(c.approved_at || c.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/casos/${c.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                          >
                            Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Lawyers */}
        <div className="space-y-8 flex flex-col">
          {/* Lawyer Requests */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">assignment_ind</span>
                <h3 className="font-bold text-gray-800">Últimas Solicitudes de Abogados</h3>
              </div>
              <Link to="/admin/abogados" className="text-xs font-bold text-gray-600 hover:text-gray-900 hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="flex-1 overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-gray-500">Cargando actividad...</div>
              ) : lawyerRequests.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No hay solicitudes de abogados pendientes.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                      <th className="px-6 py-3">Nombre</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Estado</th>
                      <th className="px-6 py-3">Solicitud</th>
                      <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {lawyerRequests.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-semibold text-gray-700">
                          {`${l.first_name} ${l.last_name_paternal || ''}`}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{l.email}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={l.verification_status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {formatDate(l.submitted_for_review_at || l.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/abogados/${l.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                          >
                            Revisar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent Lawyers */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-500">gavel</span>
                <h3 className="font-bold text-gray-800">Últimos Abogados Registrados</h3>
              </div>
              <Link to="/admin/abogados" className="text-xs font-bold text-gray-600 hover:text-gray-900 hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="flex-1 overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-gray-500">Cargando actividad...</div>
              ) : recentLawyers.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-400">No hay abogados registrados recientemente.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                      <th className="px-6 py-3">Nombre</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Estado</th>
                      <th className="px-6 py-3">Registro</th>
                      <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentLawyers.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-semibold text-gray-700">
                          {`${l.first_name} ${l.last_name_paternal || ''}`}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{l.email}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={l.verification_status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {formatDate(l.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/admin/abogados/${l.id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                          >
                            Revisar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
