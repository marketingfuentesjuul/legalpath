import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const CATEGORIES = [
  'Civil', 'Penal', 'Laboral', 'Inmobiliario', 'Familia', 'Migratorio', 'Comercial', 'Tributario', 'Administrativo', 'Otro'
];

export default function PublicarCasoCliente() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // User Session Info
  const [user, setUser] = useState(null);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Otro');
  const [urgency, setUrgency] = useState('media');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [attachments, setAttachments] = useState([]);

  // Flow & Loading States
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigate('/auth/login', { replace: true });
      } else {
        setUser(currentUser);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => {
        const combined = [...prev, ...newFiles];
        if (combined.length > 5) {
          alert('Solo puedes subir un máximo de 5 documentos.');
          return combined.slice(0, 5);
        }
        return combined;
      });
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('La descripción es obligatoria para publicar el caso.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Insert Case in DB
      const caseTitle = title.trim() || `Consulta sobre Derecho ${category}`;
      const { data: caseData, error: caseError } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          client_email: user.email,
          title: caseTitle,
          description: description,
          category: category,
          urgency: urgency,
          region: region.trim() || null,
          city: city.trim() || null,
          admin_status: 'en_revision',
          status: 'pending'
        })
        .select()
        .single();

      if (caseError) throw caseError;

      // 2. Upload attachments if any
      if (attachments.length > 0) {
        for (const file of attachments) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${caseData.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documentos-casos')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type
            });

          if (uploadError) {
            throw new Error(`Error al subir ${file.name}: ${uploadError.message}`);
          }

          const { data: publicUrlData } = supabase.storage
            .from('documentos-casos')
            .getPublicUrl(fileName);

          const publicUrl = publicUrlData?.publicUrl || (publicUrlData?.data ? publicUrlData.data.publicUrl : null);

          if (!publicUrl) {
            throw new Error(`No se pudo obtener la URL de ${file.name}`);
          }

          const { error: docError } = await supabase
            .from('documents')
            .insert({
              case_id: caseData.id,
              uploaded_by: user.id,
              storage_url: publicUrl,
              file_name: file.name,
              file_type: file.type || null,
              file_size: file.size || null,
            });

          if (docError) throw docError;
        }
      }

      setSubmitSuccess(true);
    } catch (err) {
      console.error('Error publishing case:', err);
      setErrorMsg(err.message || 'Ocurrió un error inesperado al publicar tu caso.');
    } finally {
      setLoading(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="max-w-xl mx-auto mt-8 bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#1ECCA7]/10 flex items-center justify-center text-[#1ECCA7] mx-auto">
          <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">¡Tu caso ha sido publicado!</h2>
          <p className="text-slate-400 text-sm font-semibold leading-relaxed">
            Hemos recibido los detalles de tu consulta. Tu caso está actualmente en revisión por nuestro equipo administrativo y se publicará en el marketplace a la brevedad.
          </p>
        </div>
        <div className="bg-[#f0fdf9] border border-[#1ECCA7]/25 rounded-2xl p-4 inline-flex items-center gap-3">
          <span className="material-symbols-outlined text-[#006b56] text-[20px]">info</span>
          <p className="text-xs text-[#006b56] font-semibold text-left">
            Te notificaremos a <strong>{user?.email}</strong> una vez que sea aprobado.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/cliente/mis-casos"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-teal-700 to-[#1ECCA7] hover:shadow-lg hover:shadow-[#1ECCA7]/25 hover:scale-[1.01] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Volver a Mis Casos</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Back link */}
      <div className="flex items-center gap-3">
        <Link
          to="/cliente/mis-casos"
          className="p-2 border border-slate-200 rounded-xl bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer flex items-center shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Publicar Nuevo Caso</h2>
          <p className="text-slate-400 text-sm font-semibold">
            Completa la información detallando tu problema legal.
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span className="font-semibold">{errorMsg}</span>
            </div>
          )}

          {/* Title / Summary */}
          <div className="space-y-1.5">
            <label htmlFor="case-title" className="block text-[13px] font-bold text-slate-700">
              Título o Resumen Breve (Opcional)
            </label>
            <input
              type="text"
              id="case-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Problema con contrato de arriendo"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1ECCA7]/50 focus:border-[#1ECCA7] outline-none transition-shadow font-semibold"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="case-description" className="block text-[13px] font-bold text-slate-700">
              Descripción del Caso <span className="text-red-500">*</span>
            </label>
            <textarea
              id="case-description"
              rows={6}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cuéntanos en detalle lo que sucede, quiénes están involucrados, fechas y qué tipo de solución buscas..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1ECCA7]/50 focus:border-[#1ECCA7] outline-none transition-shadow leading-relaxed"
            />
          </div>

          {/* Category & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="case-category" className="block text-[13px] font-bold text-slate-700">
                Categoría / Especialidad
              </label>
              <div className="relative">
                <select
                  id="case-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1ECCA7]/50 outline-none cursor-pointer appearance-none text-slate-700 font-semibold"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="case-urgency" className="block text-[13px] font-bold text-slate-700">
                Nivel de Urgencia
              </label>
              <div className="relative">
                <select
                  id="case-urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1ECCA7]/50 outline-none cursor-pointer appearance-none text-slate-700 font-semibold"
                >
                  <option value="baja">Baja (Sin apuro)</option>
                  <option value="media">Media (Pronto)</option>
                  <option value="alta">Alta (Urgente)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Region & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="case-region" className="block text-[13px] font-bold text-slate-700">
                Región (Opcional)
              </label>
              <input
                type="text"
                id="case-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Ej: Metropolitana"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1ECCA7]/50 focus:border-[#1ECCA7] outline-none transition-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="case-city" className="block text-[13px] font-bold text-slate-700">
                Ciudad / Comuna (Opcional)
              </label>
              <input
                type="text"
                id="case-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ej: Santiago"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1ECCA7]/50 focus:border-[#1ECCA7] outline-none transition-shadow"
              />
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-3 pt-2">
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachments.length >= 5}
              className={`flex items-center gap-3 py-3 px-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-500 w-full text-left ${attachments.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[14px] font-bold text-slate-700">Adjuntar documentos</span>
                <span className="text-[12px] text-slate-400 font-medium">
                  {attachments.length >= 5 ? '(Límite de 5 documentos alcanzado)' : 'Sube hasta 5 imágenes, PDFs o documentos'}
                </span>
              </div>
            </button>

            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200">
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="hover:text-red-500 transition-colors flex items-center"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1ECCA7] hover:bg-[#1bb896] hover:shadow-lg hover:shadow-[#1ECCA7]/25 text-white font-black text-sm rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span>Publicando...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  <span>Publicar Caso</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
