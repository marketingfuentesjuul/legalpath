import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ClienteGuard({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // 'loading' | 'authorized' | 'unauthorized'

  useEffect(() => {
    const checkClient = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setStatus('unauthorized');
          return;
        }

        const { data, error } = await supabase
          .from('client_profiles')
          .select('id, role')
          .eq('id', user.id)
          .maybeSingle();

        if (error || !data) {
          setStatus('unauthorized');
        } else {
          setStatus('authorized');
        }
      } catch (err) {
        setStatus('unauthorized');
      }
    };
    checkClient();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Mint green spinner */}
            <div className="absolute inset-0 border-4 border-[#1ECCA7]/20 border-t-[#1ECCA7] rounded-full animate-spin"></div>
            <img
              src="/assets/images/logo-light.png"
              alt="LegalPath Logo"
              className="w-24 h-24 object-contain relative z-10"
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=Legal+Path&background=1ecca7&color=fff";
              }}
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
    // If not authenticated, redirect to login, else redirect to home
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
