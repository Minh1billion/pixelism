"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../api/auth.client';
import { AuthValidators } from '../../../shared/utils/validators';
import { useAuthContext } from '../context/AuthContext';
import type { RegisterRequest } from '@/features/auth/types/auth.types';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuthContext();

  const sendOtp = async (email: string) => {
    setLoading(true);
    setError(null);

    const emailError = AuthValidators.validateEmail(email);
    if (emailError) { setError(emailError); setLoading(false); return; }

    try {
      await AuthService.sendRegistrationOtp(email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);

    const usernameError = AuthValidators.validateUsername(data.username);
    if (usernameError) { setError(usernameError); setLoading(false); return; }

    const fullNameError = AuthValidators.validateFullName(data.fullName);
    if (fullNameError) { setError(fullNameError); setLoading(false); return; }

    const passwordError = AuthValidators.validatePassword(data.password);
    if (passwordError) { setError(passwordError); setLoading(false); return; }

    const matchError = AuthValidators.validatePasswordMatch(data.password, data.confirmPassword);
    if (matchError) { setError(matchError); setLoading(false); return; }

    const otpError = AuthValidators.validateOtp(data.otp);
    if (otpError) { setError(otpError); setLoading(false); return; }

    try {
      await AuthService.register(data);
      refreshUser();
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, register, loading, error, otpSent };
};