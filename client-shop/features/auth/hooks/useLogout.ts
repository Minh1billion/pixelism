"use client";

import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';

export const useLogout = () => {
  const { logout } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return { logout: handleLogout, loading };
};