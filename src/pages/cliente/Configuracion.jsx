import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Configuracion() {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  // Form State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error('Usuario no autenticado.');

      const { data, error: fetchErr } = await supabase
        .from('client_profiles')
        .select('first_name, last_name_paternal, email, created_at')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      setProfile(data || {
        first_name: 'Usuario',
        last_name_paternal: 'Registrado',
        email: user.email,
        created_at: user.created_at
      });

    } catch (err) {
      console.error('Error fetching client profile:', err);
      setErrorProfile(err.message || 'No se pudieron cargar tus datos de perfil.');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!password || !confirmPassword) {
      setErrorMsg('Por favor completa ambos campos de contraseña.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccessMsg('Tu contraseña ha sido actualizada exitosamente.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      setErrorMsg(err.message || 'No se pudo actualizar la contraseña.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#1ECCA7]/20 border-t-[#1ECCA7] rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-bold text-sm tracking-wide animate-pulse">Cargando configuración...</p>
      </div>
    );
  }

  if (errorProfile) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
        <h3 className="text-lg font-bold text-red-800 mb-2">Error al cargar datos</h3>
        <p className="text-sm text-red-600 mb-4">{errorProfile}</p>
        <button
          onClick={fetchProfile}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const fullName = profile
    ? `${profile.first_name || ''} ${profile.last_name_paternal || ''}`.trim()
    : 'Cliente';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Configuración de la Cuenta</h2>
        <p className="text-slate-400 text-sm font-semibold">
          Administra tus credenciales de acceso y visualiza tus datos personales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card: Account Info (Read Only) */}
        <div className="md:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm self-start space-y-6">
          <div className="text-center pb-4 border-b border-slate-50">
            <div className="w-20 h-20 rounded-full bg-[#1ECCA7]/10 flex items-center justify-center text-[#006b56] font-black text-2xl border border-[#1ECCA7]/20 mx-auto mb-4">
              {fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'C'}
            </div>
            <h3 className="font-extrabold text-slate-800 text-lg leading-tight truncate">
              {fullName}
            </h3>
            <span className="text-[10px] font-black bg-[#1ECCA7]/20 text-[#006b56] px-2 py-0.5 rounded-full uppercase tracking-wider mt-2 inline-block">
              Cliente
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                Correo electrónico
              </span>
              <span className="text-sm font-semibold text-slate-700 break-all">
                {profile?.email}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                Fecha de registro
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {formatDate(profile?.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Security / Password Update */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1ECCA7] text-[22px]">lock</span>
            Seguridad y Contraseña
          </h3>

          <form onSubmit={handlePasswordChange} className="space-y-5">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span className="font-semibold">{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="font-semibold">{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="pass" className="block text-[13px] font-bold text-slate-700">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1ECCA7]/50 focus:border-[#1ECCA7] outline-none transition-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPass" className="block text-[13px] font-bold text-slate-700">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                id="confirmPass"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1ECCA7]/50 focus:border-[#1ECCA7] outline-none transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 bg-[#1ECCA7] hover:bg-[#1bb896] hover:shadow-lg hover:shadow-[#1ECCA7]/25 text-white font-bold text-sm rounded-xl transition-all flex justify-center items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <span>Actualizando...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">vpn_key</span>
                  <span>Cambiar contraseña</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
