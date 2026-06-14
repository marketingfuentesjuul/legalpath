import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function LawyerQueue() {
  const { fetchBadgeCounts } = useOutletContext();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'in_review'
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const from = page * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('lawyer_profiles')
        .select(`
          id,
          first_name,
          last_name_paternal,
          email,
          specialties,
          region,
          city,
          rut_personal,
          verification_status,
          submitted_for_review_at,
          created_at
        `, { count: 'exact' });

      if (statusFilter === 'all') {
        query = query.in('verification_status', ['pending', 'in_review']);
      } else {
        query = query.eq('verification_status', statusFilter);
      }

      // Order by oldest first
      query = query
        .order('submitted_for_review_at', { ascending: true, nullsFirst: false })
        .range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      setLawyers(data || []);
      setTotalCount(count || 0);

      // Trigger sidebar update
      if (fetchBadgeCounts) {
        fetchBadgeCounts();
      }
    } catch (err) {
      console.error('Error fetching lawyers queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [statusFilter, page]);

  // Handle local filtering for search term
  const filteredLawyers = lawyers.filter(l => {
    const fullName = `${l.first_name || ''} ${l.last_name_paternal || ''}`.toLowerCase();
    const email = (l.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || email.includes(term);
  });

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHrs === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins <= 1 ? 'Hace un momento' : `Hace ${diffMins} minutos`;
      }
      return `Hace ${diffHrs} ${diffHrs === 1 ? 'hora' : 'horas'}`;
    }
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 30) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Cola de Verificación de Abogados</h2>
        <p className="text-gray-500 text-sm mt-1">
          Revisa y aprueba el ingreso de nuevos abogados al ecosistema de LegalPath.
        </p>
      </div>

      {/* Controls: Filters & Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendientes' },
            { id: 'in_review', label: 'En revisión' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(0);
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Local Search Input */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
              <span>Cargando abogados...</span>
            </div>
          ) : filteredLawyers.length === 0 ? (
            <div className="p-16 text-center text-sm text-gray-400">
              No se encontraron abogados en esta cola.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Especialidades</th>
                  <th className="px-6 py-4">Región</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Enviado a revisión</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLawyers.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {`${l.first_name || ''} ${l.last_name_paternal || ''}`}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{l.email}</td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {l.specialties?.slice(0, 2).map((spec, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium border border-gray-200">
                            {spec}
                          </span>
                        ))}
                        {l.specialties?.length > 2 && (
                          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-800 rounded text-[10px] font-bold">
                            +{l.specialties.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {l.region || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={l.verification_status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {formatRelativeTime(l.submitted_for_review_at || l.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/abogados/${l.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-semibold">
              Mostrando {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, totalCount)} de {totalCount} abogados
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className="flex items-center px-3 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg">
                Pág. {page + 1} de {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
