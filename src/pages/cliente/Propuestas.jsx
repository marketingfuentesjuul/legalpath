import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import ProposalCard from '../../components/ProposalCard';

export default function Propuestas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const caseIdFilter = searchParams.get('caso');

  const [propuestas, setPropuestas] = useState([]);
  const [casosMap, setCasosMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPropuestas = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error('Usuario no autenticado.');

      // Fetch proposals with inner join on cases to filter by user_id
      const { data, error: fetchErr } = await supabase
        .from('proposals')
        .select(`
          id,
          case_id,
          message,
          estimated_price,
          status,
          created_at,
          lawyer_id,
          lawyer_profiles (
            first_name,
            last_name_paternal,
            specialties,
            region,
            avatar_url
          ),
          cases!proposals_case_id_fkey!inner (
            id,
            title,
            status,
            admin_status,
            user_id
          )
        `)
        .eq('cases.user_id', user.id)
        .eq('status', 'enviada') // only pending ones
        .order('created_at', { ascending: true });

      if (fetchErr) throw fetchErr;

      setPropuestas(data || []);

      // Build case details lookup dictionary
      const casesDict = {};
      (data || []).forEach(prop => {
        if (prop.cases) {
          casesDict[prop.case_id] = prop.cases;
        }
      });
      setCasosMap(casesDict);

    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError(err.message || 'No se pudieron cargar las propuestas.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropuestas();

    // Suscripción en tiempo real para propuestas y casos
    const channel = supabase
      .channel('realtime:client_proposals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'proposals' },
        (payload) => {
          console.log('Cambio en tiempo real detectado en propuestas:', payload);
          fetchPropuestas(true);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cases' },
        (payload) => {
          console.log('Cambio en tiempo real detectado en casos:', payload);
          fetchPropuestas(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Action: Accept Proposal
  const handleAcceptProposal = async (proposalId, caseId) => {
    try {
      // 1. Mark the winning proposal as accepted
      const { error: err1 } = await supabase
        .from('proposals')
        .update({ status: 'aceptada' })
        .eq('id', proposalId);
      if (err1) throw err1;

      // 2. Update case status & link proposal
      const { error: err2 } = await supabase
        .from('cases')
        .update({
          accepted_proposal_id: proposalId,
          status: 'en_progreso'
        })
        .eq('id', caseId);
      if (err2) throw err2;

      // 3. Reject all other proposals for the same case
      const { error: err3 } = await supabase
        .from('proposals')
        .update({ status: 'rechazada' })
        .eq('case_id', caseId)
        .neq('id', proposalId)
        .eq('status', 'enviada');
      if (err3) throw err3;

      // Reload data
      await fetchPropuestas();
      alert('¡Propuesta aceptada con éxito! El caso ya se encuentra en progreso con el abogado asignado.');
    } catch (err) {
      console.error('Error accepting proposal:', err);
      throw new Error(err.message || 'Error al procesar la aceptación de la propuesta.');
    }
  };

  // Action: Reject Proposal
  const handleRejectProposal = async (proposalId) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .update({ status: 'rechazada' })
        .eq('id', proposalId);
      if (error) throw error;

      // Reload data
      await fetchPropuestas();
    } catch (err) {
      console.error('Error rejecting proposal:', err);
      throw new Error(err.message || 'Error al rechazar la propuesta.');
    }
  };

  // Action: Reject All Proposals for a Case
  const handleRejectAllProposals = async (caseId) => {
    if (window.confirm('¿Estás seguro? Esto rechazará todas las propuestas y el caso seguirá disponible para nuevos abogados.')) {
      try {
        const { error } = await supabase
          .from('proposals')
          .update({ status: 'rechazada' })
          .eq('case_id', caseId)
          .eq('status', 'enviada');
        if (error) throw error;

        // Reload data
        await fetchPropuestas();
        alert('Todas las propuestas para este caso han sido rechazadas.');
      } catch (err) {
        console.error('Error rejecting all proposals:', err);
        alert(err.message || 'Error al rechazar todas las propuestas.');
      }
    }
  };

  // Filter proposals if URL param ?caso=id is present
  const filteredPropuestas = caseIdFilter
    ? propuestas.filter(p => p.case_id === caseIdFilter)
    : propuestas;

  // Group proposals by case_id
  const groupedProposals = {};
  filteredPropuestas.forEach(prop => {
    if (!groupedProposals[prop.case_id]) {
      groupedProposals[prop.case_id] = [];
    }
    groupedProposals[prop.case_id].push(prop);
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#1ECCA7]/20 border-t-[#1ECCA7] rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold text-sm tracking-wide animate-pulse">Cargando propuestas recibidas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
        <h3 className="text-lg font-bold text-red-800 mb-2">Error al cargar propuestas</h3>
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchPropuestas}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const hasPropuestas = Object.keys(groupedProposals).length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Propuestas Recibidas</h2>
          <p className="text-slate-400 text-sm font-semibold">
            Revisa los honorarios y mensajes de los abogados interesados en tus casos.
          </p>
        </div>

        {caseIdFilter && (
          <button
            onClick={() => setSearchParams({})}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-bold transition-all cursor-pointer self-start"
          >
            <span className="material-symbols-outlined text-[18px]">clear_all</span>
            <span>Ver todas las propuestas</span>
          </button>
        )}
      </div>

      {/* Grouped proposals render */}
      {hasPropuestas ? (
        <div className="space-y-8">
          {Object.entries(groupedProposals).map(([caseId, caseProps]) => {
            const caseInfo = casosMap[caseId];
            const caseTitle = caseInfo?.title || 'Caso Asignado';

            return (
              <div key={caseId} className="bg-slate-100/30 rounded-3xl p-6 border border-slate-200/50 space-y-4">
                {/* Group Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-6 bg-[#1ECCA7] rounded-full"></span>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">
                      Caso: {caseTitle}
                    </h3>
                  </div>
                  <Link
                    to={`/cliente/mis-casos`}
                    className="text-xs font-bold text-[#006b56] hover:underline flex items-center gap-0.5"
                  >
                    Ver detalles del caso
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </Link>
                </div>

                {/* Proposals Cards List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {caseProps.map(prop => (
                    <ProposalCard
                      key={prop.id}
                      proposal={prop}
                      onAccept={handleAcceptProposal}
                      onReject={handleRejectProposal}
                    />
                  ))}
                </div>

                {/* Reject All proposals button for this case */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleRejectAllProposals(caseId)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/60 rounded-xl border border-red-100 hover:border-red-200 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                    <span>Rechazar todas las propuestas de este caso</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm max-w-xl mx-auto mt-6">
          <div className="w-16 h-16 rounded-full bg-[#1ECCA7]/10 flex items-center justify-center text-[#1ECCA7] mx-auto mb-6">
            <span className="material-symbols-outlined text-[36px]">mark_email_unread</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-2">No hay propuestas pendientes</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
            {caseIdFilter
              ? 'No tienes propuestas pendientes en este caso. Las propuestas que ya aceptaste o rechazaste no se muestran aquí.'
              : 'Aún no has recibido propuestas para tus casos activos. Te notificaremos cuando un abogado compre tu caso y envíe una propuesta.'}
          </p>
          <Link
            to="/cliente/mis-casos"
            className="inline-flex items-center gap-2 py-3 px-6 rounded-2xl text-sm font-bold text-white bg-[#1ECCA7] hover:bg-[#1bb896] hover:shadow-lg hover:shadow-[#1ECCA7]/25 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Volver a Mis Casos</span>
          </Link>
        </div>
      )}
    </div>
  );
}
