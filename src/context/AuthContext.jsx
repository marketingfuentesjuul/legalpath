import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en la sesión (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
    // Función para detectar si el usuario es "Anónimo" (Guest)
    isAnonymous: user?.is_anonymous ?? false,
    // Función para obtener el perfil completo si es necesario
    getProfile: async () => {
      if (!user) return null;
      
      // Primero intentamos buscar en lawyer_profiles
      let { data: lawyerData, error: lawyerError } = await supabase
        .from('lawyer_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (lawyerData) {
        return { data: { ...lawyerData, isLawyer: true }, error: null };
      }
      
      // Si no existe, buscamos en client_profiles
      let { data: clientData, error: clientError } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      return { data: clientData ? { ...clientData, isLawyer: false } : null, error: clientError };
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
