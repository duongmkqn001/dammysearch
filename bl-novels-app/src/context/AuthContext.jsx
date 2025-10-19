import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'reader', 'translator', 'admin'

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setIsLoggedIn(true);
          setUserType(user.user_type || user.role);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email, password, type) => {
    setLoading(true);
    try {
      let table = 'user_accounts';
      let query = supabase
        .from(table)
        .select('*')
        .eq('email', email)
        .eq('password_hash', btoa(password));

      // Filter by user_type if provided
      if (type === 'reader' || type === 'translator') {
        query = query.eq('user_type', type);
      } else if (type === 'admin') {
        query = query.eq('role', 'admin');
      }

      const { data, error } = await query.single();

      if (error || !data) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      setCurrentUser(data);
      setIsLoggedIn(true);
      setUserType(data.user_type || data.role);
      
      // Persist to localStorage
      localStorage.setItem('currentUser', JSON.stringify(data));
      
      return { success: true, user: data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (email, username, password, type) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_accounts')
        .insert([{
          email,
          username,
          password_hash: btoa(password),
          user_type: type, // 'reader' or 'translator'
          role: 'user',
          is_active: true
        }])
        .select();

      if (error) throw error;

      return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setUserType(null);
    localStorage.removeItem('currentUser');
  }, []);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return currentUser?.role === 'admin';
  }, [currentUser]);

  // Check if user is translator
  const isTranslator = useCallback(() => {
    return currentUser?.user_type === 'translator';
  }, [currentUser]);

  // Check if user is reader
  const isReader = useCallback(() => {
    return currentUser?.user_type === 'reader';
  }, [currentUser]);

  const value = {
    currentUser,
    isLoggedIn,
    loading,
    userType,
    login,
    register,
    logout,
    isAdmin,
    isTranslator,
    isReader
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

