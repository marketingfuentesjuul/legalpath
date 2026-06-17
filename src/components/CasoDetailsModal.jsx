import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { DocumentViewer } from './ui/DocumentViewer';

export default function CasoDetailsModal({ caso, isOpen, onClose }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !caso?.id) return;

    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('case_id', caso.id);

        if (error) throw error;
        setDocuments(data || []);
      } catch (err) {
        console.error('Error fetching case documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [isOpen, caso]);

  if (!isOpen || !caso) return null;

  const {
    title,
    description,
    polished_description,
    category,
    urgency,
    region,
    city,
    created_at
  } = caso;

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
      return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-700">Alta</span>;
    }
    if (val === 'media' || val === 'medium') {
      return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700">Media</span>;
    }
    return <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">Baja</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100/50 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Cerrar"
        >
          <span className="material-symbols-outlined text-[20px] block">close</span>
        </button>

        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-[#1ECCA7]">folder_open</span>
          Detalles del Caso
        </h3>

        <div className="overflow-y-auto pr-1 space-y-5 flex-1">
          {/* Title */}
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Título del caso</span>
            <p className="text-base font-extrabold text-slate-800">{title || 'Caso sin título'}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Categoría</span>
              <span className="text-xs font-bold text-slate-700 mt-1 inline-block">{category || 'General'}</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Urgencia</span>
              <div className="mt-1">{getUrgencyBadge(urgency)}</div>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Ubicación</span>
              <span className="text-xs font-bold text-slate-700 mt-1 inline-block">
                {region ? `${city ? `${city}, ` : ''}${region}` : 'No especificada'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Fecha de Publicación</span>
              <span className="text-xs font-bold text-slate-700 mt-1 inline-block">{formatDate(created_at)}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Descripción del cliente</span>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
              {description}
            </div>
          </div>

          {/* Polished Description (if available) */}
          {polished_description && (
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Descripción pulida (Marketplace)</span>
              <div className="bg-teal-50/30 border border-teal-100/50 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                {polished_description}
              </div>
            </div>
          )}

          {/* Attached Documents */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Documentos Adjuntos</span>
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                <div className="w-4 h-4 border-2 border-[#1ECCA7]/20 border-t-[#1ECCA7] rounded-full animate-spin"></div>
                Cargando documentos...
              </div>
            ) : documents.length > 0 ? (
              <DocumentViewer documents={documents} />
            ) : (
              <p className="text-xs italic text-slate-400">No hay documentos adjuntos en este caso.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
