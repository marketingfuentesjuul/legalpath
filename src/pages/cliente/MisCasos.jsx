import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import CasoCard from '../../components/CasoCard';

export default function MisCasos() {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('todos'); // 'todos' | 'activos' | 'revision' | 'progreso'

  const fetchCasos = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error('Usuario no autenticado.');

      const { data, error: fetchErr } = await supabase
        .from('cases')
        .select(`
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
          accepted_proposal_id,
          proposals:accepted_proposal_id (
            id,
            case_id,
            message,
            estimated_price,
            status,
            created_at,
            lawyer_id,
            lawyer_profiles (
              id,
              first_name,
              last_name_paternal,
              specialties,
              region,
              avatar_url,
              lawyer_education (
                id,
                study_level,
                institution,
                graduation_year
              )
            )
          ),
          received_at,
          created_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setCasos(data || []);
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError(err.message || 'No se pudieron cargar tus casos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasos();
  }, []);

  // Filter cases based on active tab
  const filteredCasos = casos.filter(caso => {
    if (activeTab === 'todos') return true;
    if (activeTab === 'activos') {
      return caso.admin_status === 'aprobado' && caso.status === 'activo';
    }
    if (activeTab === 'revision') {
      return caso.admin_status === 'en_revision';
    }
    if (activeTab === 'progreso') {
      return caso.status === 'en_progreso';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#1ECCA7]/20 border-t-[#1ECCA7] rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold text-sm tracking-wide animate-pulse">Cargando tus casos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
        <h3 className="text-lg font-bold text-red-800 mb-2">Ocurrió un error</h3>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCasos}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mis Casos Publicados</h2>
          <p className="text-slate-400 text-sm font-semibold">
            Gestiona tus solicitudes y revisa el estado de tus publicaciones.
          </p>
        </div>
        <Link
          to="/cliente/publicar-caso"
          className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-teal-700 to-[#1ECCA7] hover:shadow-lg hover:shadow-[#1ECCA7]/25 hover:scale-[1.01] transition-all cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Publicar nuevo caso</span>
        </Link>
      </div>

      {/* Tabs Menu */}
      {casos.length > 0 && (
        <div className="border-b border-slate-100 flex gap-2 overflow-x-auto pb-px">
          {[
            { id: 'todos', label: 'Todos', count: casos.length },
            { id: 'activos', label: 'Activos', count: casos.filter(c => c.admin_status === 'aprobado' && c.status === 'activo').length },
            { id: 'revision', label: 'En revisión', count: casos.filter(c => c.admin_status === 'en_revision').length },
            { id: 'progreso', label: 'Con abogado', count: casos.filter(c => c.status === 'en_progreso').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#1ECCA7] text-[#006b56]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                activeTab === tab.id ? 'bg-[#1ECCA7]/20 text-[#006b56]' : 'bg-slate-100 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Grid Content */}
      {filteredCasos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCasos.map(caso => (
            <CasoCard key={caso.id} caso={caso} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm max-w-xl mx-auto mt-6">
          <div className="w-16 h-16 rounded-full bg-[#1ECCA7]/10 flex items-center justify-center text-[#1ECCA7] mx-auto mb-6">
            <span className="material-symbols-outlined text-[36px]">folder_open</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-2">No se encontraron casos</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
            {activeTab === 'todos'
              ? 'Aún no has publicado ningún caso legal. Crea una publicación para recibir propuestas de abogados verificados.'
              : 'No hay casos que coincidan con este filtro en este momento.'}
          </p>
          {activeTab === 'todos' && (
            <Link
              to="/cliente/publicar-caso"
              className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl text-sm font-bold text-white bg-[#1ECCA7] hover:bg-[#1bb896] hover:shadow-lg hover:shadow-[#1ECCA7]/25 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Comenzar ahora</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
