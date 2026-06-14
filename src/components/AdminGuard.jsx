import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminGuard({ children }) {
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-medium tracking-wide">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/" replace />;
  }

  return children;
}
