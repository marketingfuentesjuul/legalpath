import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DocumentViewer } from '../../components/ui/DocumentViewer';
import AdminLoading from '../../components/ui/AdminLoading';

const ALLOWED_SPECIALTIES = [
  'Derecho Civil', 'Derecho Penal', 'Derecho Laboral', 'Derecho de Familia',
  'Fraude bancario', 'Choques',
  'Derecho Comercial / Mercantil', 'Derecho Tributario', 'Derecho Administrativo',
  'Derecho Ambiental', 'Derecho de Aguas', 'Derecho de Minería',
  'Derecho de Propiedad Intelectual', 'Derecho del Consumidor', 'Derecho Constitucional',
  'Derecho de Seguros', 'Derecho Marítimo', 'Derecho de Salud', 'Derecho de Migración',
  'Libre Competencia', 'Arbitraje y Mediación', 'Derecho Inmobiliario'
];

export default function LawyerReview() {
  const { id: lawyerId } = useParams();
  const navigate = useNavigate();
  const { fetchBadgeCounts } = useOutletContext();

  const [lawyer, setLawyer] = useState(null);
  const [education, setEducation] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [savingSpecs, setSavingSpecs] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Editable values
  const [adminNotes, setAdminNotes] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Custom dialog state
  const [confirmModal, setConfirmModal] = useState({ show: false, action: null, title: '', message: '' });
  const [successModal, setSuccessModal] = useState({ show: false, title: '', message: '', targetPath: null });

  const loadLawyerData = async () => {
    setLoading(true);
    try {
      // Fetch lawyer details
      const { data, error } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('id', lawyerId)
        .single();

      if (error) throw error;
      setLawyer(data);
      setAdminNotes(data.admin_notes || '');
      setSpecialties(data.specialties || []);

      // Fetch education
      const { data: eduData } = await supabase
        .from('lawyer_education')
        .select('*')
        .eq('profile_id', lawyerId);
      
      setEducation(eduData || []);

      // Fetch documents robustly (uploaded_by matches lawyerId)
      const { data: docsData } = await supabase
        .from('documents')
        .select('*')
        .eq('uploaded_by', lawyerId);

      setDocuments(docsData || []);

      // Trigger sidebar badge refresh
      if (fetchBadgeCounts) {
        fetchBadgeCounts();
      }
    } catch (err) {
      console.error('Error loading lawyer profile:', err);
      alert('Error al cargar la información del abogado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLawyerData();
  }, [lawyerId]);

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      const { error } = await supabase
        .from('lawyer_profiles')
        .update({ admin_notes: adminNotes })
        .eq('id', lawyerId);
      if (error) throw error;
      setSuccessModal({
        show: true,
        title: 'Nota Guardada',
        message: 'Las notas internas se han actualizado correctamente.',
        targetPath: null
      });
    } catch (err) {
      console.error('Error saving admin note:', err);
      alert('Error al guardar la nota.');
    } finally {
      setSavingNote(false);
    }
  };

  const handleAddSpecialty = async (spec) => {
    if (!spec || specialties.includes(spec)) return;
    const updated = [...specialties, spec];
    setSpecialties(updated);
    await saveSpecialties(updated);
  };

  const handleRemoveSpecialty = async (spec) => {
    const updated = specialties.filter(s => s !== spec);
    setSpecialties(updated);
    await saveSpecialties(updated);
  };

  const saveSpecialties = async (newSpecs) => {
    setSavingSpecs(true);
    try {
      const { error } = await supabase
        .from('lawyer_profiles')
        .update({ specialties: newSpecs })
        .eq('id', lawyerId);
      if (error) throw error;
    } catch (err) {
      console.error('Error saving specialties:', err);
      alert('Error al actualizar especialidades.');
    } finally {
      setSavingSpecs(false);
    }
  };

  const handleApprove = () => {
    setConfirmModal({
      show: true,
      action: 'approve',
      title: 'Aprobar Abogado',
      message: '¿Estás seguro de que deseas aprobar este perfil? Se le enviará un correo electrónico confirmando su acceso.'
    });
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setSuccessModal({
        show: true,
        title: 'Atención',
        message: 'Debes escribir un motivo de rechazo.',
        targetPath: null
      });
      return;
    }
    setConfirmModal({
      show: true,
      action: 'reject',
      title: 'Rechazar Abogado',
      message: `¿Estás seguro de que deseas rechazar este perfil por la siguiente razón?\n"${rejectionReason}"`
    });
  };

  const handleRevert = () => {
    setConfirmModal({
      show: true,
      action: 'revert',
      title: 'Revertir a Revisión',
      message: '¿Estás seguro de que deseas volver a poner este perfil en estado de revisión?'
    });
  };

  const executeAction = async () => {
    const action = confirmModal.action;
    setConfirmModal({ ...confirmModal, show: false });
    setActionLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const updates = {
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      };

      if (action === 'approve') {
        updates.verification_status = 'approved';
        updates.rejection_reason = null;
      } else if (action === 'reject') {
        updates.verification_status = 'rejected';
        updates.rejection_reason = rejectionReason;
      } else if (action === 'revert') {
        updates.verification_status = 'in_review';
        updates.rejection_reason = null;
      }

      const { error } = await supabase
        .from('lawyer_profiles')
        .update(updates)
        .eq('id', lawyerId);

      if (error) throw error;

      const successTitle = action === 'approve'
        ? 'Abogado Aprobado'
        : action === 'reject'
        ? 'Abogado Rechazado'
        : 'Perfil Revertido';

      const successMessage = action === 'approve'
        ? 'El abogado se traspasó correctamente a estado de aprobación.'
        : action === 'reject'
        ? 'El perfil se ha rechazado correctamente y se le notificará por correo electrónico.'
        : 'El estado del perfil se ha revertido a revisión.';

      setSuccessModal({
        show: true,
        title: successTitle,
        message: successMessage,
        targetPath: action === 'revert' ? null : '/admin/abogados'
      });
      
      if (fetchBadgeCounts) {
        fetchBadgeCounts();
      }
    } catch (err) {
      console.error('Error executing admin action:', err);
      alert('Error al procesar la solicitud.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <AdminLoading text="Cargando perfil del abogado..." />;
  }

  if (!lawyer) {
    return (
      <div className="p-8 text-center text-gray-500">
        El perfil especificado no existe o no pudo ser cargado.
      </div>
    );
  }

  const lawyerFullName = `${lawyer.first_name || ''} ${lawyer.second_name || ''} ${lawyer.last_name_paternal || ''} ${lawyer.last_name_maternal || ''}`.trim();

  return (
    <div className="space-y-6 relative pb-16">
      {/* Back button and title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/abogados')}
          className="p-2 border border-gray-200 rounded-xl bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer flex items-center"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">{lawyerFullName}</h2>
            <StatusBadge status={lawyer.verification_status} />
          </div>
          <p className="text-gray-500 text-sm mt-0.5">ID del abogado: {lawyerId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Nombre Completo</p>
                <p className="text-gray-800 font-medium mt-1">{lawyerFullName}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Correo Electrónico</p>
                <p className="text-gray-800 font-medium mt-1">{lawyer.email}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">RUT Personal</p>
                <p className="text-gray-800 font-mono font-medium mt-1">{lawyer.rut_personal || '-'}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">RUT PJUD</p>
                <p className="text-gray-800 font-mono font-medium mt-1">{lawyer.rut_pjud || 'No aplica / No ingresado'}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Ubicación</p>
                <p className="text-gray-800 font-medium mt-1">{`${lawyer.city || ''}, ${lawyer.region || ''}`}</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Miembro del Colegio de Abogados</p>
                <p className="text-gray-800 font-mono font-medium mt-1">{lawyer.colegio_id || 'Sin ID registrado'}</p>
              </div>
            </div>
          </section>

          {/* Specialties */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-800 text-lg">Áreas de Especialidad</h3>
              {savingSpecs && <span className="text-xs text-gray-400 animate-pulse font-medium">Guardando...</span>}
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 min-h-12 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                {specialties.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">Sin especialidades seleccionadas.</p>
                ) : (
                  specialties.map(spec => (
                    <span key={spec} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 shadow-sm">
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(spec)}
                        className="hover:text-orange-900 transition-colors flex items-center"
                        title={`Eliminar ${spec}`}
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-bold">Agregar especialidad:</span>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      handleAddSpecialty(e.target.value);
                      e.target.selectedIndex = 0;
                    }}
                    className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-gray-400 outline-none cursor-pointer pr-8 shadow-sm appearance-none"
                  >
                    <option value="" disabled selected>+ Agregar Área</option>
                    {ALLOWED_SPECIALTIES.map(s => (
                      <option key={s} value={s} disabled={specialties.includes(s)}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[14px] pointer-events-none select-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Academic History */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Formación Académica</h3>
            {education.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No se han registrado títulos o grados.</p>
            ) : (
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-gray-50/70 border border-gray-200/50 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-gray-800 text-sm capitalize">{edu.study_level}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{edu.institution} — Graduado en {edu.graduation_year}</p>
                    </div>
                    {edu.certificate_url && (
                      <a
                        href={edu.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 transition-all shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">school</span>
                        Ver certificado
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Attachments */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Documentos Adjuntos</h3>
            <DocumentViewer documents={documents} />
          </section>

          {/* Admin Internal Notes */}
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Notas Internas</h3>
            <div className="space-y-3">
              <textarea
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Escribe notas internas visibles únicamente por el equipo de administración..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Guardar nota
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Decisional Right Sidebar Panel */}
        <div className="space-y-6">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-6">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider border-b border-gray-100 pb-3">
              Tomar Decisión
            </h3>

            {/* If status is pending or in review */}
            {(lawyer.verification_status === 'pending' || lawyer.verification_status === 'in_review') && (
              <div className="space-y-5">
                <button
                  disabled={actionLoading}
                  onClick={handleApprove}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Aprobar Perfil
                </button>

                <div className="h-px bg-gray-100 my-2"></div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
                    Motivo de rechazo (requerido):
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Indica la razón por la cual rechazas el perfil..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  disabled={actionLoading || !rejectionReason.trim()}
                  onClick={handleReject}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  Rechazar Perfil
                </button>
              </div>
            )}

            {/* If status is approved */}
            {lawyer.verification_status === 'approved' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Perfil aprobado</span>
                  </div>
                  {lawyer.reviewed_at && (
                    <p className="text-xs text-emerald-700/80">
                      Revisado el: {new Date(lawyer.reviewed_at).toLocaleDateString('es-CL')}
                    </p>
                  )}
                </div>

                <button
                  disabled={actionLoading}
                  onClick={handleRevert}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-amber-300 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100/70 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">history</span>
                  Revertir a revisión
                </button>
              </div>
            )}

            {/* If status is rejected */}
            {lawyer.verification_status === 'rejected' && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                  <div className="flex items-center gap-2 font-bold mb-1.5">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>Perfil rechazado</span>
                  </div>
                  <p className="text-xs font-bold text-red-700 mb-1">Motivo:</p>
                  <p className="text-xs text-red-600 bg-white/60 p-2.5 rounded-lg border border-red-100 font-medium">
                    {lawyer.rejection_reason || 'Sin motivo ingresado'}
                  </p>
                  {lawyer.reviewed_at && (
                    <p className="text-[10px] text-red-500/80 mt-2">
                      Revisado el: {new Date(lawyer.reviewed_at).toLocaleDateString('es-CL')}
                    </p>
                  )}
                </div>

                <button
                  disabled={actionLoading}
                  onClick={handleApprove}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  Aprobar de todas formas
                </button>
              </div>
            )}
          </div>
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

      {/* Success Dialog Modal */}
      {successModal.show && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-150 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 mx-4 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-800 tracking-tight">{successModal.title}</h4>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{successModal.message}</p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSuccessModal({ ...successModal, show: false });
                  if (successModal.targetPath) {
                    navigate(successModal.targetPath);
                  } else {
                    loadLawyerData();
                  }
                }}
                className="w-full py-3 bg-[#EE6C4D] hover:bg-[#EE6C4D]/90 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
