import React from 'react';
import { Link } from 'react-router-dom';

export default function CasoCard({ caso }) {
  const {
    id,
    title,
    description,
    polished_description,
    category,
    urgency,
    region,
    city,
    status,
    admin_status,
    created_at
  } = caso;

  // Status mapping logic
  let statusLabel = '';
  let statusStyles = '';

  if (admin_status === 'en_revision' && status === 'pending') {
    statusLabel = '🕐 En revisión';
    statusStyles = 'bg-slate-100 text-slate-600 border-slate-200';
  } else if (admin_status === 'rechazado' && status === 'pending') {
    statusLabel = '✗ No publicado';
    statusStyles = 'bg-red-50 text-red-600 border-red-200';
  } else if (admin_status === 'aprobado') {
    if (status === 'activo') {
      statusLabel = '✓ Recibiendo propuestas';
      statusStyles = 'bg-emerald-50 text-[#006b56] border-[#1ECCA7]/30';
    } else if (status === 'en_progreso') {
      statusLabel = '⚖️ Ya tiene abogado';
      statusStyles = 'bg-orange-50 text-[#a7391e] border-orange-200';
    } else if (status === 'finalizado') {
      statusLabel = '✓ Finalizado';
      statusStyles = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  } else {
    // Fallback in case of weird combinations
    statusLabel = `Estado: ${status}`;
    statusStyles = 'bg-slate-100 text-slate-600 border-slate-200';
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getUrgencyBadge = (urg) => {
    const val = String(urg).toLowerCase();
    if (val === 'alta' || val === 'high') {
      return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-700">Urgencia: Alta</span>;
    }
    if (val === 'media' || val === 'medium') {
      return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700">Urgencia: Media</span>;
    }
    return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">Urgencia: Baja</span>;
  };

  const displayTitle = title || (admin_status === 'en_revision' ? 'Caso en revisión' : 'Caso sin título');
  const displayDescription = polished_description || description;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Top Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-4">
          {/* Status Label */}
          <span className={`text-[12px] font-bold px-3 py-1 rounded-full border ${statusStyles}`}>
            {statusLabel}
          </span>
          {/* Date */}
          <span className="text-xs text-slate-400 font-medium">
            {formatDate(created_at)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-extrabold text-slate-800 mb-2 leading-snug">
          {displayTitle}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-600">
            {category || 'General'}
          </span>
          {getUrgencyBadge(urgency)}
          {region && (
            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-50 text-slate-500 border border-slate-100">
              📍 {city ? `${city}, ${region}` : region}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
          {displayDescription}
        </p>

        {/* Special Warning for Rejected Case */}
        {admin_status === 'rechazado' && (
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 text-xs text-red-700 mb-2">
            Tu caso no pudo ser publicado. Si tienes dudas, contáctanos en{' '}
            <a href="mailto:soporte@legalpath.cl" className="underline font-bold hover:text-red-900">
              soporte@legalpath.cl
            </a>
          </div>
        )}

        {/* Large "Ya tiene abogado" badge if in_progreso */}
        {status === 'en_progreso' && (
          <div className="mt-2 bg-[#EE6C4D]/10 border border-[#EE6C4D]/20 text-[#EE6C4D] rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 font-bold text-sm">
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            Ya tiene abogado asignado
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      {admin_status === 'aprobado' && status === 'activo' && (
        <div className="p-4 border-t border-slate-50 bg-slate-50/50">
          <Link
            to={`/cliente/propuestas?caso=${id}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#1ECCA7] hover:bg-[#1bb896] hover:shadow-lg hover:shadow-[#1ECCA7]/25 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span>Ver propuestas</span>
          </Link>
        </div>
      )}
    </div>
  );
}
