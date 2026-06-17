import React, { useState } from 'react';
import LawyerInfoModal from './LawyerInfoModal';

export default function ProposalCard({ proposal, onAccept, onReject }) {
  const [loading, setLoading] = useState(false);
  const [isLawyerModalOpen, setIsLawyerModalOpen] = useState(false);

  const {
    id,
    case_id,
    message,
    estimated_price,
    lawyer_profiles,
    lawyer_id
  } = proposal;

  const lawyerName = lawyer_profiles
    ? `${lawyer_profiles.first_name || ''} ${lawyer_profiles.last_name_paternal || ''}`.trim()
    : 'Abogado';

  // Specialties formatting (first 2 specialties)
  const getSpecialtiesText = () => {
    if (!lawyer_profiles?.specialties || !Array.isArray(lawyer_profiles.specialties)) {
      return 'Abogado General';
    }
    const specs = lawyer_profiles.specialties.filter(Boolean);
    if (specs.length === 0) return 'Abogado General';
    return specs.slice(0, 2).join(' · ');
  };

  // Format price in CLP
  const formatCLP = (price) => {
    if (price === undefined || price === null) return '$0 CLP';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(price) + ' CLP';
  };

  // Initials for avatar fallback
  const getInitials = () => {
    if (!lawyer_profiles) return 'A';
    const first = lawyer_profiles.first_name?.[0] || '';
    const last = lawyer_profiles.last_name_paternal?.[0] || '';
    return (first + last).toUpperCase() || 'A';
  };

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleAcceptClick = () => {
    setShowAcceptModal(true);
  };

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const confirmAccept = async () => {
    setShowAcceptModal(false);
    setLoading(true);
    try {
      await onAccept(id, case_id);
    } catch (err) {
      alert(err.message || 'Error al aceptar la propuesta.');
    } finally {
      setLoading(false);
    }
  };

  const confirmReject = async () => {
    setShowRejectModal(false);
    setLoading(true);
    try {
      await onReject(id);
    } catch (err) {
      alert(err.message || 'Error al rechazar la propuesta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Lawyer Header Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#1ECCA7]/10 flex items-center justify-center text-[#006b56] font-bold text-lg border border-[#1ECCA7]/20 flex-shrink-0">
          {lawyer_profiles?.avatar_url ? (
            <img
              src={lawyer_profiles.avatar_url}
              alt={lawyerName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails
                e.target.style.display = 'none';
                e.target.parentNode.innerText = getInitials();
              }}
            />
          ) : (
            getInitials()
          )}
        </div>

        {/* Name and specialty */}
        <div className="min-w-0 flex-1">
          <h4 className="font-extrabold text-slate-800 text-base truncate">
            {lawyerName}
          </h4>
          <p className="text-xs font-bold text-[#1ECCA7] truncate">
            {getSpecialtiesText()}
          </p>
          {lawyer_profiles?.region && (
            <p className="text-xs text-slate-400 font-medium flex items-center gap-0.5 mt-0.5">
              <span className="material-symbols-outlined text-[13px]">location_on</span>
              <span>{lawyer_profiles.region}</span>
            </p>
          )}

          <button
            onClick={() => setIsLawyerModalOpen(true)}
            className="text-xs font-bold text-[#006b56] hover:underline flex items-center gap-1 mt-2 cursor-pointer"
          >
            <span>Más información sobre el abogado</span>
            <span className="material-symbols-outlined text-[16px]">
              open_in_new
            </span>
          </button>
        </div>
      </div>

      {/* Message content */}
      <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 mb-4">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
          Mensaje de la propuesta
        </span>
        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
          {message || 'Sin mensaje adicional.'}
        </p>
      </div>

      {/* Price block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 mb-4">
        <div>
          <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">
            Honorarios estimados
          </span>
          <span className="text-lg font-black text-slate-800">
            {formatCLP(estimated_price)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-slate-50">
        {proposal.status === 'enviada' ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRejectClick}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-bold text-slate-500 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 disabled:opacity-50 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              <span>Rechazar</span>
            </button>

            <button
              onClick={handleAcceptClick}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#1ECCA7] hover:bg-[#1bb896] hover:shadow-lg hover:shadow-[#1ECCA7]/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>Aceptar</span>
            </button>
          </div>
        ) : proposal.status === 'aceptada' ? (
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#006b56] border border-[#1ECCA7]/30 w-full shadow-sm">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Propuesta Aceptada</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 border border-slate-200 w-full">
            <span>Propuesta: {proposal.status === 'rechazada' ? 'Rechazada' : proposal.status}</span>
          </div>
        )}
      </div>

      {/* Custom Accept Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100/50 text-center animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
            {/* Animated Icon Container */}
            <div className="w-16 h-16 rounded-full bg-[#1ECCA7]/10 flex items-center justify-center text-[#1ECCA7] mb-6">
              <span className="material-symbols-outlined text-[36px]">gavel</span>
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-800 mb-3">
              ¿Confirmas que deseas trabajar con {lawyerName}?
            </h3>
            
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Al aceptar esta propuesta, el caso se marcará como <strong>en progreso</strong> con este abogado. Se rechazarán de manera automática las demás propuestas recibidas para este caso.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 py-3 px-5 rounded-xl text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAccept}
                className="flex-1 py-3 px-5 rounded-xl text-sm font-bold text-white bg-[#1ECCA7] hover:bg-[#1bb896] hover:shadow-lg hover:shadow-[#1ECCA7]/25 transition-all cursor-pointer"
              >
                Sí, Aceptar abogado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100/50 text-center animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center">
            {/* Animated Icon Container */}
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
              <span className="material-symbols-outlined text-[36px]">close</span>
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-800 mb-3">
              ¿Rechazar propuesta?
            </h3>
            
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
              ¿Estás seguro de que deseas rechazar la propuesta de <strong>{lawyerName}</strong>? Esta acción no se puede deshacer y el abogado ya no podrá postular a este caso.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 px-5 rounded-xl text-sm font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReject}
                className="flex-1 py-3 px-5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/25 transition-all cursor-pointer"
              >
                Sí, Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      <LawyerInfoModal
        lawyerId={lawyer_id}
        isOpen={isLawyerModalOpen}
        onClose={() => setIsLawyerModalOpen(false)}
      />
    </div>
  );
}
