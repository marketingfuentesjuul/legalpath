import React from 'react';

const STATUS_COLORS = {
  // Verificación de abogados
  pending:    'bg-gray-100 text-gray-700 border border-gray-200',
  in_review:  'bg-yellow-100 text-yellow-800 border border-yellow-200',
  approved:   'bg-green-100 text-green-800 border border-green-200',
  rejected:   'bg-red-100 text-red-800 border border-red-200',
  // Admin status de casos
  en_revision:'bg-yellow-100 text-yellow-800 border border-yellow-200',
  aprobado:   'bg-green-100 text-green-800 border border-green-200',
  rechazado:  'bg-red-100 text-red-800 border border-red-200',
  // Urgencia
  baja:       'bg-blue-100 text-blue-700 border border-blue-200',
  media:      'bg-yellow-100 text-yellow-700 border border-yellow-200',
  alta:       'bg-red-100 text-red-700 border border-red-200',
};

const STATUS_LABELS = {
  pending: 'Pendiente',
  in_review: 'En revisión',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  en_revision: 'En revisión',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta'
};

export function StatusBadge({ status, label }) {
  const badgeLabel = label || STATUS_LABELS[status] || status;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {badgeLabel}
    </span>
  );
}
