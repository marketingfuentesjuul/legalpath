import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LawyerInfoModal({ lawyerId, isOpen, onClose }) {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !lawyerId) return;

    const fetchLawyerData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch profile
        const { data: profileData, error: profileErr } = await supabase
          .from('lawyer_profiles')
          .select('*')
          .eq('id', lawyerId)
          .maybeSingle();

        if (profileErr) throw profileErr;
        setProfile(profileData);

        // Fetch education
        const { data: eduData, error: eduErr } = await supabase
          .from('lawyer_education')
          .select('*')
          .eq('profile_id', lawyerId)
          .order('graduation_year', { ascending: false });

        if (eduErr) throw eduErr;
        setEducation(eduData || []);
      } catch (err) {
        console.error('Error fetching lawyer data:', err);
        setError('No se pudo cargar la información del abogado.');
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerData();
  }, [isOpen, lawyerId]);

  if (!isOpen) return null;

  const lawyerName = profile
    ? `${profile.first_name || ''} ${profile.last_name_paternal || ''}`.trim()
    : 'Abogado';

  // Format initials
  const getInitials = () => {
    if (!profile) return 'A';
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name_paternal?.[0] || '';
    return (first + last).toUpperCase() || 'A';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100/50 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Cerrar"
        >
          <span className="material-symbols-outlined text-[20px] block">close</span>
        </button>

        <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-[#1ECCA7]">gavel</span>
          Detalles del Abogado
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#1ECCA7]/20 border-t-[#1ECCA7] rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-slate-400 font-bold tracking-wide">Cargando información actualizada...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : profile ? (
          <div className="overflow-y-auto pr-1 space-y-5 flex-1">
            {/* Header info */}
            <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[#1ECCA7]/10 flex items-center justify-center text-[#006b56] font-black text-xl border border-[#1ECCA7]/20 flex-shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={lawyerName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerText = getInitials();
                    }}
                  />
                ) : (
                  getInitials()
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-slate-800 text-base truncate">
                  {lawyerName}
                </h4>
                {profile.region && (
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-0.5 mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    <span>{profile.region}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006b56]">gavel</span>
                Áreas de Especialidad
              </h5>
              {profile.specialties && profile.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pl-0.5">
                  {profile.specialties.map((spec) => (
                    <span key={spec} className="px-2.5 py-1 rounded-lg bg-[#1ECCA7]/10 text-[#006b56] font-bold text-[11px] border border-[#1ECCA7]/10">
                      {spec}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic pl-0.5">Abogado General (Sin especialidades especificadas)</p>
              )}
            </div>

            {/* Preference Region */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006b56]">location_on</span>
                Preferencia Geográfica
              </h5>
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 text-xs text-slate-700 pl-3">
                <p className="font-semibold text-slate-700">{profile.region || 'No especificada'}</p>
                {profile.city && <p className="text-slate-400 mt-0.5">{profile.city}</p>}
              </div>
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#006b56]">school</span>
                Educación / Formación Académica
              </h5>
              {education.length > 0 ? (
                <div className="space-y-2 pl-0.5">
                  {education.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-[#1ECCA7] pl-3 py-0.5">
                      <p className="text-xs font-bold text-slate-700 capitalize">
                        {edu.study_level === 'pregrado' ? 'Licenciatura / Grado' : edu.study_level === 'postgrado' ? 'Magíster / Postgrado' : edu.study_level === 'diplomado' ? 'Diplomado' : edu.study_level === 'doctorado' ? 'Doctorado' : edu.study_level}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {edu.institution} — Egreso en {edu.graduation_year}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs italic pl-0.5">No hay antecedentes académicos registrados.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            No se encontró el perfil del abogado.
          </div>
        )}
      </div>
    </div>
  );
}
