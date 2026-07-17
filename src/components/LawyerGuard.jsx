import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function LawyerGuard({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // 'loading' | 'authorized' | 'pending_verification' | 'unauthorized'

  useEffect(() => {
    const checkLawyer = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setStatus('unauthorized');
          return;
        }

        const { data, error } = await supabase
          .from('lawyer_profiles')
          .select('role, verification_status')
          .eq('id', user.id)
          .maybeSingle();

        if (error || !data) {
          setStatus('unauthorized');
        } else if (data.verification_status !== 'approved') {
          setStatus('pending_verification');
        } else {
          setStatus('authorized');
        }
      } catch (err) {
        setStatus('unauthorized');
      }
    };
    checkLawyer();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-orange-400/20 border-t-orange-400 rounded-full animate-spin"></div>
            <img
              src="/assets/images/logo-light.png"
              alt="LegalPath Logo"
              className="w-24 h-24 object-contain relative z-10"
            />
          </div>
          <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase mt-6 animate-pulse">
            Verificando cuenta...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/auth/login-abogado" replace />;
  }

  if (status === 'pending_verification') {
    return <Navigate to="/auth/validacion" replace />;
  }

  return children;
}
