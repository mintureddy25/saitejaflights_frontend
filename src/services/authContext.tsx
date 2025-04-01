import React, { createContext, useEffect, ReactNode, useContext, useState } from 'react';
import { supabase } from './supabase'; 
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/userSlice';
import { RootState } from './store';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const userFromState = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userFromState) {
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const { data: { session }, } = await supabase.auth.getSession();
        if (session?.user) {
          dispatch(setUser(session.user));
        }// Specify the HTTP method
        if (session?.access_token) {
          localStorage.setItem('access_token', session.access_token);
        }        
      } catch (error) {
        console.error('Error fetching session:', error);
      }
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, userFromState]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user: userFromState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
