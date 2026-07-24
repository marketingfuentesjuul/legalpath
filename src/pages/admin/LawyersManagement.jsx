import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import AdminLoading from '../../components/ui/AdminLoading';

export default function LawyersManagement() {
  const { fetchBadgeCounts } = useOutletContext();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended' | 'banned' | 'deleted'
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Moderation modal state
  const [moderationModal, setModerationModal] = useState({
    show: false,
    lawyer: null,
    action: 'suspend', // 'suspend' | 'ban' | 'reactivate'
    reason: ''
  });
  const [moderationLoading, setModerationLoading] = useState(false);
  const [alertModal, setAlertModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  const fetchLawyers = async () => {
    setLoading(true);
    setError(null);
    try {
      const from = page * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('lawyer_profiles')
        .select('id, first_name, last_name_paternal, email, status, verification_status, created_at, suspension_reason', { count: 'exact' });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, count, error: queryError } = await query;
      if (queryError) throw queryError;

      setLawyers(data || []);
      setTotalCount(count || 0);

      if (fetchBadgeCounts) {
        fetchBadgeCounts();
      }
    } catch (err) {
      console.error('Error fetching lawyers management:', err);
      setError(err.message || 'Error al cargar los abogados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [statusFilter, page]);

  const filteredLawyers = lawyers.filter(l => {
    const fullName = `${l.first_name || ''} ${l.last_name_paternal || ''}`.toLowerCase();
    const email = (l.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return fullName.includes(term) || email.includes(term);
  });

  const handleOpenModeration = (lawyer, action) => {
    setModerationModal({
      show: true,
      lawyer,
      action,
      reason: ''
    });
  };

  const handleExecuteModeration = async () => {
    const { lawyer, action, reason } = moderationModal;
    if ((action === 'suspend' || action === 'ban') && !reason.trim()) {
      setAlertModal({
        show: true,
        title: 'Motivo requerido',
        message: 'Debes ingresar un motivo para esta acción.',
        type: 'warning'
      });
      return;
    }

    setModerationLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const updates = {
        status: action === 'suspend' ? 'suspended' : action === 'ban' ? 'banned' : 'active',
        suspended_at: action === 'reactivate' ? null : new Date().toISOString(),
        suspended_by: user.id,
        suspension_reason: action === 'reactivate' ? null : reason
      };

      const { error: updateErr } = await supabase
        .from('lawyer_profiles')
        .update(updates)
        .eq('id', lawyer.id);

      if (updateErr) throw updateErr;

      // Opcional: Llamar a edge function de Supabase Auth para deshabilitar la sesión
      // (Supabase maneja esto de forma automática con RLS o desactivación del login).

      setAlertModal({
        show: true,
        title: action === 'suspend' ? 'Abogado suspendido' : action === 'ban' ? 'Abogado baneado' : 'Abogado reactivado',
        message: `El abogado ha sido ${action === 'suspend' ? 'suspendido' : action === 'ban' ? 'baneado' : 'reactivado'} con éxito.`,
        type: 'success'
      });
      setModerationModal({ show: false, lawyer: null, action: 'suspend', reason: '' });
      fetchLawyers();
    } catch (err) {
      console.error('Error executing lawyer moderation:', err);
      setAlertModal({
        show: true,
        title: 'Error de moderación',
        message: 'Ocurrió un error al procesar la moderación: ' + err.message,
        type: 'error'
      });
    } finally {
      setModerationLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading && lawyers.length === 0) {
    return <AdminLoading text="Cargando gestor de abogados..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Gestión General de Abogados</h2>
        <p className="text-gray-500 text-sm mt-1">
          Visualiza, modera y suspende o reactiva las cuentas de abogados de la plataforma.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl flex-wrap gap-1">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'active', label: 'Activos' },
            { id: 'suspended', label: 'Suspendidos' },
            { id: 'banned', label: 'Baneados' },
            { id: 'deleted', label: 'Eliminados' }
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

        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar abogado por nombre o mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {error ? (
            <div className="p-8 text-center text-red-500 font-semibold">{error}</div>
          ) : filteredLawyers.length === 0 ? (
            <div className="p-16 text-center text-sm text-gray-400">
              No se encontraron abogados en esta categoría.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Verificación</th>
                  <th className="px-6 py-4">Estado Cuenta</th>
                  <th className="px-6 py-4">F. Registro</th>
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
                    <td className="px-6 py-4">
                      <StatusBadge status={l.verification_status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        l.status === 'active' || !l.status
                          ? 'bg-emerald-50 text-emerald-700'
                          : l.status === 'suspended'
                          ? 'bg-amber-50 text-amber-700'
                          : l.status === 'banned'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {l.status === 'active' || !l.status
                          ? 'Activo'
                          : l.status === 'suspended'
                          ? 'Suspendido'
                          : l.status === 'banned'
                          ? 'Baneado'
                          : 'Eliminado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(l.created_at).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/abogados/${l.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        Ver Perfil
                      </Link>

                      {l.status === 'suspended' || l.status === 'banned' ? (
                        <button
                          onClick={() => handleOpenModeration(l, 'reactivate')}
                          className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          Reactivar
                        </button>
                      ) : l.status !== 'deleted' ? (
                        <>
                          <button
                            onClick={() => handleOpenModeration(l, 'suspend')}
                            className="inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            Suspender
                          </button>
                          <button
                            onClick={() => handleOpenModeration(l, 'ban')}
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Banear
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
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

      {/* Moderation Modal */}
      {moderationModal.show && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 mx-4 animate-in zoom-in-95 duration-200">
            <h4 className="text-lg font-bold text-gray-800 capitalize">
              {moderationModal.action === 'suspend'
                ? 'Suspender Abogado'
                : moderationModal.action === 'ban'
                ? 'Banear Abogado'
                : 'Reactivar Abogado'}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              {moderationModal.action === 'reactivate'
                ? `¿Estás seguro de que deseas reactivar la cuenta de ${moderationModal.lawyer?.first_name}? Volverá a tener permisos para iniciar sesión y postular.`
                : `Ingresa el motivo para ${moderationModal.action === 'suspend' ? 'suspender' : 'banear'} la cuenta de ${moderationModal.lawyer?.first_name}:`}
            </p>

            {moderationModal.action !== 'reactivate' && (
              <textarea
                rows={3}
                value={moderationModal.reason}
                onChange={(e) => setModerationModal({ ...moderationModal, reason: e.target.value })}
                placeholder="Indica el motivo detallado de esta acción de moderación..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all resize-none"
              />
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModerationModal({ show: false, lawyer: null, action: 'suspend', reason: '' })}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteModeration}
                disabled={moderationLoading}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                  moderationModal.action === 'reactivate'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {moderationLoading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.show && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 mx-4 text-center animate-in zoom-in-95 duration-200 flex flex-col items-center relative">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
              alertModal.type === 'success'
                ? 'bg-emerald-50 text-emerald-500'
                : alertModal.type === 'error'
                ? 'bg-red-50 text-red-500'
                : 'bg-amber-50 text-amber-500'
            }`}>
              <span className="material-symbols-outlined text-[36px]">
                {alertModal.type === 'success' ? 'check_circle' : alertModal.type === 'error' ? 'error' : 'warning'}
              </span>
            </div>

            {/* Title & Message */}
            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-gray-800">
                {alertModal.title}
              </h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {alertModal.message}
              </p>
            </div>

            {/* Button */}
            <button
              onClick={() => setAlertModal({ ...alertModal, show: false })}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md hover:shadow-lg cursor-pointer ${
                alertModal.type === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-600/20'
                  : alertModal.type === 'error'
                  ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-650/20'
                  : 'bg-amber-600 hover:bg-amber-500 hover:shadow-amber-600/20'
              }`}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
