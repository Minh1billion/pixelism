"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../api/auth.client';
import { AuthValidators } from '../../../shared/utils/validators';
import { useAuthContext } from '../context/AuthContext';
import type { LoginRequest } from '@/features/auth/types/auth.types';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshUser } = useAuthContext();

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);

    const emailError = AuthValidators.validateEmail(data.email);
    if (emailError) { setError(emailError); setLoading(false); return; }

    const passwordError = AuthValidators.validatePassword(data.password);
    if (passwordError) { setError(passwordError); setLoading(false); return; }

    try {
      await AuthService.login(data);
      refreshUser();
      router.push('/kingdom');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};