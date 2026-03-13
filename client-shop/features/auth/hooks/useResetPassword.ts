"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../api/auth.client';
import { AuthValidators } from '../../../shared/utils/validators';
import { useAuthContext } from '../context/AuthContext';
import type { ResetPasswordRequest } from '@/features/auth/types/auth.types';

export const useResetPassword = () => {
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
      await AuthService.sendResetPasswordOtp(email);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    setLoading(true);
    setError(null);

    const otpError = AuthValidators.validateOtp(data.otp);
    if (otpError) { setError(otpError); setLoading(false); return; }

    const passwordError = AuthValidators.validatePassword(data.newPassword);
    if (passwordError) { setError(passwordError); setLoading(false); return; }

    const matchError = AuthValidators.validatePasswordMatch(data.newPassword, data.confirmPassword);
    if (matchError) { setError(matchError); setLoading(false); return; }

    try {
      await AuthService.resetPassword(data);
      refreshUser();
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendOtp, resetPassword, loading, error, otpSent };
};