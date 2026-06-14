import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { StatusBadge } from '../../components/ui/StatusBadge';

const CATEGORIES = [
  'Penal', 'Civil', 'Laboral', 'Inmobiliario', 'Familia', 'Migratorio', 'Comercial', 'Tributario', 'Administrativo', 'Otro'
];

export default function CaseQueue() {
  const { fetchBadgeCounts } = useOutletContext();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urgencyFilter, setUrgencyFilter] = useState('all'); // 'all' | 'baja' | 'media' | 'alta'
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  const fetchCases = async () => {
    setLoading(true);
    try {
      const from = page * itemsPerPage;
      const to = from + itemsPerPage - 1;

      // Base query for pending moderation
      let query = supabase
        .from('cases')
        .select(`
          id,
          alias_client,
          client_email,
          description,
          category,
          urgency,
          region,
          city,
          estimated_amount,
          status,
          admin_status,
          created_at
        `, { count: 'exact' })
        .eq('admin_status', 'en_revision');

      if (urgencyFilter !== 'all') {
        query = query.eq('urgency', urgencyFilter);
      }

      // Order by oldest first
      query = query
        .order('created_at', { ascending: true })
        .range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      setCases(data || []);
      setTotalCount(count || 0);

      // Trigger sidebar badge refresh
      if (fetchBadgeCounts) {
        fetchBadgeCounts();
      }
    } catch (err) {
      console.error('Error fetching cases queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [urgencyFilter, page]);

  // Handle local filters: category and text search
  const filteredCases = cases.filter(c => {
    // Description search
    const desc = (c.description || '').toLowerCase();
    const matchesSearch = desc.includes(searchTerm.toLowerCase());

    // Category multiple select filter
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(c.category);

    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

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

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Cola de Curación de Casos</h2>
        <p className="text-gray-500 text-sm mt-1">
          Revisa las solicitudes de clientes, reescríbelas profesionalmente y publícalas en el marketplace.
        </p>
      </div>

      {/* Controls Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Urgency Filters */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Todas las urgencias' },
              { id: 'baja', label: 'Baja' },
              { id: 'media', label: 'Media' },
              { id: 'alta', label: 'Alta' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setUrgencyFilter(tab.id);
                  setPage(0);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  urgencyFilter === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar en la descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Categories multiselect */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Filtrar por Categoría:</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="px-3 py-1 rounded-lg text-xs font-bold text-red-600 hover:text-red-800 hover:underline transition-all cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
              <span>Cargando casos...</span>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="p-16 text-center text-sm text-gray-400">
              No hay casos esperando curación con los filtros aplicados.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                  <th className="px-6 py-4">Cliente (Alias)</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Urgencia</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4">Monto Estimado</th>
                  <th className="px-6 py-4">Recibido</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCases.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {c.alias_client || 'Invitado'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-150 text-gray-700 border border-gray-250 rounded text-xs font-semibold">
                        {c.category || 'Sin curar'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={c.urgency} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {c.region ? `${c.city || ''}, ${c.region}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {c.estimated_amount ? `$${Number(c.estimated_amount).toLocaleString('es-CL')}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/casos/${c.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-semibold">
              Mostrando {page * itemsPerPage + 1} - {Math.min((page + 1) * itemsPerPage, totalCount)} de {totalCount} casos
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
