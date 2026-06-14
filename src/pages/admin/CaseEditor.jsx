import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DocumentViewer } from '../../components/ui/DocumentViewer';

const CATEGORIES = [
  'Penal', 'Civil', 'Laboral', 'Inmobiliario', 'Familia', 'Migratorio', 'Comercial', 'Tributario', 'Administrativo', 'Otro'
];

export default function CaseEditor() {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const { fetchBadgeCounts } = useOutletContext();

  const [caso, setCaso] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    polished_description: '',
    category: 'Otro',
    urgency: 'media',
    estimated_amount: '',
    region: '',
    city: ''
  });

  const [rejectionReason, setRejectionReason] = useState('');
  const [confirmModal, setConfirmModal] = useState({ show: false, action: null, title: '', message: '' });

  const loadCaseData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (error) throw error;
      setCaso(data);

      // Prepopulate form fields
      setFormData({
        title: data.title || '',
        polished_description: data.polished_description || '',
        category: data.category || 'Otro',
        urgency: data.urgency || 'media',
        estimated_amount: data.estimated_amount || '',
        region: data.region || '',
        city: data.city || ''
      });

      // Fetch documents robustly
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId);

      setDocuments(docsData || []);

      // Trigger sidebar badge refresh
      if (fetchBadgeCounts) {
        fetchBadgeCounts();
      }
    } catch (err) {
      console.error('Error loading case:', err);
      alert('Error al cargar la información del caso.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseData();
  }, [caseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApproveClick = () => {
    if (!formData.title.trim() || !formData.polished_description.trim()) {
      alert('El título y la descripción pulida son obligatorios para publicar.');
      return;
    }
    setConfirmModal({
      show: true,
      action: 'approve',
      title: 'Aprobar y Publicar Caso',
      message: '¿Estás seguro de que deseas aprobar y publicar este caso en el marketplace? Los cambios se guardarán y se notificará al cliente.'
    });
  };

  const handleRejectClick = () => {
    if (!rejectionReason.trim()) {
      alert('Debes escribir un motivo de rechazo.');
      return;
    }
    setConfirmModal({
      show: true,
      action: 'reject',
      title: 'Rechazar Caso',
      message: `¿Estás seguro de que deseas rechazar este caso?\nMotivo: "${rejectionReason}"`
    });
  };

  const executeAction = async () => {
    const action = confirmModal.action;
    setConfirmModal({ ...confirmModal, show: false });
    setActionLoading(true);

    try {
      if (action === 'approve') {
        const { error } = await supabase
          .from('cases')
          .update({
            title: formData.title,
            polished_description: formData.polished_description,
            category: formData.category,
            urgency: formData.urgency,
            estimated_amount: formData.estimated_amount ? Number(formData.estimated_amount) : null,
            region: formData.region,
            city: formData.city,
            admin_status: 'aprobado',
            status: 'activo'
          })
          .eq('id', caseId);

        if (error) throw error;

        // Try invoking notification function
        try {
          await supabase.functions.invoke('send-case-status-email', {
            body: {
              case_id: caseId,
              client_email: caso.client_email,
              status: 'aprobado',
              title: formData.title
            }
          });
        } catch (funcErr) {
          console.warn('Notification function not deployed or failed:', funcErr);
        }

        alert('Caso publicado en el marketplace con éxito.');
        navigate('/admin/casos');
      } else if (action === 'reject') {
        const { error } = await supabase
          .from('cases')
          .update({
            admin_status: 'rechazado',
            status: 'pending', // Do not activate
            polished_description: `Rechazado: ${rejectionReason}` // Temporarily store reason here as specified
          })
          .eq('id', caseId);

        if (error) throw error;

        // Try invoking notification function
        try {
          await supabase.functions.invoke('send-case-status-email', {
            body: {
              case_id: caseId,
              client_email: caso.client_email,
              status: 'rechazado',
              reason: rejectionReason
            }
          });
        } catch (funcErr) {
          console.warn('Notification function not deployed or failed:', funcErr);
        }

        alert('Caso rechazado. Se notificó al cliente.');
        navigate('/admin/casos');
      }
    } catch (err) {
      console.error('Error executing admin action on case:', err);
      alert('Error al guardar los cambios del caso.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-sm text-gray-500 gap-3">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-700 rounded-full animate-spin"></div>
        <span>Cargando datos del caso...</span>
      </div>
    );
  }

  if (!caso) {
    return (
      <div className="p-8 text-center text-gray-500">
        El caso especificado no existe o no pudo ser cargado.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Back button and header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/casos')}
          className="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer flex items-center"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Curar Caso</h2>
            <StatusBadge status={caso.admin_status} />
          </div>
          <p className="text-gray-500 text-sm mt-0.5">ID del caso: {caseId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Original case detail (Read-only) */}
        <div className="space-y-6">
          {/* Client Details */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Cliente (Alias)</p>
                <p className="text-gray-800 font-medium mt-1">{caso.alias_client || 'Invitado'}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Email de contacto</p>
                <p className="text-gray-800 font-medium mt-1">{caso.client_email || '-'}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Urgencia Declarada</p>
                <div className="mt-1">
                  <StatusBadge status={caso.urgency} />
                </div>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Monto Estimado Declarado</p>
                <p className="text-gray-800 font-medium mt-1">
                  {caso.estimated_amount ? `$${Number(caso.estimated_amount).toLocaleString('es-CL')}` : '-'}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Ubicación declarada</p>
                <p className="text-gray-800 font-medium mt-1">
                  {caso.region ? `${caso.city || ''}, ${caso.region}` : '-'}
                </p>
              </div>
            </div>
          </section>

          {/* Original description */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Descripción Original</h3>
            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-700 leading-relaxed min-h-[160px] whitespace-pre-wrap">
              {caso.description || 'Sin descripción original.'}
            </div>
          </section>

          {/* Attachments */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Documentos Adjuntos</h3>
            <DocumentViewer documents={documents} />
          </section>
        </div>

        {/* Right Column: Marketplace Curation (Editable) */}
        <div className="space-y-6">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-5">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Edición para el Marketplace</h3>

            <div className="space-y-4 text-sm">
              {/* Case Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Título del caso <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Demanda por incumplimiento de contrato de arriendo — RM"
                  maxLength={100}
                  className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all font-semibold"
                />
                <div className="flex justify-end">
                  <span className="text-[10px] text-gray-400 font-mono">
                    {formData.title.length}/100 caracteres
                  </span>
                </div>
              </div>

              {/* Polished description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Descripción Pulida <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="polished_description"
                  rows={8}
                  value={formData.polished_description}
                  onChange={handleInputChange}
                  placeholder="Reescribe la situación del cliente en lenguaje formal y claro..."
                  className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all leading-relaxed"
                />
              </div>

              {/* Grid for Category, Urgency, Estimated Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Categoría
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 outline-none cursor-pointer appearance-none text-gray-800 font-semibold"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Urgencia
                  </label>
                  <div className="relative">
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 outline-none cursor-pointer appearance-none text-gray-800 font-semibold"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Monto estimado (CLP)
                  </label>
                  <input
                    type="number"
                    name="estimated_amount"
                    value={formData.estimated_amount}
                    onChange={handleInputChange}
                    placeholder="Ej: 1500000"
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all font-semibold"
                  />
                </div>
              </div>

              {/* Geography fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Región
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Ej: Metropolitana"
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ej: Santiago"
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Curation Decision buttons */}
            <div className="border-t border-gray-150 pt-5 space-y-4">
              <button
                disabled={actionLoading}
                onClick={handleApproveClick}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">publish</span>
                Aprobar y Publicar
              </button>

              <div className="h-px bg-gray-100 my-2"></div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Motivo de rechazo (requerido para rechazar):
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Detalla el motivo por el cual rechazas este caso..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all resize-none"
                />
              </div>

              <button
                disabled={actionLoading || !rejectionReason.trim()}
                onClick={handleRejectClick}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-650 hover:bg-red-550 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-none"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Rechazar Caso
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 mx-4 animate-in zoom-in-95 duration-200">
            <h4 className="text-lg font-bold text-gray-800">{confirmModal.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{confirmModal.message}</p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={executeAction}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                  confirmModal.action === 'reject'
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
