import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminGuard({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('loading'); // 'loading' | 'authorized' | 'unauthorized'

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setStatus('unauthorized');
          return;
        }

        const { data, error } = await supabase
          .from('admin_profiles')
          .select('id')
          .eq('id', user.id)
          .eq('is_active', true)
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
    checkAdmin();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="relative flex flex-col items-center justify-center">
          {/* Círculo celeste de carga alrededor del logo */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* El spinner circular celeste con un track sutil */}
            <div className="absolute inset-0 border-4 border-sky-400/20 border-t-sky-400 rounded-full animate-spin"></div>
            {/* El logo en el centro */}
            <img
              src="/assets/images/logo-loading.png"
              alt="LegalPath Logo"
              className="w-24 h-24 object-contain relative z-10"
            />
          </div>
          <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mt-6 animate-pulse">
            Verificando credenciales...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}

